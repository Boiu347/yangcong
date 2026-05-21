import React from 'react';
import { useParams } from 'react-router-dom';
import { BarChart2, ChevronDown, ChevronRight, MapPin, X } from 'lucide-react';
import { useProjectVOCs } from '../../store/useProjectStore';
import {
  DEFAULT_COMPETITIVE_DATA,
  BrandInsight,
  BrandInsightGroup,
  BrandInsightItem,
} from '../../store/defaultCompetitiveData';
import { lookupSource, shortSource } from '../../utils/sourceUtils';
import { useActiveFileIds, filterEvidenceByActiveFiles } from '../../store/activeFilesStore';
import { cn } from '@/lib/utils';

// ── Constants ────────────────────────────────────────────────────────────────

const L1_ORDER = ['启蒙认知', '购买决策', '产品体验'];

const L1_CONFIG: Record<string, { color: string; bg: string; border: string; text: string }> = {
  启蒙认知: { color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
  购买决策: { color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
  产品体验: { color: '#4361EE', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
};

const SENTIMENT_CONFIG = {
  positive: { dot: 'bg-emerald-400', tag: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: '正面' },
  neutral:  { dot: 'bg-gray-300',    tag: 'bg-gray-50 text-gray-600 border-gray-200',          label: '中性' },
  negative: { dot: 'bg-red-400',     tag: 'bg-red-50 text-red-600 border-red-200',             label: '负面' },
};

const BRAND_COLORS: Record<string, string> = {
  '洋葱':           '#FF6B6B',
  '妙懂':           '#4ECDC4',
  '万物指南':        '#45B7D1',
  'NB虚拟实验室':    '#6366F1',
  '学而思':          '#F59E0B',
  '叫叫':            '#EC4899',
  '赛先生科学课':    '#34D399',
  '南开大学AI物理课':'#F97316',
  '从小学物理':      '#8B5CF6',
};

function brandColor(brand: string) {
  return BRAND_COLORS[brand] ?? '#A78BFA';
}

// Sort and group an insight's groups by L1 → L2
function groupByL1(insight: BrandInsight): Record<string, BrandInsightGroup[]> {
  const result: Record<string, BrandInsightGroup[]> = {};
  for (const g of insight.groups) {
    // Map any variant of 产品体验 labels
    const l1 = L1_ORDER.find((l) => g.l1.includes(l)) ?? g.l1;
    if (!result[l1]) result[l1] = [];
    result[l1].push({ ...g, l1 });
  }
  return result;
}

// ── Evidence list with source tags ───────────────────────────────────────────

function EvidenceList({ evidence, brand }: { evidence: string[]; brand?: string }) {
  return (
    <div className="mt-2 space-y-1.5">
      {evidence.map((e, i) => {
        const src = lookupSource(e, brand);
        return (
          <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2">
            <p className="text-[11px] text-gray-600 leading-relaxed italic">{e}</p>
            {src && (
              <div className="flex items-center gap-0.5 mt-1">
                <MapPin size={8} className="text-gray-300 shrink-0" />
                <span className="text-[10px] text-gray-400">{shortSource(src)}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── L3 item card (click to expand evidence) ───────────────────────────────────

function InsightItem({ item, brand }: { item: BrandInsightItem; brand: string }) {
  const [open, setOpen] = React.useState(false);
  const sc = SENTIMENT_CONFIG[item.sentiment];
  const evidence = filterEvidenceByActiveFiles(item.evidence);

  return (
    <div
      className={cn(
        'rounded-lg border p-2.5 cursor-pointer transition-colors',
        open ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/60 border-gray-100 hover:border-gray-200',
      )}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-start gap-2">
        <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', sc.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[12px] font-medium text-gray-800 leading-snug">{item.l3}</span>
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', sc.tag)}>
              {sc.label}
            </span>
            {evidence.length > 0 && (
              <span className="text-[10px] text-gray-400 ml-auto shrink-0 flex items-center gap-0.5">
                {evidence.length} 条原声
                {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </span>
            )}
          </div>
          {open && evidence.length > 0 && <EvidenceList evidence={evidence} brand={brand} />}
        </div>
      </div>
    </div>
  );
}

// ── Single brand vertical view ────────────────────────────────────────────────

function SingleBrandView({ insight }: { insight: BrandInsight }) {
  const byL1 = groupByL1(insight);
  const [openL1, setOpenL1] = React.useState<Record<string, boolean>>(
    Object.fromEntries(L1_ORDER.map((l) => [l, true])),
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Brand header */}
      <div className="flex items-center gap-3 pb-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[15px] shrink-0"
          style={{ backgroundColor: brandColor(insight.brand) }}
        >
          {insight.brand.charAt(0)}
        </div>
        <div>
          <h3 className="text-[17px] font-bold text-gray-900">{insight.brand}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {insight.groups.length} 个维度 ·{' '}
            {insight.groups.reduce((a, g) => a + g.items.length, 0)} 条洞察
          </p>
        </div>
      </div>

      {/* L1 sections */}
      {L1_ORDER.map((l1) => {
        const groups = byL1[l1];
        if (!groups || groups.length === 0) return null;
        const cfg = L1_CONFIG[l1] ?? L1_CONFIG['产品体验'];
        const isOpen = openL1[l1] ?? true;

        return (
          <div key={l1} className={cn('rounded-2xl border overflow-hidden', cfg.bg, cfg.border)}>
            {/* L1 header */}
            <button
              className="w-full flex items-center gap-2.5 px-5 py-3.5 text-left"
              onClick={() => setOpenL1((v) => ({ ...v, [l1]: !isOpen }))}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cfg.color }}
              />
              <span className={cn('text-[13px] font-bold flex-1', cfg.text)}>{l1}</span>
              <span className="text-[11px] text-gray-400">
                {groups.length} 个二级维度
              </span>
              {isOpen ? (
                <ChevronDown size={14} className="text-gray-400" />
              ) : (
                <ChevronRight size={14} className="text-gray-400" />
              )}
            </button>

            {isOpen && (
              <div className="px-5 pb-4 space-y-4">
                {groups.map((group) => (
                  <div key={group.l2}>
                    {/* L2 label */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[12px] font-semibold text-gray-600">{group.l2}</span>
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full border font-medium',
                          SENTIMENT_CONFIG[group.sentiment].tag,
                        )}
                      >
                        {SENTIMENT_CONFIG[group.sentiment].label}
                      </span>
                    </div>

                    {/* L3 items */}
                    <div className="space-y-1.5 ml-1">
                      {group.items.map((item, i) => (
                        <InsightItem key={i} item={item} brand={insight.brand} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Multi-brand comparison matrix ─────────────────────────────────────────────

function ComparisonMatrix({
  brands,
  insights,
}: {
  brands: string[];
  insights: Record<string, BrandInsight>;
}) {
  // Collect all unique L2 groups per L1, preserving order
  const l1l2Pairs: { l1: string; l2: string }[] = [];
  const seen = new Set<string>();

  for (const l1 of L1_ORDER) {
    for (const brand of brands) {
      const brandInsight = insights[brand];
      if (!brandInsight) continue;
      const byL1 = groupByL1(brandInsight);
      for (const g of byL1[l1] ?? []) {
        const key = `${l1}|||${g.l2}`;
        if (!seen.has(key)) {
          seen.add(key);
          l1l2Pairs.push({ l1, l2: g.l2 });
        }
      }
    }
  }

  // Group by L1 for rendering
  const byL1: Record<string, string[]> = {};
  for (const { l1, l2 } of l1l2Pairs) {
    if (!byL1[l1]) byL1[l1] = [];
    byL1[l1].push(l2);
  }

  const colWidth = Math.max(180, Math.floor(700 / brands.length));

  return (
    <div className="space-y-6">
      {/* Sticky brand header */}
      <div
        className="sticky top-0 z-10 bg-[#F4F5F7] py-1 grid gap-3"
        style={{ gridTemplateColumns: `140px repeat(${brands.length}, ${colWidth}px)` }}
      >
        <div />
        {brands.map((brand) => (
          <div
            key={brand}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm"
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[11px] shrink-0"
              style={{ backgroundColor: brandColor(brand) }}
            >
              {brand.charAt(0)}
            </div>
            <span className="font-semibold text-[12px] text-gray-800 truncate">{brand}</span>
          </div>
        ))}
      </div>

      {/* L1 blocks */}
      {L1_ORDER.map((l1) => {
        const l2List = byL1[l1];
        if (!l2List || l2List.length === 0) return null;
        const cfg = L1_CONFIG[l1] ?? L1_CONFIG['产品体验'];

        return (
          <div key={l1} className="space-y-2">
            {/* L1 heading */}
            <div className="flex items-center gap-2 px-1 pb-0.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
              <span className={cn('text-[13px] font-bold', cfg.text)}>{l1}</span>
            </div>

            {/* L2 rows */}
            {l2List.map((l2) => (
              <div
                key={l2}
                className="grid gap-3 items-start"
                style={{ gridTemplateColumns: `140px repeat(${brands.length}, ${colWidth}px)` }}
              >
                {/* L2 label cell */}
                <div className="flex items-center h-full pt-3 pb-1 pl-2">
                  <span className="text-[11px] font-semibold text-gray-500 leading-tight">{l2}</span>
                </div>

                {/* Brand cells */}
                {brands.map((brand) => {
                  const brandInsight = insights[brand];
                  const group = brandInsight
                    ? groupByL1(brandInsight)[l1]?.find((g) => g.l2 === l2)
                    : undefined;

                  return (
                    <div
                      key={brand}
                      className={cn(
                        'rounded-xl border p-3 min-h-[60px]',
                        cfg.bg,
                        cfg.border,
                      )}
                    >
                      {!group || group.items.length === 0 ? (
                        <p className="text-[11px] text-gray-300 italic">—</p>
                      ) : (
                        <div className="space-y-1.5">
                          {group.items.map((item, i) => (
                            <CompactInsightItem key={i} item={item} brand={brand} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Compact L3 item for comparison cells */
function CompactInsightItem({ item, brand }: { item: BrandInsightItem; brand: string }) {
  const [open, setOpen] = React.useState(false);
  const sc = SENTIMENT_CONFIG[item.sentiment];
  const evidence = filterEvidenceByActiveFiles(item.evidence);

  return (
    <div className="cursor-pointer group" onClick={() => setOpen((v) => !v)}>
      <div className="flex items-start gap-1.5">
        <span className={cn('w-1.5 h-1.5 rounded-full mt-1 shrink-0', sc.dot)} />
        <p className="text-[11px] text-gray-700 leading-snug group-hover:text-gray-900 transition-colors">
          {item.l3}
        </p>
      </div>
      {open && evidence.length > 0 && (
        <div className="mt-1.5 space-y-1.5 ml-3">
          {evidence.map((e, i) => {
            const src = lookupSource(e, brand);
            return (
              <div key={i} className="bg-white/80 border border-gray-100 rounded-md px-2 py-1.5">
                <p className="text-[10px] text-gray-500 italic leading-relaxed">{e}</p>
                {src && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <MapPin size={7} className="text-gray-300 shrink-0" />
                    <span className="text-[9px] text-gray-400">{shortSource(src)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CompetitivePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const vocs = useProjectVOCs(projectId);
  // Subscribe so the page re-renders whenever the user toggles active files in FileBar
  useActiveFileIds();
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);

  // All brands with available insights
  const allBrands = Object.keys(DEFAULT_COMPETITIVE_DATA).sort();

  // Auto-select first brand
  React.useEffect(() => {
    if (allBrands.length > 0 && selectedBrands.length === 0) {
      setSelectedBrands([allBrands[0]]);
    }
  }, [allBrands.length]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const isMulti = selectedBrands.length > 1;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 shrink-0">
          <BarChart2 size={16} className="text-[#4361EE]" />
          <h2 className="text-[15px] font-bold text-gray-900">竞品分析</h2>
        </div>

        {/* Brand chips */}
        <div className="flex items-center gap-1.5 flex-1 flex-wrap min-w-0">
          {allBrands.map((brand) => {
            const active = selectedBrands.includes(brand);
            const color = brandColor(brand);
            return (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium border transition-all',
                  active
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700',
                )}
                style={active ? { backgroundColor: color, borderColor: color } : {}}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />}
                {brand}
              </button>
            );
          })}

          {selectedBrands.length > 1 && (
            <button
              onClick={() => setSelectedBrands([])}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <X size={10} />
              清空
            </button>
          )}

          {selectedBrands.length > 0 && (
            <span className="text-[11px] text-gray-400">
              已选 {selectedBrands.length} 个品牌{isMulti ? '·对比模式' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-b border-gray-50 px-6 py-2 flex items-center gap-4">
        <span className="text-[11px] text-gray-400">点击洞察卡片可展开用户原声</span>
        <div className="flex items-center gap-3 ml-auto">
          {Object.entries(SENTIMENT_CONFIG).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1">
              <span className={cn('w-1.5 h-1.5 rounded-full', v.dot)} />
              <span className="text-[10px] text-gray-400">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {selectedBrands.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BarChart2 size={36} className="text-gray-200 mb-4" />
            <p className="text-[14px] font-medium text-gray-400">请在上方选择要查看的品牌</p>
            <p className="text-[12px] text-gray-300 mt-1">支持多选，同时对比多个品牌</p>
          </div>
        )}

        {!isMulti && selectedBrands.length === 1 && DEFAULT_COMPETITIVE_DATA[selectedBrands[0]] && (
          <SingleBrandView insight={DEFAULT_COMPETITIVE_DATA[selectedBrands[0]]} />
        )}

        {isMulti && (
          <div className="overflow-x-auto pb-6">
            <ComparisonMatrix
              brands={selectedBrands}
              insights={DEFAULT_COMPETITIVE_DATA}
            />
          </div>
        )}
      </div>
    </div>
  );
}
