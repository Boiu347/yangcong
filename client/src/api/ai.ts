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

/** Generate AI project summary from VOC list */
export async function apiGenerateSummary(
  vocItems: VOCItem[],
  projectName: string,
): Promise<{ coreFindings: string[]; actionItems: string[]; methodology: string }> {
  const res = await fetch(`${BASE}/generate-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ vocItems, projectName }),
  });
  return handleResponse(res);
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
