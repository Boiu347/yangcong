import React, { useState, useEffect } from 'react';
import { EditDrawer, TextField, SaveBar } from './EditDrawer';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CrossBrandConclusion {
  text: string;
  color: string;
}

export interface CrossBrandOverviewData {
  conclusions: CrossBrandConclusion[];
  brandSummaries: Record<string, string>;
}

const COLOR_PRESETS = ['#5B7BBF', '#BF9455', '#E07A6E', '#4BA69E', '#8B5CF6', '#D49E55', '#5BBF96'];

interface Props {
  open: boolean;
  onClose: () => void;
  data: CrossBrandOverviewData | null;
  saving: boolean;
  onSave: (updated: CrossBrandOverviewData) => void;
}

export default function CrossBrandEditor({ open, onClose, data, saving, onSave }: Props) {
  const [draft, setDraft] = useState<CrossBrandOverviewData | null>(null);
  const [activeTab, setActiveTab] = useState<'conclusions' | 'summaries'>('conclusions');

  useEffect(() => {
    if (data) setDraft(structuredClone(data));
  }, [data]);

  if (!draft) return null;

  const updateConclusion = (idx: number, partial: Partial<CrossBrandConclusion>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const conclusions = [...prev.conclusions];
      conclusions[idx] = { ...conclusions[idx], ...partial };
      return { ...prev, conclusions };
    });
  };

  const removeConclusion = (idx: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, conclusions: prev.conclusions.filter((_, i) => i !== idx) };
    });
  };

  const addConclusion = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      const usedColors = new Set(prev.conclusions.map((c) => c.color));
      const nextColor = COLOR_PRESETS.find((c) => !usedColors.has(c)) ?? '#5B7BBF';
      return {
        ...prev,
        conclusions: [...prev.conclusions, { text: '', color: nextColor }],
      };
    });
  };

  const updateBrandSummary = (brand: string, text: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, brandSummaries: { ...prev.brandSummaries, [brand]: text } };
    });
  };

  const brands = Object.keys(draft.brandSummaries);

  return (
    <EditDrawer open={open} onClose={onClose} title="编辑 · 跨品牌洞察">
      {/* Tab switcher */}
      <div className="flex gap-1 mb-5 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveTab('conclusions')}
          className={cn(
            'flex-1 py-1.5 text-[12px] font-medium rounded-md transition-all',
            activeTab === 'conclusions'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          )}
        >
          核心结论 ({draft.conclusions.length})
        </button>
        <button
          onClick={() => setActiveTab('summaries')}
          className={cn(
            'flex-1 py-1.5 text-[12px] font-medium rounded-md transition-all',
            activeTab === 'summaries'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          )}
        >
          品牌差异总结 ({brands.length})
        </button>
      </div>

      {activeTab === 'conclusions' && (
        <div className="space-y-4">
          {draft.conclusions.map((c, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-gray-400">结论 {idx + 1}</span>
                  <div className="flex gap-1">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateConclusion(idx, { color })}
                        className={cn(
                          'w-4 h-4 rounded-full border-2 transition-all',
                          c.color === color ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-110',
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeConclusion(idx)}
                  className="text-[11px] text-red-400 hover:text-red-600 transition-colors flex items-center gap-0.5"
                >
                  <Trash2 size={10} /> 删除
                </button>
              </div>
              <TextField
                label="结论内容"
                value={c.text}
                onChange={(v) => updateConclusion(idx, { text: v })}
                multiline
                placeholder="使用 **关键词** 标记重点"
              />
            </div>
          ))}
          <button
            onClick={addConclusion}
            className="w-full py-2 text-[12px] text-blue-500 hover:bg-blue-50 border border-dashed border-blue-200 rounded-xl transition-colors"
          >
            + 新增核心结论
          </button>
        </div>
      )}

      {activeTab === 'summaries' && (
        <div className="space-y-4">
          {brands.map((brand) => (
            <div key={brand} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <TextField
                label={brand}
                value={draft.brandSummaries[brand]}
                onChange={(v) => updateBrandSummary(brand, v)}
                multiline
                placeholder={`${brand}的差异化总结，使用 **关键词** 标记重点`}
              />
            </div>
          ))}
        </div>
      )}

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
