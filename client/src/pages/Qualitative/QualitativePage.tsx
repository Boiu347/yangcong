import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, ChevronDown, ChevronRight, X } from 'lucide-react';
import {
  DEFAULT_QUALITATIVE_DATA,
  QualSubDimension,
  QualBrandEntry,
} from '../../store/defaultQualitativeData';
import { lookupSource, shortSource } from '../../utils/sourceUtils';
import { useActiveFileIds, filterEvidenceByActiveFiles } from '../../store/activeFilesStore';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const DIMENSIONS = ['启蒙认知', '购买决策', '产品体验'] as const;
type Dimension = (typeof DIMENSIONS)[number];

const DIM_CONFIG: Record<Dimension, { color: string; tab: string }> = {
  启蒙认知: { color: '#FF5722', tab: 'border-[#FF5722] text-[#FF5722]' },
  购买决策: { color: '#D97706', tab: 'border-amber-500 text-amber-600' },
  产品体验: { color: '#2563EB', tab: 'border-blue-500 text-blue-600' },
};

// ── Brand colors ─────────────────────────────────────────────────────────────

const BRAND_COLORS: Record<string, string> = {
  '洋葱':            '#FF6B6B',
  '妙懂':            '#EC4899',
  '万物指南':        '#45B7D1',
  'NB虚拟实验室':    '#6366F1',
  '学而思':          '#F59E0B',
  '叫叫':            '#34D399',
  '赛先生科学课':    '#10B981',
  '南开大学AI物理课':'#F97316',
  '从小学物理':      '#FF5722',
};

function brandColor(brand: string) {
  return BRAND_COLORS[brand] ?? '#A78BFA';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive "访谈N·M / 城市A·城市B" from a list of evidence strings */
function getSourceSummary(evidence: string[]): string {
  const sources = evidence.map((e) => lookupSource(e)).filter(Boolean) as string[];
  const unique = Array.from(new Set(sources));
  const nums: string[] = [];
  const cities: string[] = [];
  for (const src of unique) {
    const m = src.match(/访谈(\d+)/);
    if (m) nums.push(m[1]);
    const parts = src.split('·');
    const city = (parts[2] ?? '').trim();
    if (city) cities.push(city);
  }
  const sortedNums = Array.from(new Set(nums)).sort((a, b) => +a - +b);
  const uniqueCities = Array.from(new Set(cities));
  if (!sortedNums.length) return '';
  return `访谈${sortedNums.join('·')} / ${uniqueCities.join('·')}`;
}

// ── Tag colors ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  '启蒙-兴趣启蒙': { bg: '#ECFDF5', text: '#059669' },
  '启蒙-学科启蒙': { bg: '#EFF6FF', text: '#2563EB' },
  '应试-衔接先修': { bg: '#FFF7ED', text: '#EA580C' },
  '应试-校内同步': { bg: '#FFFBEB', text: '#D97706' },
  '学科启蒙':      { bg: '#EFF6FF', text: '#2563EB' },
  '兴趣启蒙':      { bg: '#ECFDF5', text: '#059669' },
};

// ── Single evidence quote ─────────────────────────────────────────────────────

function QuoteItem({ text, color, tag }: { text: string; color: string; tag?: string }) {
  const src = lookupSource(text);
  const tagStyle = tag ? TAG_STYLES[tag] : undefined;
  return (
    <div className="flex gap-3 pt-3 border-t border-gray-100 first:border-0 first:pt-0">
      <span
        className="text-[22px] leading-none font-serif shrink-0 mt-0.5 select-none"
        style={{ color }}
      >
        "
      </span>
      <div className="min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <p className="text-[13px] text-gray-700 leading-relaxed flex-1">{text}</p>
          {tag && tagStyle && (
            <span
              className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap mt-0.5"
              style={{ backgroundColor: tagStyle.bg, color: tagStyle.text }}
            >
              {tag}
            </span>
          )}
        </div>
        {src && (
          <p className="text-[11px] text-gray-400 mt-1.5">
            — {shortSource(src)}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Brand card ────────────────────────────────────────────────────────────────

interface TaggedEvidence {
  text: string;
  tag?: string;
}

function BrandCard({ entry }: { entry: QualBrandEntry }) {
  const [expanded, setExpanded] = React.useState(false);
  const bColor = brandColor(entry.brand);

  const allEvidence: TaggedEvidence[] = entry.bullets.flatMap((b) =>
    b.evidence.map((e) => ({ text: e, tag: b.tag }))
  );
  const sourceSummary = getSourceSummary(allEvidence.map((e) => e.text));

  const PREVIEW = 3;
  const shown = expanded ? allEvidence : allEvidence.slice(0, PREVIEW);
  const hasMore = allEvidence.length > PREVIEW;

  if (allEvidence.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-[3px_4px_0_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Top brand color bar */}
      <div className="h-1 w-full" style={{ backgroundColor: bColor }} />

      <div className="p-5">
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="px-2.5 py-1 rounded-full text-[12px] font-semibold text-white"
            style={{ backgroundColor: bColor }}
          >
            {entry.brand}用户
          </span>
          {sourceSummary && (
            <span className="text-[11px] text-gray-400">{sourceSummary}</span>
          )}
        </div>

        {/* AI summary */}
        <div className="mb-4 bg-gray-50 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px]" style={{ color: bColor }}>◆</span>
            <span className="text-[11px] font-semibold text-gray-400">AI 总结</span>
          </div>
          <p className="text-[13px] font-semibold leading-relaxed" style={{ color: bColor }}>
            {entry.subtitle}
          </p>
        </div>

        {/* Evidence quotes */}
        <div className="space-y-0">
          {shown.map((e, i) => (
            <QuoteItem key={i} text={e.text} color={bColor} tag={e.tag} />
          ))}
        </div>

        {/* Expand / collapse */}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            {expanded
              ? <><ChevronDown size={11} />收起</>
              : <><ChevronRight size={11} />展开全部 {allEvidence.length} 条原声</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Sub-dimension section ─────────────────────────────────────────────────────

function SubDimSection({
  subDim,
  selectedBrands,
  color,
}: {
  subDim: QualSubDimension;
  selectedBrands: Set<string>;
  color: string;
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  // Brand-chip filter
  const brandFiltered =
    selectedBrands.size === 0
      ? subDim.brands
      : subDim.brands.filter((b) => selectedBrands.has(b.brand));

  // Active-files evidence filter
  const visible: QualBrandEntry[] = brandFiltered
    .map((entry) => ({
      ...entry,
      bullets: entry.bullets.map((bullet) => ({
        ...bullet,
        evidence: filterEvidenceByActiveFiles(bullet.evidence),
      })),
    }))
    .filter((entry) => entry.bullets.some((b) => b.evidence.length > 0));

  if (visible.length === 0) return null;

  return (
    <div>
      {/* Section header with left color border */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-3 w-full text-left mb-4 pl-3 border-l-[3px]"
        style={{ borderColor: color }}
      >
        <span className="text-[15px] font-bold text-gray-900 flex-1">{subDim.name}</span>
        {subDim.globalSummary && (
          <span className="text-[11px] text-gray-400 hidden lg:inline max-w-xs truncate">
            {subDim.globalSummary}
          </span>
        )}
        <span className="text-[11px] text-gray-400 flex items-center gap-0.5 shrink-0">
          {visible.length} 个品牌
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </span>
      </button>

      {!collapsed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((entry) => (
            <BrandCard key={entry.brand} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function QualitativePage() {
  useParams<{ projectId: string }>();
  useActiveFileIds(); // subscribe for re-render on file toggle

  const [activeDim, setActiveDim] = React.useState<Dimension>('启蒙认知');
  const [selectedBrands, setSelectedBrands] = React.useState<Set<string>>(new Set());

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  };

  React.useEffect(() => { setSelectedBrands(new Set()); }, [activeDim]);

  const dimData = DEFAULT_QUALITATIVE_DATA[activeDim];
  const subDimensions = dimData?.subDimensions ?? [];
  const { color, tab } = DIM_CONFIG[activeDim];

  const allBrands = Array.from(
    new Set(subDimensions.flatMap((s) => s.brands.map((b) => b.brand))),
  ).sort();

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="bg-[#FEFDF9] border-b border-[#E8E2D9] px-6 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <MessageSquare size={15} className="text-[#FF5722]" />
            <h2 className="text-[15px] font-bold text-gray-900">定性洞察</h2>
          </div>

          <div className="flex-1" />

          {allBrands.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="text-[11px] text-gray-400">筛选：</span>
              {allBrands.map((brand) => {
                const active = selectedBrands.has(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                      active
                        ? 'text-white border-transparent'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300',
                    )}
                    style={active ? { backgroundColor: color, borderColor: color } : {}}
                  >
                    {brand}
                  </button>
                );
              })}
              {selectedBrands.size < allBrands.length && (
                <button
                  onClick={() => setSelectedBrands(new Set(allBrands))}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] text-gray-400 hover:text-gray-600 border border-gray-200 transition-colors"
                >
                  全选
                </button>
              )}
              {selectedBrands.size > 0 && (
                <button
                  onClick={() => setSelectedBrands(new Set())}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] text-gray-400 hover:text-gray-600 border border-gray-200 transition-colors"
                >
                  <X size={9} />清空
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dimension tabs */}
        <div className="flex">
          {DIMENSIONS.map((dim) => (
            <button
              key={dim}
              onClick={() => setActiveDim(dim)}
              className={cn(
                'px-5 py-2.5 text-[13px] font-medium border-b-2 transition-all',
                activeDim === dim ? DIM_CONFIG[dim].tab : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {dim}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {subDimensions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[14px] text-gray-400">「{activeDim}」暂无数据</p>
          </div>
        ) : (
          subDimensions.map((sub) => (
            <SubDimSection
              key={sub.name}
              subDim={sub}
              selectedBrands={selectedBrands}
              color={color}
            />
          ))
        )}
      </div>
    </div>
  );
}
