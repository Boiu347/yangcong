import React, { useState, useEffect } from 'react';
import { EditDrawer, TextField, ListField, SaveBar } from './EditDrawer';
import type { QualBrandEntry, QualBullet } from '../../store/defaultQualitativeData';

interface Props {
  open: boolean;
  onClose: () => void;
  entry: QualBrandEntry | null;
  saving: boolean;
  onSave: (updated: QualBrandEntry) => void;
}

export default function QualitativeEditor({ open, onClose, entry, saving, onSave }: Props) {
  const [draft, setDraft] = useState<QualBrandEntry | null>(null);

  useEffect(() => {
    if (entry) setDraft(structuredClone(entry));
  }, [entry]);

  if (!draft) return null;

  const updateBullet = (idx: number, partial: Partial<QualBullet>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const bullets = [...prev.bullets];
      bullets[idx] = { ...bullets[idx], ...partial };
      return { ...prev, bullets };
    });
  };

  const removeBullet = (idx: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, bullets: prev.bullets.filter((_, i) => i !== idx) };
    });
  };

  const addBullet = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bullets: [...prev.bullets, { text: '', evidence: [''] }],
      };
    });
  };

  return (
    <EditDrawer
      open={open}
      onClose={onClose}
      title={`编辑 · ${draft.brand}`}
    >
      <div className="space-y-5">
        <TextField
          label="品牌副标题"
          value={draft.subtitle}
          onChange={(v) => setDraft({ ...draft, subtitle: v })}
          placeholder="一句话概括该品牌在此维度的表现"
        />

        <div>
          <label className="block text-[12px] font-medium text-gray-500 mb-1.5">情感倾向</label>
          <div className="flex gap-2">
            {(['positive', 'neutral', 'negative'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setDraft({ ...draft, sentiment: s })}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                  draft.sentiment === s
                    ? s === 'positive'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                      : s === 'neutral'
                        ? 'bg-gray-100 text-gray-600 border-gray-300'
                        : 'bg-red-50 text-red-500 border-red-300'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                }`}
              >
                {s === 'positive' ? '正面' : s === 'neutral' ? '中性' : '负面'}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-[12px] font-bold text-gray-700 mb-3">洞察条目 ({draft.bullets.length})</p>
          {draft.bullets.map((bullet, idx) => (
            <div key={idx} className="mb-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">条目 {idx + 1}</span>
                <button
                  onClick={() => removeBullet(idx)}
                  className="text-[11px] text-red-400 hover:text-red-600 transition-colors"
                >
                  删除
                </button>
              </div>
              <TextField
                label="洞察文字"
                value={bullet.text}
                onChange={(v) => updateBullet(idx, { text: v })}
                multiline
                placeholder="描述洞察内容"
              />
              {bullet.tag !== undefined && (
                <TextField
                  label="标签"
                  value={bullet.tag ?? ''}
                  onChange={(v) => updateBullet(idx, { tag: v })}
                  placeholder="如: 启蒙-兴趣启蒙"
                />
              )}
              <ListField
                label="用户原声"
                items={bullet.evidence}
                onChange={(items) => updateBullet(idx, { evidence: items })}
                placeholder="原始用户引用"
              />
            </div>
          ))}
          <button
            onClick={addBullet}
            className="w-full py-2 text-[12px] text-blue-500 hover:bg-blue-50 border border-dashed border-blue-200 rounded-xl transition-colors"
          >
            + 新增洞察条目
          </button>
        </div>
      </div>

      <div className="mt-6">
        <SaveBar
          saving={saving}
          onSave={() => onSave(draft)}
          onCancel={onClose}
        />
      </div>
    </EditDrawer>
  );
}
