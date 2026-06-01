import React, { useState } from 'react';
import { FileText } from 'lucide-react';

const REPORTS = [
  { id: 'miaodong', name: '妙懂', desc: 'AR学习APP · 五科覆盖', src: '/reports/miaodong.pdf' },
  { id: 'wuli-shifen', name: '物理十分通', desc: '动画科普 · 吴姥姥IP', src: '/reports/wuli-shifen.pdf' },
  { id: 'nobook', name: 'NoBook', desc: '虚拟实验室 · B转C', src: '/reports/nobook.pdf' },
  { id: 'sanwu-xiaoxing', name: '三五小星', desc: '地理八分钟 · 复旦教授', src: '/reports/sanwu-xiaoxing.pdf' },
];

export default function CompetitiveReportsPage() {
  const [activeId, setActiveId] = useState(REPORTS[0].id);
  const active = REPORTS.find((r) => r.id === activeId) ?? REPORTS[0];

  return (
    <div className="flex h-full">
      {/* Left sidebar - brand list */}
      <aside
        className="shrink-0 flex flex-col gap-2 p-4 overflow-y-auto"
        style={{
          width: 220,
          borderRight: '1.5px solid #E8E2D9',
          background: '#FAF8F4',
        }}
      >
        <h3
          className="px-2 mb-1"
          style={{ fontSize: 12, fontWeight: 700, color: '#999', letterSpacing: '0.5px' }}
        >
          竞品报告
        </h3>
        {REPORTS.map((r) => {
          const isActive = r.id === activeId;
          return (
            <button
              key={r.id}
              onClick={() => setActiveId(r.id)}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
              style={{
                background: isActive ? '#FFF4F0' : 'transparent',
                border: isActive ? '1.5px solid #FFCCBC' : '1.5px solid transparent',
                cursor: 'pointer',
              }}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: isActive ? '#FF5722' : '#E8E2D9',
                }}
              >
                <FileText size={14} color={isActive ? 'white' : '#999'} />
              </div>
              <div className="min-w-0">
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#D84315' : '#333',
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: isActive ? '#BF360C' : '#999',
                    marginTop: 2,
                  }}
                >
                  {r.desc}
                </div>
              </div>
            </button>
          );
        })}
      </aside>

      {/* Right content - PDF viewer */}
      <div className="flex-1 min-w-0">
        <iframe
          key={active.id}
          src={active.src}
          title={active.name}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
