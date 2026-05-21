import React from 'react';
import { useParams } from 'react-router-dom';
import { Upload, FileAudio, FileText, Loader2, X, AlertCircle, ClipboardPaste, Check } from 'lucide-react';
import { toast } from 'sonner';
import { projectActions, useProject } from '../../store/useProjectStore';
import {
  activeFilesActions,
  useActiveFileIds,
  DEFAULT_FILE_IDS,
  DEFAULT_FILE_LABELS,
} from '../../store/activeFilesStore';
import { apiTranscribeFile, apiParseDocument, detectFileCategory } from '../../api/ai';
import { getStoredPassword } from '../auth/PasswordGate';
import { ProjectFile, VOCItem, normalizeDimension, fileLabel } from '../../types/voc';
import { cn } from '@/lib/utils';

// ── PasteModal ─────────────────────────────────────────────────────────────

function PasteModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (name: string, text: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');

  const handleSubmit = () => {
    if (!name.trim()) { toast.error('请填写来源名称'); return; }
    if (!text.trim()) { toast.error('请粘贴文字内容'); return; }
    onSubmit(name.trim(), text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-[15px]">粘贴文字稿</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">将访谈文字记录直接粘贴，无需上传文件</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-6 overflow-y-auto flex-1">
          <div>
            <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
              来源名称 <span className="text-red-400">*</span>
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：用户访谈4 北京顺义 二年级 南开AI物理课"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#4361EE] focus:ring-1 focus:ring-[#4361EE]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
              文字内容 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="将访谈文字记录粘贴到这里"
              className="w-full h-48 px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#4361EE] focus:ring-1 focus:ring-[#4361EE] resize-none font-mono"
              onPaste={(e) => {
                if (!name && e.clipboardData) {
                  const firstLine = e.clipboardData.getData('text').split('\n')[0].trim().slice(0, 60);
                  if (firstLine) setName(firstLine);
                }
              }}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              {text.length > 0 ? `${text.length} 字` : '支持任意长度，系统会自动分段处理'}
            </p>
          </div>
        </div>
        <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !text.trim()}
            className="flex-1 py-2.5 bg-[#4361EE] text-white text-[13px] font-medium rounded-xl hover:bg-[#3451d1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            提交解析
          </button>
          <button onClick={onClose} className="px-5 py-2.5 text-gray-500 text-[13px] rounded-xl hover:bg-gray-50 transition-colors">
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main FileBar ───────────────────────────────────────────────────────────

export default function FileBar() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useProject(projectId);
  const activeIds = useActiveFileIds();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [showPaste, setShowPaste] = React.useState(false);

  // ── file processing helpers ───────────────────────────────────────────────

  const handleFiles = async (files: FileList | File[]) => {
    if (!projectId) return;
    for (const file of Array.from(files)) {
      const category = detectFileCategory(file);
      if (!category) { toast.error(`不支持的文件格式：${file.name}`); continue; }
      const fileId = crypto.randomUUID();
      projectActions.addFile(projectId, {
        id: fileId, name: file.name, category, status: 'uploading', vocList: [], uploadedAt: Date.now(),
      });
      void processFile(projectId, fileId, file, category);
    }
  };

  const handlePasteSubmit = (name: string, text: string) => {
    if (!projectId) return;
    const fileId = crypto.randomUUID();
    const fileName = name.endsWith('.txt') ? name : `${name}.txt`;
    projectActions.addFile(projectId, {
      id: fileId, name: fileName, category: 'document', status: 'uploading', vocList: [], uploadedAt: Date.now(),
    });
    void processPastedText(projectId, fileId, name, text);
  };

  const processPastedText = async (projectId: string, fileId: string, name: string, text: string) => {
    try {
      projectActions.updateFile(projectId, fileId, { status: 'processing' });
      const pw = getStoredPassword();
      const res = await fetch('/api/ai/extract-vocs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(pw ? { 'x-access-password': pw } : {}) },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as Record<string, unknown>;
        throw new Error((err?.error as Record<string, unknown>)?.message as string || `服务器错误 (${res.status})`);
      }
      const data = await res.json() as { vocList: VOCItem[] };
      const fileName = name.endsWith('.txt') ? name : `${name}.txt`;
      const enriched = data.vocList.map((v) => ({
        ...v, dimension: normalizeDimension(v.dimension), sourceFileId: fileId, sourceFileName: fileName,
      }));
      projectActions.updateFile(projectId, fileId, { status: 'ready', vocList: enriched });
      projectActions.clearReports(projectId);
      toast.success(`「${name}」解析完成，提取到 ${enriched.length} 条用户原声`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '处理失败';
      projectActions.updateFile(projectId, fileId, { status: 'error', errorMessage: msg });
      toast.error(`「${name}」处理失败：${msg}`);
    }
  };

  const processFile = async (projectId: string, fileId: string, file: File, category: 'audio' | 'document') => {
    try {
      projectActions.updateFile(projectId, fileId, { status: 'processing' });
      let vocList: VOCItem[];
      let audioUrl: string | undefined;
      if (category === 'audio') {
        const result = await apiTranscribeFile(file, fileId);
        vocList = result.vocList; audioUrl = result.audioUrl;
      } else {
        const result = await apiParseDocument(file);
        vocList = result.vocList;
      }
      const enriched = vocList.map((v) => ({
        ...v, dimension: normalizeDimension(v.dimension), sourceFileId: fileId, sourceFileName: file.name,
      }));
      projectActions.updateFile(projectId, fileId, { status: 'ready', vocList: enriched, audioUrl });
      projectActions.clearReports(projectId);
      toast.success(`「${fileLabel(file.name)}」解析完成，提取到 ${enriched.length} 条用户原声`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '处理失败';
      projectActions.updateFile(projectId, fileId, { status: 'error', errorMessage: msg });
      toast.error(`「${fileLabel(file.name)}」处理失败：${msg}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files.length > 0) void handleFiles(e.dataTransfer.files);
  };

  if (!project) return null;

  // User-uploaded files (non-default)
  const userFiles = project.files.filter((f) => !f.id.startsWith('default_file_'));
  const processingCount = userFiles.filter((f) => f.status === 'uploading' || f.status === 'processing').length;
  const allDefaultActive = DEFAULT_FILE_IDS.every((id) => activeIds.has(id));

  return (
    <>
      {showPaste && <PasteModal onSubmit={handlePasteSubmit} onClose={() => setShowPaste(false)} />}

      <div
        className={cn(
          'shrink-0 bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2 flex-wrap',
          dragging && 'bg-blue-50 border-[#4361EE]',
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {/* Label */}
        <span className="text-[10px] font-bold text-gray-400 shrink-0 uppercase tracking-wide">
          数据来源
        </span>

        {/* ── Default interview file toggles ── */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {DEFAULT_FILE_IDS.map((id) => {
            const on = activeIds.has(id);
            return (
              <button
                key={id}
                onClick={() => activeFilesActions.toggle(id)}
                title={on ? '点击取消选中' : '点击选中'}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                  on
                    ? 'bg-[#4361EE]/10 border-[#4361EE]/30 text-[#4361EE]'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300',
                )}
              >
                {on ? <Check size={9} className="shrink-0" /> : <span className="w-[9px]" />}
                {DEFAULT_FILE_LABELS[id]}
              </button>
            );
          })}

          {/* Select all / deselect shortcut */}
          {!allDefaultActive && (
            <button
              onClick={() => activeFilesActions.selectAll()}
              className="text-[10px] text-[#4361EE] hover:underline px-1"
            >
              全选
            </button>
          )}
        </div>

        {/* ── User-uploaded file chips ── */}
        {userFiles.length > 0 && (
          <>
            <div className="w-px h-4 bg-gray-200 shrink-0 mx-1" />
            {userFiles.map((f) => (
              <FileChip
                key={f.id}
                file={f}
                onRetry={f.status === 'error' ? () => projectActions.removeFile(project.id, f.id) : undefined}
                onRemove={() => {
                  if (f.status === 'ready' || f.status === 'error') {
                    projectActions.removeFile(project.id, f.id);
                    projectActions.clearReports(project.id);
                  }
                }}
              />
            ))}
          </>
        )}

        {/* Processing badge */}
        {processingCount > 0 && (
          <span className="shrink-0 flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
            <Loader2 size={10} className="animate-spin" />
            处理中 {processingCount}
          </span>
        )}

        <div className="flex-1" />

        {/* Paste text button */}
        <button
          onClick={() => setShowPaste(true)}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-[11px] font-medium hover:border-[#4361EE] hover:text-[#4361EE] transition-colors"
        >
          <ClipboardPaste size={12} />
          粘贴文本
        </button>

        {/* Upload file button */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".mp3,.mp4,.wav,.m4a,.ogg,.flac,.webm,.pdf,.docx,.doc,.txt,.md"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) { void handleFiles(e.target.files); e.target.value = ''; }
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#4361EE] text-white text-[11px] font-medium hover:bg-[#3451d1] transition-colors"
        >
          <Upload size={12} />
          上传文件
        </button>
      </div>
    </>
  );
}

// ── FileChip (user-uploaded files only) ──────────────────────────────────────

function FileChip({ file, onRemove, onRetry }: { file: ProjectFile; onRemove: () => void; onRetry?: () => void }) {
  const [hover, setHover] = React.useState(false);
  const label = fileLabel(file.name);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border shrink-0 max-w-[180px] transition-colors',
        file.status === 'ready' && 'bg-gray-50 border-gray-200 text-gray-600',
        (file.status === 'uploading' || file.status === 'processing') && 'bg-amber-50 border-amber-200 text-amber-700',
        file.status === 'error' && 'bg-red-50 border-red-200 text-red-600',
      )}
      title={file.status === 'error' ? file.errorMessage : file.name}
    >
      {file.status === 'uploading' || file.status === 'processing' ? (
        <Loader2 size={10} className="animate-spin shrink-0" />
      ) : file.status === 'error' ? (
        <AlertCircle size={10} className="shrink-0" />
      ) : file.category === 'audio' ? (
        <FileAudio size={10} className="shrink-0 text-purple-400" />
      ) : (
        <FileText size={10} className="shrink-0 text-blue-400" />
      )}
      <span className="truncate">{label}</span>
      {file.status === 'ready' && file.vocList.length > 0 && !hover && (
        <span className="shrink-0 text-[9px] text-gray-400">{file.vocList.length}</span>
      )}
      {file.status === 'error' && hover && onRetry && (
        <button onClick={(e) => { e.stopPropagation(); onRetry(); }} className="shrink-0 text-red-400 hover:text-red-600 text-[10px] font-medium">重试</button>
      )}
      {(file.status === 'ready' || file.status === 'error') && hover && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="shrink-0 text-gray-400 hover:text-red-500 ml-0.5">
          <X size={10} />
        </button>
      )}
    </div>
  );
}
