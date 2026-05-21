import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Trash2, ArrowRight, Microscope } from 'lucide-react';
import { toast } from 'sonner';
import { useProjects, projectActions } from '../../store/useProjectStore';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const projects = useProjects();
  const navigate = useNavigate();
  const [creating, setCreating] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) { toast.error('请输入项目名称'); return; }
    const p = projectActions.create(name);
    setNewName('');
    setCreating(false);
    navigate(`/projects/${p.id}/summary`);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`确认删除「${name}」？该项目所有数据将被清除。`)) return;
    projectActions.delete(id);
    toast.success('项目已删除');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-start pt-16 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-[#4361EE] flex items-center justify-center">
          <Microscope size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用研平台</h1>
          <p className="text-sm text-gray-400">选择或创建一个研究项目</p>
        </div>
      </div>

      {/* Project cards */}
      <div className="w-full max-w-2xl space-y-3">
        {projects.map((p) => {
          const readyFiles = p.files.filter((f) => f.status === 'ready').length;
          const vocCount = p.files
            .filter((f) => f.status === 'ready')
            .reduce((sum, f) => sum + f.vocList.length, 0);

          return (
            <button
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}/summary`)}
              className="w-full bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-[#4361EE]/20 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4361EE]/10 flex items-center justify-center shrink-0">
                <FolderOpen size={18} className="text-[#4361EE]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-[15px]">{p.name}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {readyFiles > 0
                    ? `${readyFiles} 个文件 · ${vocCount} 条用户原声`
                    : '暂无文件'}
                  {' · '}
                  {new Date(p.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleDelete(p.id, p.name, e)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-[#4361EE] transition-colors" />
              </div>
            </button>
          );
        })}

        {/* Create new */}
        {creating ? (
          <div className="bg-white rounded-2xl border-2 border-[#4361EE] p-5">
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') { setCreating(false); setNewName(''); }
              }}
              placeholder="输入项目名称，例如：K12物理品牌调研2025Q2"
              className="w-full text-[15px] font-medium text-gray-900 outline-none placeholder:text-gray-300 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-[#4361EE] text-white text-[13px] font-medium rounded-lg hover:bg-[#3451d1] transition-colors"
              >
                创建项目
              </button>
              <button
                onClick={() => { setCreating(false); setNewName(''); }}
                className="px-4 py-2 text-gray-500 text-[13px] rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className={cn(
              'w-full flex items-center gap-3 p-5 rounded-2xl border-2 border-dashed border-gray-200',
              'text-gray-400 hover:border-[#4361EE] hover:text-[#4361EE] transition-all',
            )}
          >
            <Plus size={18} />
            <span className="text-[14px] font-medium">新建研究项目</span>
          </button>
        )}
      </div>
    </div>
  );
}
