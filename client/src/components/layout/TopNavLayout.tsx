import React from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Microscope, PenLine } from 'lucide-react';
import FileBar from './FileBar';
import { useIsEditor } from '../auth/PasswordGate';

const NAV_ITEMS = [
  { label: '项目总结',  path: 'summary' },
  { label: '定性洞察',  path: 'qualitative' },
  { label: '竞品分析',  path: 'competitive' },
  { label: '定量报告',  path: 'quantitative' },
  { label: '营销落地',  path: 'marketing' },
] as const;

export default function TopNavLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const editor = useIsEditor();

  const active = location.pathname.split('/').pop() ?? 'summary';
  const hideFileBar = active === 'summary' || active === 'marketing';

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#FEFDF9' }}>
      {/* ── Top nav bar ── */}
      <nav
        className="shrink-0 flex items-center gap-1 px-5"
        style={{
          height: 48,
          background: '#FEFDF9',
          borderBottom: '1.5px solid #E8E2D9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 mr-5 shrink-0"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/projects')}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#FF5722' }}
          >
            <Microscope size={14} color="white" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#2A2A2A', letterSpacing: '-0.3px' }}>
            用研项目集锦
          </span>
        </div>

        {/* Nav items */}
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ label, path }) => {
            const isActive = active === path;
            return (
              <button
                key={path}
                onClick={() => navigate(`/projects/${projectId}/${path}`)}
                className="relative px-4 flex items-center transition-colors"
                style={{
                  height: 48,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FF5722' : '#666',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.1px',
                }}
              >
                {label}
                {/* Active underline */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 rounded-t-full"
                    style={{ height: 2.5, background: '#FF5722' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {editor && (
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 shrink-0">
            <PenLine size={11} className="text-amber-600" />
            <span className="text-[11px] font-medium text-amber-700">编辑模式</span>
          </div>
        )}
      </nav>

      {/* FileBar only for data-analysis pages */}
      {!hideFileBar && <FileBar />}

      {/* Page content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
