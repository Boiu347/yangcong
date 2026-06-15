import React from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CircleAlert,
  Compass,
  Gauge,
  GitBranch,
  Lightbulb,
  MessageSquareQuote,
  Scale,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  CALCULATION_INSIGHT_THEMES,
  CalculationInsightTheme,
  InsightEvidenceType,
  SatisfactionInsightTheme,
  SatisfactionVoicesTheme,
} from '../../store/calculationInsightsData';
import { cn } from '@/lib/utils';

const TYPE_STYLES: Record<InsightEvidenceType, string> = {
  问卷定量: 'bg-blue-50 text-blue-700 border-blue-100',
  行业数据: 'bg-teal-50 text-teal-700 border-teal-100',
  业务数据: 'bg-amber-50 text-amber-700 border-amber-100',
  案头研究: 'bg-violet-50 text-violet-700 border-violet-100',
  策略推演: 'bg-rose-50 text-rose-700 border-rose-100',
};

const THEME_COLORS: Record<CalculationInsightTheme['id'], string> = {
  segments: '#5B7BBF',
  decision: '#BF9455',
  service: '#4BA69E',
  renewal: '#E07A6E',
  satisfaction: '#8B6BB8',
  'satisfaction-voices': '#B8667A',
};

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500">
      {source}
    </span>
  );
}

function HighlightedVoice({ text, color }: { text: string; color: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <mark
              key={`${part}-${index}`}
              className="rounded px-0.5 font-bold text-gray-900"
              style={{ backgroundColor: `${color}20` }}
            >
              {part.slice(2, -2)}
            </mark>
          );
        }
        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
      })}
    </>
  );
}

function SatisfactionSurveyView({ theme, color }: { theme: SatisfactionInsightTheme; color: string }) {
  return (
    <>
      <section
        className="overflow-hidden rounded-[24px] border bg-white shadow-[0_12px_35px_rgba(30,35,40,0.06)]"
        style={{ borderColor: `${color}35` }}
      >
        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.75fr] lg:p-8">
          <div>
            <p className="text-[11px] font-bold tracking-[0.16em]" style={{ color }}>{theme.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-[26px] font-black leading-[1.3] text-[#242421] sm:text-[32px]">
              {theme.title}
            </h1>
            <p className="mt-4 max-w-4xl text-[14px] leading-7 text-gray-600">{theme.thesis}</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-violet-700">
              <Users size={14} />
              调研样本
            </div>
            <p className="mt-3 text-[14px] font-bold leading-6 text-gray-800">{theme.sample}</p>
            <p className="mt-3 border-t border-violet-100 pt-3 text-[11px] leading-5 text-gray-500">
              这是结营满意度调查，描述主动填写者的体验，不代表全部购买者或流失用户。
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {theme.metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[25px] font-black tracking-tight" style={{ color }}>{metric.value}</span>
              <span className={cn('rounded-full border px-2 py-0.5 text-[9px] font-semibold', TYPE_STYLES[metric.type])}>
                {metric.type}
              </span>
            </div>
            <h3 className="mt-2 text-[13px] font-bold text-gray-900">{metric.label}</h3>
            <p className="mt-1.5 min-h-[42px] text-[11px] leading-[1.65] text-gray-500">{metric.detail}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
              <span className="text-[9px] text-gray-400">{metric.scope}</span>
              <SourceBadge source={metric.source} />
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <Gauge size={16} style={{ color }} />
          <h2 className="text-[15px] font-bold text-gray-900">体验满意度结构</h2>
        </div>
        <div className="mt-5 grid gap-x-8 gap-y-6 lg:grid-cols-2">
          {theme.distributionBars.map((item) => (
            <article key={item.label}>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-[12px] font-bold text-gray-800">{item.label}</h3>
                  <p className="mt-0.5 text-[10px] text-gray-400">{item.note}</p>
                </div>
                <span className="text-[9px] text-gray-400">N=247</span>
              </div>
              <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-gray-100">
                {item.segments.map((segment) => (
                  <div
                    key={segment.label}
                    title={`${segment.label} ${segment.value}%`}
                    style={{ width: `${segment.value}%`, backgroundColor: segment.color }}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                {item.segments.map((segment) => (
                  <div key={segment.label} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span>{segment.label}</span>
                    <strong className="text-gray-700">{segment.value}%</strong>
                    <span className="text-gray-300">({segment.count})</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} style={{ color }} />
          <h2 className="text-[15px] font-bold text-gray-900">续购与跨专项意向</h2>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">同产品续购和跨专项承接分开计算，避免高估计算营续购率。</p>
        <div className="mt-5 flex h-5 overflow-hidden rounded-full bg-gray-100">
          {theme.purchaseIntent.map((segment) => (
            <div
              key={segment.label}
              title={`${segment.label} ${segment.value}%`}
              style={{ width: `${segment.value}%`, backgroundColor: segment.color }}
            />
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {theme.purchaseIntent.map((segment) => (
            <div key={segment.label} className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                <span className="text-[11px] font-semibold text-gray-700">{segment.label}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <strong className="text-[20px] font-black" style={{ color: segment.color }}>{segment.value}%</strong>
                <span className="text-[10px] text-gray-400">{segment.count}/247</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <Scale size={16} style={{ color }} />
          <h2 className="text-[15px] font-bold text-gray-900">满意体验与继续付费意向的关联</h2>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">
          “继续付费意向”包含继续计算营和转向其他数学专项；以下仅表示相关，不证明因果。
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {theme.driverRelations.map((relation) => (
            <article key={relation.title} className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
              <h3 className="text-[12px] font-bold text-gray-800">{relation.title}</h3>
              <p className="mt-1 min-h-[32px] text-[10px] leading-4 text-gray-400">{relation.note}</p>
              <div className="mt-4 space-y-3">
                {relation.groups.map((group) => (
                  <div key={group.label}>
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="font-medium text-gray-600">
                        {group.label}
                        {group.lowSample && <em className="ml-1 not-italic text-amber-600">低样本</em>}
                      </span>
                      <span className="font-bold text-gray-800">{group.value}% · {group.positive}/{group.total}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full rounded-full" style={{ width: `${group.value}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
        <article className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <BookOpenCheck size={16} style={{ color }} />
            <h2 className="text-[15px] font-bold text-gray-900">改进信号</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {theme.improvementSignals.map((signal) => (
              <div key={signal.title} className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                <h3 className="text-[11px] font-bold" style={{ color: signal.color }}>{signal.title}</h3>
                <div className="mt-3 space-y-3">
                  {signal.items.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-baseline gap-2">
                        <strong className="text-[17px] font-black" style={{ color: signal.color }}>{item.value}</strong>
                        <span className="text-[10px] font-semibold text-gray-700">{item.label}</span>
                      </div>
                      <p className="mt-1 text-[9px] leading-4 text-gray-400">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[22px] border p-5 shadow-sm sm:p-6" style={{ borderColor: `${color}35`, backgroundColor: `${color}08` }}>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={16} style={{ color }} />
            <h2 className="text-[15px] font-bold text-gray-900">业务建议</h2>
          </div>
          <div className="mt-4 space-y-3">
            {theme.actions.map((text) => (
              <div key={text} className="flex gap-2.5">
                <ArrowRight size={14} className="mt-1 shrink-0" style={{ color }} />
                <p className="text-[11px] font-medium leading-5 text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
        <CircleAlert size={14} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-[10px] leading-5 text-amber-800"><strong>口径说明：</strong>{theme.caveat}</p>
      </section>
    </>
  );
}

function SatisfactionVoicesView({ theme, color }: { theme: SatisfactionVoicesTheme; color: string }) {
  return (
    <>
      <section
        className="overflow-hidden rounded-[24px] border bg-white shadow-[0_12px_35px_rgba(30,35,40,0.06)]"
        style={{ borderColor: `${color}35` }}
      >
        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.75fr] lg:p-8">
          <div>
            <p className="text-[11px] font-bold tracking-[0.16em]" style={{ color }}>{theme.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-[26px] font-black leading-[1.3] text-[#242421] sm:text-[32px]">
              {theme.title}
            </h1>
            <p className="mt-4 max-w-4xl text-[14px] leading-7 text-gray-600">{theme.thesis}</p>
          </div>
          <div className="rounded-2xl border p-5" style={{ borderColor: `${color}25`, backgroundColor: `${color}0C` }}>
            <div className="flex items-center gap-2 text-[11px] font-bold" style={{ color }}>
              <MessageSquareQuote size={14} />
              开放题语料
            </div>
            <p className="mt-3 text-[14px] font-bold leading-6 text-gray-800">{theme.sample}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 border-t pt-3" style={{ borderColor: `${color}20` }}>
              <SourceBadge source="课程的满意度问卷表" />
              <SourceBadge source="客户数据详情逐条回答" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[22px] bg-[#2D292A] p-5 text-white shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} style={{ color: '#F1B8C5' }} />
          <h2 className="text-[15px] font-bold">定性总结</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {theme.summaryPoints.map((point, index) => (
            <article key={point.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <span className="text-[10px] font-black tracking-[0.12em]" style={{ color: '#F1B8C5' }}>
                0{index + 1}
              </span>
              <h3 className="mt-2 text-[12px] font-bold leading-5">{point.title}</h3>
              <p className="mt-2 text-[10px] leading-5 text-white/60">{point.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch size={16} style={{ color }} />
              <h2 className="text-[15px] font-bold text-gray-900">不满意原因路径与用户原声</h2>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-gray-400">
              每条路径同时呈现问卷信号、续购影响、业务总结与匿名原声，重点语句已高亮。
            </p>
          </div>
          <span className="text-[10px] text-gray-400">五条路径允许重叠，不相加为总体不满意率</span>
        </div>

        <div className="mt-5 space-y-4">
          {theme.dissatisfactionPaths.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[22px] border bg-[#FCFCFA]"
              style={{ borderColor: `${item.color}35` }}
            >
              <div className="grid gap-5 p-5 lg:grid-cols-[210px_minmax(0,1fr)_minmax(280px,.85fr)]">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[28px] font-black tracking-tight" style={{ color: item.color }}>
                      {item.metric}
                    </span>
                    <span
                      className="rounded-full px-2 py-1 text-[9px] font-bold"
                      style={{ color: item.color, backgroundColor: `${item.color}12` }}
                    >
                      {item.scope}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[16px] font-black text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-[11px] leading-5 text-gray-500">{item.signal}</p>
                  <p className="mt-3 text-[9px] text-gray-400">来源：{item.source}</p>
                </div>

                <div className="border-gray-200 lg:border-x lg:px-5">
                  <p className="text-[10px] font-bold tracking-[0.12em] text-gray-400">原因路径与总结</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {item.path.map((step, index) => (
                      <React.Fragment key={step}>
                        <span
                          className="rounded-xl border bg-white px-3 py-2 text-[11px] font-semibold text-gray-700"
                          style={{ borderColor: `${item.color}30` }}
                        >
                          {step}
                        </span>
                        {index < item.path.length - 1 && <ArrowRight size={13} className="text-gray-300" />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl px-3.5 py-3" style={{ backgroundColor: `${item.color}0C` }}>
                    <p className="text-[10px] font-bold" style={{ color: item.color }}>{item.purchaseImpact}</p>
                    <p className="mt-1.5 text-[10px] leading-5 text-gray-500">{item.implication}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote size={14} style={{ color: item.color }} />
                    <p className="text-[10px] font-bold tracking-[0.12em] text-gray-400">匿名用户原声</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {item.voices.map((voice) => (
                      <blockquote key={voice.text} className="rounded-xl border border-gray-100 bg-white px-3.5 py-3">
                        <p className="text-[11px] leading-5 text-gray-700">
                          “<HighlightedVoice text={voice.text} color={item.color} />”
                        </p>
                        <footer className="mt-2 flex flex-wrap items-center gap-1.5 text-[9px] font-medium">
                          <span
                            className="rounded-full px-2 py-0.5"
                            style={{ color: item.color, backgroundColor: `${item.color}12` }}
                          >
                            {voice.kind}
                          </span>
                          <span className="text-gray-400">{voice.context}</span>
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
        <CircleAlert size={14} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-[10px] leading-5 text-amber-800"><strong>口径说明：</strong>{theme.caveat}</p>
      </section>
    </>
  );
}

export default function CalculationInsightsPage() {
  const [activeId, setActiveId] = React.useState<CalculationInsightTheme['id']>('segments');
  const theme = CALCULATION_INSIGHT_THEMES.find((item) => item.id === activeId)
    ?? CALCULATION_INSIGHT_THEMES[0];
  const color = THEME_COLORS[theme.id];

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F6F7F5]">
      <header className="shrink-0 border-b border-[#E8E2D9] bg-[#FEFDF9] px-4 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-[1240px] items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
            <BarChart3 size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900">行业研究洞察</h2>
            <p className="mt-0.5 text-[11px] text-gray-400">
              定量问卷为主证据，结合行业研究、业务数据与策略分析
            </p>
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-[1240px] overflow-x-auto">
          {CALCULATION_INSIGHT_THEMES.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={cn(
                'relative shrink-0 px-4 py-3 text-[13px] font-medium transition-colors sm:px-5',
                activeId === item.id ? 'font-bold' : 'text-gray-500 hover:text-gray-700',
              )}
              style={activeId === item.id ? { color: THEME_COLORS[item.id] } : undefined}
            >
              {item.tab}
              {activeId === item.id && (
                <span
                  className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                  style={{ backgroundColor: THEME_COLORS[item.id] }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1240px] space-y-5 px-4 py-6 sm:px-6 sm:py-8">
          {theme.layout === 'satisfaction-voices' ? (
            <SatisfactionVoicesView theme={theme} color={color} />
          ) : theme.layout === 'satisfaction-survey' ? (
            <SatisfactionSurveyView theme={theme} color={color} />
          ) : (
          <>
          <section
            className="overflow-hidden rounded-[24px] border bg-white shadow-[0_12px_35px_rgba(30,35,40,0.06)]"
            style={{ borderColor: `${color}35` }}
          >
            <div className="grid gap-8 p-6 lg:grid-cols-[1.45fr_0.8fr] lg:p-8">
              <div>
                <p className="text-[11px] font-bold tracking-[0.16em]" style={{ color }}>
                  {theme.eyebrow}
                </p>
                <h1 className="mt-3 max-w-4xl text-[26px] font-black leading-[1.3] text-[#242421] sm:text-[32px]">
                  {theme.title}
                </h1>
                <p className="mt-4 max-w-4xl text-[14px] leading-7 text-gray-600">
                  {theme.thesis}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#F8F8F6] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                  <Compass size={13} style={{ color }} />
                  本主题涉及的方案
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {theme.involved.map((name) => (
                    <span
                      key={name}
                      className="rounded-full border bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-700"
                      style={{ borderColor: `${color}35` }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <p className="mt-4 border-t border-gray-200 pt-3 text-[11px] leading-5 text-gray-400">
                  竞品仅在支持当前结论时出现，完整详情仍在“竞品与市场”页查看。
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {theme.metrics.map((metric) => (
              <article key={`${metric.value}-${metric.label}`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[25px] font-black tracking-tight" style={{ color }}>
                    {metric.value}
                  </span>
                  <span className={cn('rounded-full border px-2 py-0.5 text-[9px] font-semibold', TYPE_STYLES[metric.type])}>
                    {metric.type}
                  </span>
                </div>
                <h3 className="mt-2 text-[13px] font-bold text-gray-900">{metric.label}</h3>
                <p className="mt-1.5 min-h-[42px] text-[11px] leading-[1.65] text-gray-500">{metric.detail}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
                  <span className="text-[9px] text-gray-400">{metric.scope}</span>
                  <SourceBadge source={metric.source} />
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Scale size={16} style={{ color }} />
              <h2 className="text-[15px] font-bold text-gray-900">{theme.comparisonTitle}</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {theme.comparisons.map((item) => (
                <article key={item.name} className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.name.charAt(0)}
                    </span>
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-900">{item.name}</h3>
                      <p className="text-[9px] font-medium text-gray-400">{item.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] leading-[1.6]">
                    <p className="text-gray-600"><strong className="text-gray-800">优势：</strong>{item.strength}</p>
                    <p className="text-gray-500"><strong className="text-gray-700">缺口：</strong>{item.gap}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <BookOpenCheck size={16} style={{ color }} />
                <h2 className="text-[15px] font-bold text-gray-900">证据意味着什么</h2>
              </div>
              <div className="mt-4 space-y-3">
                {theme.interpretations.map((text, index) => (
                  <div key={text} className="flex gap-3 rounded-xl bg-[#F8F8F6] px-3.5 py-3">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {index + 1}
                    </span>
                    <p className="text-[12px] leading-6 text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[22px] border p-5 shadow-sm sm:p-6" style={{ borderColor: `${color}35`, backgroundColor: `${color}08` }}>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={16} style={{ color }} />
                <h2 className="text-[15px] font-bold text-gray-900">业务启示</h2>
              </div>
              <div className="mt-4 space-y-3">
                {theme.actions.map((text) => (
                  <div key={text} className="flex gap-2.5">
                    <ArrowRight size={14} className="mt-1 shrink-0" style={{ color }} />
                    <p className="text-[12px] font-medium leading-6 text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/70 bg-white/70 px-3.5 py-3">
                <Lightbulb size={14} className="mt-0.5 shrink-0" style={{ color }} />
                <p className="text-[11px] leading-5 text-gray-500">
                  这里给出的是当前证据下的优先行动方向，策略推演仍需通过产品实验和转化数据验证。
                </p>
              </div>
            </article>
          </section>

          <section className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
            <CircleAlert size={14} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-[10px] leading-5 text-amber-800">
              <strong>口径说明：</strong>{theme.caveat}
            </p>
          </section>
          </>
          )}
        </div>
      </main>
    </div>
  );
}
