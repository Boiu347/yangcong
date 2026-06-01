import React, { useState, useEffect } from 'react';
import { EditDrawer, TextField, ListField, SaveBar } from './EditDrawer';
import type { BrandInsightItem, BrandInsightGroup } from '../../store/defaultCompetitiveData';

interface Props {
  open: boolean;
  onClose: () => void;
  group: BrandInsightGroup | null;
  brand: string;
  saving: boolean;
  onSave: (updated: BrandInsightGroup) => void;
}

export default function CompetitiveEditor({ open, onClose, group, brand, saving, onSave }: Props) {
  const [draft, setDraft] = useState<BrandInsightGroup | null>(null);

  useEffect(() => {
    if (group) setDraft(structuredClone(group));
  }, [group]);

  if (!draft) return null;

  const updateItem = (idx: number, partial: Partial<BrandInsightItem>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const items = [...prev.items];
      items[idx] = { ...items[idx], ...partial };
      return { ...prev, items };
    });
  };

  const removeItem = (idx: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.filter((_, i) => i !== idx) };
    });
  };

  const addItem = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [...prev.items, { l3: '', sentiment: 'neutral' as const, evidence: [''] }],
      };
    });
  };

  return (
    <EditDrawer
      open={open}
      onClose={onClose}
      title={`编辑 · ${brand} · ${draft.l1} / ${draft.l2}`}
    >
      <div className="space-y-5">
        <div className="flex gap-3">
          <div className="flex-1">
            <TextField
              label="一级维度 (L1)"
              value={draft.l1}
              onChange={(v) => setDraft({ ...draft, l1: v })}
            />
          </div>
          <div className="flex-1">
            <TextField
              label="二级维度 (L2)"
              value={draft.l2}
              onChange={(v) => setDraft({ ...draft, l2: v })}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-[12px] font-bold text-gray-700 mb-3">洞察条目 ({draft.items.length})</p>
          {draft.items.map((item, idx) => (
            <div key={idx} className="mb-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">条目 {idx + 1}</span>
                <button
                  onClick={() => removeItem(idx)}
                  className="text-[11px] text-red-400 hover:text-red-600 transition-colors"
                >
                  删除
                </button>
              </div>
              <TextField
                label="洞察 (L3)"
                value={item.l3}
                onChange={(v) => updateItem(idx, { l3: v })}
                placeholder="具体洞察描述"
              />

              <div className="mb-3">
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">情感倾向</label>
                <div className="flex gap-2">
                  {(['positive', 'neutral', 'negative'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateItem(idx, { sentiment: s })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                        item.sentiment === s
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

              <ListField
                label="用户原声"
                items={item.evidence}
                onChange={(items) => updateItem(idx, { evidence: items })}
                placeholder="原始用户引用"
              />
            </div>
          ))}
          <button
            onClick={addItem}
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
