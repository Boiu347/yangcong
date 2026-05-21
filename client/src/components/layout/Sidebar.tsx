import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  BarChart2,
  BarChart3,
  ChevronDown,
  Plus,
  Microscope,
} from 'lucide-react';
import { useProjects } from '../../store/useProjectStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: '项目总结', icon: FileText, path: 'summary' },
  { label: '定性洞察', icon: MessageSquare, path: 'qualitative' },
  { label: '竞品分析', icon: BarChart2, path: 'competitive' },
  { label: '定量报告', icon: BarChart3, path: 'quantitative' },
];

export default function Sidebar() {
  const { projectId } = useParams<{ projectId: string }>();
  const projects = useProjects();
  const navigate = useNavigate();
  const [showProjects, setShowProjects] = React.useState(false);
  const currentProject = projects.find((p) => p.id === projectId);

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#4361EE] flex items-center justify-center shrink-0">
          <Microscope size={16} className="text-white" />
        </div>
        <span className="font-bold text-[15px] text-gray-900 tracking-tight">用研平台</span>
      </div>

      {/* Project switcher */}
      <div className="px-3 mb-2">
        <button
          onClick={() => setShowProjects((v) => !v)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 font-medium mb-0.5">当前项目</p>
            <p className="text-[13px] font-semibold text-gray-800 truncate">
              {currentProject?.name ?? '未选择项目'}
            </p>
          </div>
          <ChevronDown
            size={14}
            className={cn(
              'text-gray-400 shrink-0 transition-transform',
              showProjects && 'rotate-180',
            )}
          />
        </button>

        {showProjects && (
          <div className="mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  navigate(`/projects/${p.id}/summary`);
                  setShowProjects(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors',
                  p.id === projectId ? 'text-[#4361EE] font-semibold bg-blue-50/50' : 'text-gray-700',
                )}
              >
                {p.name}
              </button>
            ))}
            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  navigate('/projects');
                  setShowProjects(false);
                }}
                className="w-full text-left px-4 py-2.5 text-[13px] text-gray-500 hover:bg-gray-50 flex items-center gap-2"
              >
                <Plus size={13} /> 管理项目
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="px-3 flex-1">
        <p className="px-3 mb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
          分析模块
        </p>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={`/projects/${projectId}/${path}`}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all',
                  isActive
                    ? 'bg-[#4361EE]/10 text-[#4361EE]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-[#4361EE]' : 'text-gray-400'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom: new project */}
      <div className="px-3 pb-5">
        <button
          onClick={() => navigate('/projects')}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-200 text-[12px] text-gray-400 hover:border-[#4361EE] hover:text-[#4361EE] transition-colors"
        >
          <Plus size={14} /> 新建 / 切换项目
        </button>
      </div>
    </aside>
  );
}
