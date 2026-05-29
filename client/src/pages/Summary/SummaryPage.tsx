import React from 'react';
import { BarChart2, TrendingDown, Users, Radio } from 'lucide-react';

const GRADE_DATA = [
  { grade: '1年级', pct: 15, color: '#4BA69E' },
  { grade: '2年级', pct: 20, color: '#5B7BBF' },
  { grade: '3年级', pct: 25, color: '#E07A6E' },
  { grade: '4年级', pct: 18, color: '#BF9455' },
  { grade: '5年级', pct: 8,  color: '#A87DB0' },
  { grade: '6年级', pct: 5,  color: '#CC9450' },
  { grade: '初中+', pct: 9,  color: '#9090A8' },
];

const CHANNEL_DATA = [
  { channel: '新媒体', desc: '新用户为主', pct: 68, color: '#E07A6E' },
  { channel: 'APP',    desc: '付费用户为主', pct: 18, color: '#5B7BBF' },
  { channel: '电销/网销', desc: '高净值用户', pct: 14, color: '#BF9455' },
];

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white">
      <div className="w-9 h-9 rounded-lg bg-[#FF5722]/10 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
        <p className="text-[22px] font-extrabold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function BarRow({ label, pct, color, sub }: { label: string; pct: number; color: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-gray-600 font-medium w-16 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500">{pct}%</span>
      </div>
      {sub && <span className="text-[10px] text-gray-400 w-20 shrink-0">{sub}</span>}
    </div>
  );
}

export default function SummaryPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Sales data overview panel */}
      <div className="shrink-0 border-b border-gray-100" style={{ background: '#FEFDF9' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} className="text-[#FF5722]" />
            <h2 className="text-[14px] font-bold text-gray-900">售卖数据概览</h2>
            <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              来源：飞书调研文档
            </span>
          </div>

          {/* Key stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <StatCard
              icon={<Users size={14} className="text-[#FF5722]" />}
              label="核心用户年级"
              value="1–3 年级"
              sub="占比约 60%"
            />
            <StatCard
              icon={<Radio size={14} className="text-[#FF5722]" />}
              label="新媒体渠道占比"
              value="近 70%"
              sub="新用户主要来源"
            />
            <StatCard
              icon={<TrendingDown size={14} className="text-[#FF5722]" />}
              label="5年级起"
              value="断崖下降"
              sub="高年级流失显著"
            />
            <StatCard
              icon={<BarChart2 size={14} className="text-[#FF5722]" />}
              label="活跃家庭数"
              value="1,353"
              sub="人均观看 86 次"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Grade distribution */}
            <div className="p-4 rounded-xl border border-gray-100 bg-white">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">年级分布</p>
              <div className="space-y-2">
                {GRADE_DATA.map((d) => (
                  <BarRow key={d.grade} label={d.grade} pct={d.pct} color={d.color} />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 pl-[76px]">
                1-3年级合计约 60%（新媒体渠道接近 70%），5年级起断崖式下降
              </p>
            </div>

            {/* Channel breakdown */}
            <div className="p-4 rounded-xl border border-gray-100 bg-white">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">渠道用户特征</p>
              <div className="space-y-3">
                {CHANNEL_DATA.map((d) => (
                  <BarRow key={d.channel} label={d.channel} pct={d.pct} color={d.color} sub={d.desc} />
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  <strong className="text-gray-800">渠道洞察：</strong>
                  新媒体 = 新用户拉新主力；APP = 已付费用户的核心阵地；电销/网销 = 高净值用户转化渠道。
                  不同渠道的用户生命周期价值和续费意愿差异显著。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing story iframe fills remaining space */}
      <iframe
        src="/story.html"
        title="竞品用户研究叙事报告"
        className="flex-1 border-0"
        style={{ minHeight: 0 }}
      />
    </div>
  );
}
