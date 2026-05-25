import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageSquare, BarChart2, BarChart3, ChevronLeft } from 'lucide-react';

/**
 * 项目总结页 — 全屏展示数据新闻叙事报告（story.html）
 * 浮动导航栏提供前往其他分析模块的入口
 */
export default function SummaryPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-[#FEFDF9]">
      {/* Full-screen iframe */}
      <iframe
        src="/story.html"
        title="竞品用户研究叙事报告"
        className="w-full h-full border-0"
      />

      {/* Floating nav trigger */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        {navOpen && (
          <div
            className="flex flex-col gap-1.5 bg-white rounded-2xl border border-[#E8E2D9] p-2"
            style={{ boxShadow: '3px 4px 0 rgba(0,0,0,0.1)' }}
          >
            <NavBtn
              icon={<MessageSquare size={13} />}
              label="定性洞察"
              onClick={() => navigate(`/projects/${projectId}/qualitative`)}
            />
            <NavBtn
              icon={<BarChart2 size={13} />}
              label="竞品分析"
              onClick={() => navigate(`/projects/${projectId}/competitive`)}
            />
            <NavBtn
              icon={<BarChart3 size={13} />}
              label="定量报告"
              onClick={() => navigate(`/projects/${projectId}/quantitative`)}
            />
            <div className="h-px bg-[#E8E2D9] mx-1 my-0.5" />
            <NavBtn
              icon={<ChevronLeft size={13} />}
              label="项目列表"
              onClick={() => navigate('/projects')}
            />
          </div>
        )}

        <button
          onClick={() => setNavOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-[13px] font-bold transition-all"
          style={{
            background: '#FF5722',
            boxShadow: '3px 4px 0 rgba(255,87,34,0.35)',
          }}
        >
          <span style={{ fontSize: 16 }}>🔬</span>
          {navOpen ? '收起' : '分析模块'}
        </button>
      </div>
    </div>
  );
}

function NavBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors text-left w-full"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </button>
  );
}
