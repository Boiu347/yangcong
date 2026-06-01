import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function EditDrawer({ open, onClose, title, children }: EditDrawerProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[520px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Field helpers ──────────────────────────────────────────────────────────

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export function TextField({ label, value, onChange, multiline, placeholder }: TextFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-[12px] font-medium text-gray-500 mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20"
        />
      )}
    </div>
  );
}

interface ListFieldProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function ListField({ label, items, onChange, placeholder }: ListFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-[12px] font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <textarea
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              rows={2}
              placeholder={placeholder}
              className="flex-1 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 resize-y"
            />
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors mt-0.5"
            >
              <Trash2 size={12} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...items, ''])}
        className="mt-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-blue-500 hover:bg-blue-50 border border-blue-200 transition-colors"
      >
        <Plus size={10} /> 添加
      </button>
    </div>
  );
}

interface SaveBarProps {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function SaveBar({ saving, onSave, onCancel }: SaveBarProps) {
  return (
    <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-end gap-2 bg-gray-50/50">
      <button
        onClick={onCancel}
        disabled={saving}
        className="px-4 py-2 text-[13px] text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      >
        取消
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
        保存
      </button>
    </div>
  );
}
