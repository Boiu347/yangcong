import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, ChevronDown, ChevronRight, X, MapPin } from 'lucide-react';
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

const DIM_DISPLAY: Record<string, Dimension> = {
  需求认知: '启蒙认知',
  启蒙认知: '启蒙认知',
  购买决策: '购买决策',
  产品体验: '产品体验',
};

const DIM_CONFIG: Record<Dimension, { color: string; light: string; text: string; tab: string }> = {
  启蒙认知: { color: '#7C3AED', light: '#EDE9FE', text: 'text-violet-700', tab: 'border-violet-500 text-violet-600' },
  购买决策: { color: '#D97706', light: '#FEF3C7', text: 'text-amber-700',  tab: 'border-amber-500 text-amber-600'  },
  产品体验: { color: '#2563EB', light: '#DBEAFE', text: 'text-blue-700',   tab: 'border-blue-500 text-blue-600'    },
};

const SENTIMENT_BADGE: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  neutral:  'bg-gray-100 text-gray-500 border-gray-200',
  negative: 'bg-red-50 text-red-600 border-red-200',
};
const SENTIMENT_LABEL: Record<string, string> = { positive: '正面', neutral: '中性', negative: '负面' };

const BRAND_COLORS: Record<string, string> = {
  '洋葱':            '#FF6B6B',
  '妙懂':            '#4ECDC4',
  '万物指南':         '#45B7D1',
  'NB虚拟实验室':     '#6366F1',
  '学而思':           '#F59E0B',
  '叫叫':             '#EC4899',
  '赛先生科学课':     '#34D399',
  '南开大学AI物理课': '#F97316',
  '从小学物理':       '#8B5CF6',
};
const brandColor = (b: string) => BRAND_COLORS[b] ?? '#A78BFA';

// ── Source tag ────────────────────────────────────────────────────────────────

function SourceTag({ evidence, brand }: { evidence: string; brand: string }) {
  const source = lookupSource(evidence, brand);
  if (!source) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-full ml-1 shrink-0">
      <MapPin size={8} className="shrink-0" />
      {shortSource(source)}
    </span>
  );
}

// ── Evidence item with source ─────────────────────────────────────────────────

function EvidenceItem({ text, brand }: { text: string; brand: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
      <span className="text-gray-300 text-[15px] leading-none font-serif mt-0.5 shrink-0">"</span>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-gray-600 leading-relaxed">{text}</p>
        <SourceTag evidence={text} brand={brand} />
      </div>
    </div>
  );
}

// ── Bullet row (click to expand evidence) ────────────────────────────────────

function BulletRow({
  text,
  evidence,
  brand,
  color,
}: {
  text: string;
  evidence: string[];
  brand: string;
  color: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-1.5">
      <button
        className="flex items-start gap-2 w-full text-left group"
        onClick={() => evidence.length > 0 && setOpen((v) => !v)}
      >
        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[12px] text-gray-700 leading-snug flex-1 group-hover:text-gray-900 transition-colors">
          {text}
        </span>
        {evidence.length > 0 && (
          <span className="text-[10px] text-gray-400 shrink-0 flex items-center gap-0.5 mt-0.5">
            {evidence.length} 条原声
            {open ? <ChevronDown size={9} /> : <ChevronRight size={9} />}
          </span>
        )}
      </button>
      {open && (
        <div className="ml-3.5 space-y-1.5">
          {evidence.map((e, i) => (
            <EvidenceItem key={i} text={e} brand={brand} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Brand card ────────────────────────────────────────────────────────────────

function BrandCard({ entry, cfg }: { entry: QualBrandEntry; cfg: typeof DIM_CONFIG[Dimension] }) {
  const [allOpen, setAllOpen] = React.useState(false);
  const totalEvidence = entry.bullets.reduce((a, b) => a + b.evidence.length, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Color accent bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: cfg.color }} />

      <div className="p-4">
        {/* Brand header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px] shrink-0"
            style={{ backgroundColor: brandColor(entry.brand) }}
          >
            {entry.brand.charAt(0)}
          </div>
          <span className="text-[13px] font-semibold text-gray-800">{entry.brand}</span>
          <span className="text-[11px] text-gray-400">{entry.vocCount} 条原声</span>
          <span
            className={cn(
              'ml-auto text-[10px] px-1.5 py-0.5 rounded-full border font-medium',
              SENTIMENT_BADGE[entry.sentiment],
            )}
          >
            {SENTIMENT_LABEL[entry.sentiment]}
          </span>
        </div>

        {/* Subtitle */}
        <div
          className="text-[13px] font-semibold leading-snug mb-3 pl-2 border-l-2"
          style={{ color: cfg.color, borderColor: cfg.light }}
        >
          {entry.subtitle}
        </div>

        {/* Bullets */}
        <div className="space-y-2.5">
          {entry.bullets.map((bullet, i) => (
            <BulletRow
              key={i}
              text={bullet.text}
              evidence={bullet.evidence}
              brand={entry.brand}
              color={cfg.color}
            />
          ))}
        </div>

        {/* Expand all evidence */}
        {totalEvidence > 0 && (
          <button
            onClick={() => setAllOpen((v) => !v)}
            className="mt-3 pt-3 border-t border-gray-50 w-full flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            {allOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            {allOpen ? '收起' : `展开全部 ${totalEvidence} 条用户原声`}
          </button>
        )}

        {allOpen && (
          <div className="mt-3 space-y-4">
            {entry.bullets.map((bullet, i) =>
              bullet.evidence.length > 0 ? (
                <div key={i}>
                  <p className="text-[11px] text-gray-400 mb-1.5 font-medium">{bullet.text}</p>
                  <div className="space-y-1.5">
                    {bullet.evidence.map((e, j) => (
                      <EvidenceItem key={j} text={e} brand={entry.brand} />
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-dimension section ─────────────────────────────────────────────────────

function SubDimSection({
  subDim,
  selectedBrands,
  cfg,
}: {
  subDim: QualSubDimension;
  selectedBrands: Set<string>;
  cfg: typeof DIM_CONFIG[Dimension];
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  // Filter by brand chip selection first
  const brandFiltered =
    selectedBrands.size === 0
      ? subDim.brands
      : subDim.brands.filter((b) => selectedBrands.has(b.brand));

  // Filter each brand entry's evidence by active files
  const visible: QualBrandEntry[] = brandFiltered.map((entry) => ({
    ...entry,
    bullets: entry.bullets.map((bullet) => ({
      ...bullet,
      evidence: filterEvidenceByActiveFiles(bullet.evidence),
    })),
  }));

  if (visible.length === 0) return null;

  return (
    <div>
      {/* Sub-dim header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2 w-full text-left mb-3"
      >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
        <span className={cn('text-[13px] font-bold', cfg.text)}>{subDim.name}</span>
        {subDim.globalSummary && (
          <span className="text-[12px] text-gray-400 font-normal hidden md:inline">
            — {subDim.globalSummary}
          </span>
        )}
        <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
          {visible.length} 个品牌
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </span>
      </button>

      {!collapsed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {visible.map((entry) => (
            <BrandCard key={entry.brand} entry={entry} cfg={cfg} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function QualitativePage() {
  useParams<{ projectId: string }>();
  // Subscribe so the page re-renders whenever the user toggles active files in FileBar
  useActiveFileIds();

  const [activeDim, setActiveDim] = React.useState<Dimension>('启蒙认知');
  const [selectedBrands, setSelectedBrands] = React.useState<Set<string>>(new Set());

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  };

  React.useEffect(() => {
    setSelectedBrands(new Set());
  }, [activeDim]);

  const dimData =
    DEFAULT_QUALITATIVE_DATA[activeDim] ??
    DEFAULT_QUALITATIVE_DATA[
      Object.keys(DEFAULT_QUALITATIVE_DATA).find((k) => DIM_DISPLAY[k] === activeDim) ?? ''
    ];

  const subDimensions = dimData?.subDimensions ?? [];
  const cfg = DIM_CONFIG[activeDim];

  const allBrands = Array.from(
    new Set(subDimensions.flatMap((s) => s.brands.map((b) => b.brand))),
  ).sort();

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 pt-4 pb-0">
        {/* Title + brand filters */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <MessageSquare size={15} className="text-[#4361EE]" />
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
                      'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                      active ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300',
                    )}
                    style={active ? { backgroundColor: brandColor(brand) } : {}}
                  >
                    {brand}
                  </button>
                );
              })}
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
      <div className="flex-1 overflow-y-auto p-6 space-y-7">
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
              cfg={cfg}
            />
          ))
        )}
      </div>
    </div>
  );
}
