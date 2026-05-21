import { VOCItem, BrandReport } from '../types/voc';
import { getStoredPassword } from '../components/auth/PasswordGate';

const BASE = '/api/ai';

/** Build auth headers (password) for every API request */
function authHeaders(): Record<string, string> {
  const pw = getStoredPassword();
  return pw ? { 'x-access-password': pw } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    // Password expired / wrong — clear session so the gate re-appears
    try { sessionStorage.removeItem('yy_access_pw'); } catch { /* ignore */ }
    window.location.reload();
    throw new Error('会话已过期，请重新输入密码');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    const msg =
      (err?.error as Record<string, unknown>)?.message as string ||
      err?.message as string ||
      `请求失败 (${res.status})`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

/** Upload an audio/video file for transcription + VOC extraction */
export async function apiTranscribeFile(
  file: File,
  fileId: string,
): Promise<{ text: string; vocList: VOCItem[]; audioUrl?: string }> {
  const form = new FormData();
  form.append('file', file);
  form.append('fileId', fileId);
  const res = await fetch(`${BASE}/transcribe`, { method: 'POST', headers: authHeaders(), body: form });
  return handleResponse(res);
}

/** Upload a document (docx/pdf/txt) for text extraction + VOC extraction */
export async function apiParseDocument(
  file: File,
): Promise<{ text: string; vocList: VOCItem[] }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/parse-document`, { method: 'POST', headers: authHeaders(), body: form });
  return handleResponse(res);
}

/** Generate AI project summary from VOC list.
 *  Tries the NestJS backend first; falls back to calling the AI gateway directly
 *  from the browser so the button works even when only the Vite dev server is running.
 */
export async function apiGenerateSummary(
  vocItems: VOCItem[],
  projectName: string,
): Promise<{ coreFindings: string[]; actionItems: string[]; methodology: string }> {
  // Try backend proxy first
  try {
    const res = await fetch(`${BASE}/generate-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ vocItems, projectName }),
      signal: AbortSignal.timeout(5000), // quick probe — if backend is down, fail fast
    });
    if (res.ok) return handleResponse(res);
  } catch {
    // Backend unreachable — fall through to client-side call
  }

  // Client-side fallback: call the AI gateway directly
  return generateSummaryClientSide(vocItems, projectName);
}

async function generateSummaryClientSide(
  vocItems: VOCItem[],
  projectName: string,
): Promise<{ coreFindings: string[]; actionItems: string[]; methodology: string }> {
  const gatewayUrl = import.meta.env.VITE_AI_GATEWAY_URL as string | undefined;
  const apiKey = import.meta.env.VITE_AI_API_KEY as string | undefined;
  const model = (import.meta.env.VITE_AI_MODEL as string | undefined) ?? 'claude-sonnet-4-6';

  if (!gatewayUrl || !apiKey) {
    throw new Error('AI 配置缺失，请确认 client/.env 中包含 VITE_AI_GATEWAY_URL 和 VITE_AI_API_KEY');
  }

  const systemPrompt = `你是一位用户研究专家。请根据以下VOC数据，生成该研究项目的总结报告。

输出格式为JSON对象，包含以下字段：
- coreFindings: 核心发现，值为字符串数组，每条是一句话的字符串（5-8条）。注意：数组元素必须是字符串，不能是对象。示例：["发现1", "发现2"]
- actionItems: 行动建议，值为字符串数组，每条是一句话的字符串（3-5条）。注意：数组元素必须是字符串。示例：["建议1", "建议2"]
- methodology: 研究方法简述，值为一段话的字符串

只输出JSON，不要其他文字。`;

  const vocText = vocItems
    .map((v) => `[${v.brand}][${v.sentiment}][${v.dimension ?? ''}] ${v.respondent}: ${v.text}`)
    .join('\n');

  const res = await fetch(`${gatewayUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `项目名称：${projectName}\n\nVOC数据：\n${vocText}` },
      ],
      max_tokens: 4096,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error((err?.error as Record<string, unknown>)?.message as string || `AI 请求失败 (${res.status})`);
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? '{}';

  // Strip markdown code fences if present
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed = JSON.parse(json) as Record<string, unknown>;

  const toStringArray = (arr: unknown): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>;
          return String(o.finding ?? o.text ?? o.content ?? o.description ?? o.item ?? JSON.stringify(item));
        }
        return String(item);
      })
      .filter(Boolean);
  };

  return {
    coreFindings: toStringArray(parsed.coreFindings),
    actionItems: toStringArray(parsed.actionItems),
    methodology: typeof parsed.methodology === 'string' ? parsed.methodology : '深度访谈 + 问卷调研',
  };
}

/** Generate competitive brand reports from VOC list */
export async function apiGenerateReport(
  vocItems: VOCItem[],
): Promise<Record<string, BrandReport>> {
  const res = await fetch(`${BASE}/generate-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vocItems }),
  });
  return handleResponse(res);
}

// ── File type detection ───────────────────────────────────────────────────

const AUDIO_EXTS = new Set(['mp3', 'mp4', 'wav', 'm4a', 'ogg', 'flac', 'webm', 'mpeg', 'aac']);
const DOC_EXTS = new Set(['pdf', 'docx', 'doc', 'txt', 'md']);

export function detectFileCategory(file: File): 'audio' | 'document' | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (AUDIO_EXTS.has(ext)) return 'audio';
  if (DOC_EXTS.has(ext)) return 'document';
  // Fall back to MIME type
  if (file.type.startsWith('audio/') || file.type.startsWith('video/')) return 'audio';
  if (file.type.includes('pdf') || file.type.includes('word') || file.type === 'text/plain') return 'document';
  return null;
}
