import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, ChevronDown, ChevronRight, X, Sparkles } from 'lucide-react';
import {
  DEFAULT_QUALITATIVE_DATA,
  QualSubDimension,
  QualBrandEntry,
} from '../../store/defaultQualitativeData';
import { lookupSource, shortSource } from '../../utils/sourceUtils';
import { useActiveFileIds, filterEvidenceByActiveFiles } from '../../store/activeFilesStore';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const DIMENSIONS = ['需求认知', '购买决策', '产品体验'] as const;
type Dimension = (typeof DIMENSIONS)[number];

const DIM_CONFIG: Record<Dimension, { color: string; tab: string }> = {
  需求认知: { color: '#5B7BBF', tab: 'border-[#5B7BBF] text-[#5B7BBF]' },
  购买决策: { color: '#BF9455', tab: 'border-[#BF9455] text-[#BF9455]' },
  产品体验: { color: '#4BA69E', tab: 'border-[#4BA69E] text-[#4BA69E]' },
};

// ── Brand colors ─────────────────────────────────────────────────────────────

const BRAND_COLORS: Record<string, string> = {
  '洋葱':            '#E07A6E',
  '妙懂':            '#A87DB0',
  '万物指南':        '#5AABB8',
  'NB虚拟实验室':    '#7578C8',
  '学而思':          '#D49E55',
  '叫叫':            '#5BBF96',
  '赛先生科学课':    '#5DAD8A',
  '南开大学AI物理课':'#CC9450',
};

function brandColor(brand: string) {
  return BRAND_COLORS[brand] ?? '#9090A8';
}

const BRAND_ORDER = ['洋葱', '妙懂', '万物指南', 'NB虚拟实验室'];

function sortBrands(a: string, b: string) {
  const ai = BRAND_ORDER.indexOf(a);
  const bi = BRAND_ORDER.indexOf(b);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.localeCompare(b, 'zh');
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
  '启蒙-兴趣启蒙': { bg: '#E8F5F0', text: '#2E8B6E' },
  '启蒙-学科启蒙': { bg: '#E8EEF8', text: '#3D6BA6' },
  '应试-衔接先修': { bg: '#F5EDE5', text: '#B07030' },
  '应试-校内同步': { bg: '#F5F0E0', text: '#9A8520' },
  '学科启蒙':      { bg: '#E8EEF8', text: '#3D6BA6' },
  '兴趣启蒙':      { bg: '#E8F5F0', text: '#2E8B6E' },
};

// ── Highlight **keywords** in evidence text ──────────────────────────────────

function renderHighlightedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Single evidence quote ─────────────────────────────────────────────────────

function QuoteItem({ text, color }: { text: string; color: string }) {
  const src = lookupSource(text);
  return (
    <div className="flex gap-3 pt-3 border-t border-gray-100 first:border-0 first:pt-0">
      <span
        className="text-[22px] leading-none font-serif shrink-0 mt-0.5 select-none text-gray-300"
      >
        "
      </span>
      <div className="min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <p className="text-[13px] text-gray-700 leading-relaxed flex-1">{renderHighlightedText(text)}</p>
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
      {/* Top subtle divider */}
      <div className="h-[2px] w-full bg-gray-100" />

      <div className="p-5">
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-gray-100 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: bColor }} />
            {entry.brand}用户
          </span>
          {sourceSummary && (
            <span className="text-[11px] text-gray-400">{sourceSummary}</span>
          )}
        </div>

        {/* AI summary */}
        <div className="mb-4 rounded-xl p-3.5 border-l-[3px]"
             style={{ borderColor: bColor, backgroundColor: `${bColor}0A` }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={12} style={{ color: bColor }} />
            <span className="text-[11px] font-semibold" style={{ color: bColor }}>AI 总结</span>
          </div>
          <p className="text-[13px] font-semibold leading-relaxed text-gray-700">
            {entry.subtitle}
          </p>
        </div>

        {/* Evidence quotes */}
        <div className="space-y-0">
          {shown.map((e, i) => (
            <QuoteItem key={i} text={e.text} color={bColor} />
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
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  // Collect all unique tags in this sub-dimension
  const allTags = Array.from(
    new Set(subDim.brands.flatMap((b) => b.bullets.map((bl) => bl.tag).filter(Boolean))) as Set<string>
  );

  // Brand-chip filter
  const brandFiltered =
    selectedBrands.size === 0
      ? subDim.brands
      : subDim.brands.filter((b) => selectedBrands.has(b.brand));

  // Active-files evidence filter + tag filter
  const visible: QualBrandEntry[] = brandFiltered
    .map((entry) => ({
      ...entry,
      bullets: entry.bullets
        .filter((bullet) => !activeTag || bullet.tag === activeTag)
        .map((bullet) => ({
          ...bullet,
          evidence: filterEvidenceByActiveFiles(bullet.evidence),
        })),
    }))
    .filter((entry) => entry.bullets.some((b) => b.evidence.length > 0))
    .sort((a, b) => sortBrands(a.brand, b.brand));

  if (visible.length === 0 && !activeTag) return null;

  return (
    <div>
      {/* Section header with left color border */}
      <div className="mb-4 pl-3 border-l-[3px]" style={{ borderColor: color }}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-3 w-full text-left"
        >
          <span className="text-[15px] font-bold text-gray-900 flex-1">{subDim.name}</span>
          <span className="text-[11px] text-gray-400 flex items-center gap-0.5 shrink-0">
            {visible.length} 个品牌
            {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </span>
        </button>

        {/* Tag filter chips */}
        {allTags.length > 0 && !collapsed && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {allTags.map((tag) => {
              const isActive = activeTag === tag;
              const style = TAG_STYLES[tag];
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(isActive ? null : tag)}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-medium transition-all border',
                    isActive
                      ? 'ring-1 ring-offset-1 shadow-sm'
                      : 'opacity-70 hover:opacity-100',
                  )}
                  style={{
                    backgroundColor: style?.bg ?? '#f0f0f0',
                    color: style?.text ?? '#666',
                    borderColor: isActive ? (style?.text ?? '#666') : 'transparent',
                    ringColor: style?.text,
                  }}
                >
                  {tag}
                </button>
              );
            })}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="px-1.5 py-0.5 rounded-full text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
              >
                <X size={10} />清除
              </button>
            )}
          </div>
        )}
      </div>

      {!collapsed && (
        <>
        {subDim.globalSummary && (
          <div className="mb-4 rounded-xl px-4 py-3 border-l-[3px]"
               style={{ borderColor: color, backgroundColor: `${color}08` }}>
            <p className="text-sm text-gray-700 leading-relaxed">
              <Sparkles size={14} className="inline mr-1 -mt-0.5" style={{ color }} />
              <span className="font-bold mr-1.5" style={{ color }}>AI 概况</span>
              {subDim.globalSummary}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((entry) => (
            <BrandCard key={entry.brand} entry={entry} />
          ))}
        </div>
        </>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function QualitativePage() {
  useParams<{ projectId: string }>();
  useActiveFileIds(); // subscribe for re-render on file toggle

  const [activeDim, setActiveDim] = React.useState<Dimension>('需求认知');
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
  ).sort(sortBrands);

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
