import React from 'react';
import { useParams } from 'react-router-dom';
import { BarChart2, ChevronDown, ChevronRight, MapPin, X, Layers } from 'lucide-react';
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

const BRAND_ORDER = ['洋葱', '妙懂', '万物指南', 'NB虚拟实验室'];

function sortBrands(brands: string[]): string[] {
  return brands.sort((a, b) => {
    const ai = BRAND_ORDER.indexOf(a);
    const bi = BRAND_ORDER.indexOf(b);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
    return a.localeCompare(b, 'zh');
  });
}

const L1_CONFIG: Record<string, { color: string; bg: string; border: string; text: string }> = {
  启蒙认知: { color: '#5B7BBF', bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-[#5B7BBF]' },
  购买决策: { color: '#BF9455', bg: 'bg-stone-50', border: 'border-stone-100', text: 'text-[#BF9455]' },
  产品体验: { color: '#4BA69E', bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-[#4BA69E]' },
};

const SENTIMENT_CONFIG = {
  positive: { dot: 'bg-emerald-400', tag: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: '正面' },
  neutral:  { dot: 'bg-gray-300',    tag: 'bg-gray-50 text-gray-500 border-gray-200',          label: '中性' },
  negative: { dot: 'bg-red-400',     tag: 'bg-red-50 text-red-500 border-red-200',             label: '负面' },
};

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

// ── Cross-brand summary data (edit conclusions here) ─────────────────────────

// Brand order: 洋葱 first, then alphabetically
const BRAND_SUMMARY_ORDER = [
  '洋葱', 'NB虚拟实验室', '万物指南', '妙懂', '学而思', '叫叫', '南开大学AI物理课',
];

const BRAND_SUMMARIES: Record<string, string> = {
  '洋葱':            '**动画直观**、**校内同步**是核心竞争力，"从小学物理"**实验吸引力强**、**孩子自主完课率高**；大会员权益边界模糊引发"上当感"，**课程入口不易找**和**权益透明化**是关键改进点。',
  'NB虚拟实验室':    '**虚拟实验探索感强**、**终身制低价**受认可；主科挤压下**实际使用率极低**，模拟与真实实验的落差是产品天然限制。',
  '万物指南':        '**化学内容的市场稀缺性**是差异化壁垒，博物馆权威内容建立信任；**学习产出难以量化**是续费最大阻力。',
  '妙懂':            '**AR** 是强记忆点，但"只玩 AR、不看内容"或**购后搁置**的风险真实存在；**应试感知偏差**抑制启蒙场景的新用户转化。',
  '学而思':          '**高校师资背书**建立内容权威感，科学课打基础效果获认可；**隐性附加收费**与**课程停运**带来的体验断裂是严重信任损伤。',
  '叫叫':            '**打卡机制**有效养成自主学习习惯，激励体系完善；**隐性附加收费**与定价不透明是核心信任损伤点。',
  '南开大学AI物理课': '**高校师资背书**建立内容权威感，为初中物理**提前打基础**的定位清晰；不含在洋葱大会员权益内引发**期望落差**。',
};

const CROSS_BRAND_CONCLUSIONS: { text: string; color: string }[] = [
  {
    text: '**兴趣启蒙**是首要需求，但"**能坚持用**"才是真壁垒——家长购买的核心动机是让孩子建立对理科的兴趣而非应试，然而主科压力下**使用频率普遍偏低**，跨品牌都面临"买了不用"的**留存难题**。',
    color: '#5B7BBF',
  },
  {
    text: '产品发现高度依赖**直播/社群口碑**——NB、万物指南、叫叫等品牌用户均通过抖音直播间或学习社群发现产品，**KOL 推荐**是小众品牌触达家长的核心渠道，品牌**主动曝光能力普遍不足**。',
    color: '#BF9455',
  },
  {
    text: '**权益透明度**是购买信任的关键门槛——洋葱大会员边界不清、叫叫隐性附加收费、学而思教具拉高门槛，均使家长产生"**上当感**"；反之，NB **终身制低价**和万物指南"**永久题库**"则被高度认可。',
    color: '#E07A6E',
  },
  {
    text: '**孩子主动参与**是续费最强信号——无论哪个品牌，家长续费的核心依据是"孩子愿意自己打开"；产品能否将初始兴趣转化为孩子的**自主学习习惯**，是留存决策的**决定性因素**。',
    color: '#4BA69E',
  },
];

/** Compute dominant sentiment per brand × L1 from hardcoded insight data */
function computeSentimentMatrix() {
  const score = { positive: 2, neutral: 1, negative: 0 } as const;
  const result: Record<string, Record<string, 'positive' | 'neutral' | 'negative'>> = {};
  for (const [brand, insight] of Object.entries(DEFAULT_COMPETITIVE_DATA)) {
    result[brand] = {};
    const byL1 = groupByL1(insight);
    for (const l1 of L1_ORDER) {
      const groups = byL1[l1] ?? [];
      if (groups.length === 0) continue;
      const avg = groups.reduce((s, g) => s + score[g.sentiment], 0) / groups.length;
      result[brand][l1] = avg >= 1.5 ? 'positive' : avg >= 0.5 ? 'neutral' : 'negative';
    }
  }
  return result;
}

const SENTIMENT_MATRIX = computeSentimentMatrix();

// ── Highlight **keywords** in text ───────────────────────────────────────────

function renderHighlightedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Cross-brand overview panel ────────────────────────────────────────────────

function CrossBrandOverview() {
  const [open, setOpen] = React.useState(true);
  const brands = sortBrands(Object.keys(DEFAULT_COMPETITIVE_DATA));

  return (
    <div className="rounded-2xl border border-[#E8E2D9] shadow-[3px_4px_0_rgba(0,0,0,0.06)] overflow-hidden mb-6 bg-white">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-6 py-4 text-left hover:bg-gray-50/60 transition-colors"
      >
        <div className="w-6 h-6 rounded-lg bg-[#FF5722]/10 flex items-center justify-center shrink-0">
          <Layers size={12} className="text-[#FF5722]" />
        </div>
        <span className="text-[14px] font-bold text-gray-900 flex-1">跨品牌洞察</span>
        <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full mr-2">
          {brands.length} 个品牌 · {L1_ORDER.length} 个维度
        </span>
        {open
          ? <ChevronDown size={14} className="text-gray-300" />
          : <ChevronRight size={14} className="text-gray-300" />}
      </button>

      {open && (
        <>
          {/* Core conclusions */}
          <div className="border-t border-gray-50 px-6 pt-5 pb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">核心结论</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {CROSS_BRAND_CONCLUSIONS.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/60"
                >
                  <div
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold mt-0.5"
                    style={{ backgroundColor: c.color }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-[12.5px] text-gray-600 leading-relaxed">{renderHighlightedText(c.text)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brand differentiation summaries */}
          <div className="border-t border-gray-50 px-6 pt-4 pb-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">品牌差异总结</p>
            <div>
              {BRAND_SUMMARY_ORDER.filter((b) => BRAND_SUMMARIES[b]).map((brand, idx) => (
                <div
                  key={brand}
                  className={cn(
                    'flex items-baseline gap-4 py-3',
                    idx !== 0 && 'border-t border-gray-100',
                  )}
                >
                  <div className="flex items-center gap-1.5 shrink-0 w-[116px]">
                    <div
                      className="w-4 h-4 rounded-[4px] flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                      style={{ backgroundColor: brandColor(brand) }}
                    >
                      {brand.charAt(0)}
                    </div>
                    <span className="text-[13px] font-semibold text-gray-800 whitespace-nowrap">{brand}</span>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{renderHighlightedText(BRAND_SUMMARIES[brand])}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment matrix table */}
          <div className="border-t border-gray-50 px-6 pt-4 pb-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">品牌横向对比</p>
            <div className="overflow-x-auto">
              <table className="text-left border-collapse w-full">
                <thead>
                  <tr>
                    <th className="text-[11px] font-medium text-gray-400 pb-3 pr-4 min-w-[130px]" />
                    {L1_ORDER.map((l1) => (
                      <th
                        key={l1}
                        className="text-[11px] font-bold pb-3 px-4 min-w-[100px] text-center"
                        style={{ color: L1_CONFIG[l1].color }}
                      >
                        {l1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand, idx) => (
                    <tr
                      key={brand}
                      className={cn('border-t border-gray-50', idx % 2 === 0 ? '' : 'bg-gray-50/40')}
                    >
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                            style={{ backgroundColor: brandColor(brand) }}
                          >
                            {brand.charAt(0)}
                          </div>
                          <span className="text-[12px] font-medium text-gray-700 whitespace-nowrap">{brand}</span>
                        </div>
                      </td>
                      {L1_ORDER.map((l1) => {
                        const s = SENTIMENT_MATRIX[brand]?.[l1];
                        if (!s) return (
                          <td key={l1} className="py-2.5 px-4 text-center">
                            <span className="text-gray-200 text-[12px]">—</span>
                          </td>
                        );
                        const sc = SENTIMENT_CONFIG[s];
                        return (
                          <td key={l1} className="py-2.5 px-4 text-center">
                            <span className={cn(
                              'inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium',
                              sc.tag,
                            )}>
                              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', sc.dot)} />
                              {sc.label}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Evidence list with source tags ───────────────────────────────────────────

function EvidenceList({ evidence, brand }: { evidence: string[]; brand?: string }) {
  return (
    <div className="mt-2 space-y-1.5">
      {evidence.map((e, i) => {
        const src = lookupSource(e, brand);
        return (
          <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2">
            <p className="text-[11px] text-gray-600 leading-relaxed italic">{renderHighlightedText(e)}</p>
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

  const matrixL1 = ['产品体验'];
  for (const l1 of matrixL1) {
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
  let firstItemRendered = false;

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

      {/* L1 blocks — only 产品体验 in comparison matrix */}
      {matrixL1.map((l1) => {
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
                          {group.items.map((item, i) => {
                            const shouldOpen = !firstItemRendered && item.evidence.length > 0;
                            if (shouldOpen) firstItemRendered = true;
                            return <CompactInsightItem key={i} item={item} brand={brand} defaultOpen={shouldOpen} />;
                          })}
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
function CompactInsightItem({ item, brand, defaultOpen }: { item: BrandInsightItem; brand: string; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  const sc = SENTIMENT_CONFIG[item.sentiment];
  const evidence = filterEvidenceByActiveFiles(item.evidence);

  return (
    <div className="cursor-pointer group" onClick={() => setOpen((v) => !v)}>
      <div className="flex items-start gap-1.5">
        <span className={cn('w-1.5 h-1.5 rounded-full mt-1 shrink-0', sc.dot)} />
        <p className="text-[11px] text-gray-700 leading-snug group-hover:text-gray-900 transition-colors">
          {item.l3}
          {evidence.length > 0 && (
            <span className="text-[9px] text-gray-400 whitespace-nowrap ml-1 inline-flex items-center gap-0.5 align-middle">
              {evidence.length}条
              {open ? <ChevronDown size={8} /> : <ChevronRight size={8} />}
            </span>
          )}
        </p>
      </div>
      {open && evidence.length > 0 && (
        <div className="mt-1.5 space-y-1.5 ml-3">
          {evidence.map((e, i) => {
            const src = lookupSource(e, brand);
            return (
              <div key={i} className="bg-white/80 border border-gray-100 rounded-md px-2 py-1.5">
                <p className="text-[10px] text-gray-500 italic leading-relaxed">{renderHighlightedText(e)}</p>
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
  const allBrands = sortBrands(Object.keys(DEFAULT_COMPETITIVE_DATA));

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
          <BarChart2 size={16} className="text-[#FF5722]" />
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

          {selectedBrands.length < allBrands.length && (
            <button
              onClick={() => setSelectedBrands([...allBrands])}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              全选
            </button>
          )}

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
        {/* Cross-brand overview — always visible */}
        <CrossBrandOverview />

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
            <div className="mb-3">
              <span className="text-[11px] text-white bg-[#5B7BBF] px-2.5 py-1 rounded-md font-medium shadow-sm">💬 点击洞察条目可展开用户原声</span>
            </div>
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
