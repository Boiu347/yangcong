import React from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'yy_access_pw';

// ── Auth state (module-level, shared) ──────────────────────────────────────

let _authed = (() => {
  try {
    return !!sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
})();

const _listeners = new Set<() => void>();

export function isAuthed() {
  return _authed;
}

export function setAuthed(pw: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, pw);
  } catch { /* ignore */ }
  _authed = true;
  _listeners.forEach((fn) => fn());
}

export function getStoredPassword(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useIsAuthed() {
  const [, rerender] = React.useReducer((x: number) => x + 1, 0);
  React.useEffect(() => {
    _listeners.add(rerender);
    return () => { _listeners.delete(rerender); };
  }, []);
  return _authed;
}

// ── PasswordGate component ──────────────────────────────────────────────────

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const authed = useIsAuthed();
  const [pw, setPw] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!authed) inputRef.current?.focus();
  }, [authed]);

  const submit = async () => {
    if (!pw.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        toast.error('密码错误，请重试');
        setPw('');
        inputRef.current?.focus();
        return;
      }
      setAuthed(pw);
    } catch {
      toast.error('验证失败，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#f0f2ff] to-[#e8ecff] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#4361EE]/10 flex items-center justify-center">
          <Lock size={26} className="text-[#4361EE]" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-[18px] font-bold text-gray-900">用研项目集锦</h1>
          <p className="text-[13px] text-gray-400 mt-1">请输入访问密码</p>
        </div>

        {/* Input */}
        <div className="w-full space-y-3">
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void submit(); }}
            placeholder="访问密码"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/20 transition-all"
          />
          <button
            onClick={() => void submit()}
            disabled={loading || !pw.trim()}
            className="w-full py-3 bg-[#4361EE] text-white text-[14px] font-semibold rounded-xl hover:bg-[#3451d1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={15} className="animate-spin" />验证中…</> : '进入'}
          </button>
        </div>
      </div>
    </div>
  );
}
