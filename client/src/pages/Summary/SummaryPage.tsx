import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Sparkles,
  Loader2,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  BookOpen,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useProject, useProjectVOCs, projectActions } from '../../store/useProjectStore';
import { apiGenerateSummary } from '../../api/ai';

export default function SummaryPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useProject(projectId);
  const vocs = useProjectVOCs(projectId);
  const [loading, setLoading] = React.useState(false);

  const summary = project?.summaryData;
  const hasFiles = (project?.files.length ?? 0) > 0;
  const processingFiles = project?.files.filter(
    (f) => f.status === 'uploading' || f.status === 'processing',
  ).length ?? 0;

  const generate = async () => {
    if (!projectId || !project) return;
    if (vocs.length === 0) {
      toast.error('当前项目没有解析完成的文件，请先上传并等待处理完成');
      return;
    }
    setLoading(true);
    try {
      const result = await apiGenerateSummary(vocs, project.name);
      projectActions.setSummary(projectId, { ...result, generatedAt: Date.now() });
      toast.success('项目总结生成成功');
    } catch (err) {
      toast.error(`生成失败：${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate when vocs become available
  React.useEffect(() => {
    if (!summary && vocs.length > 0 && !loading) {
      void generate();
    }
  }, [vocs.length]);

  if (!project) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">项目总结</h2>
          <p className="text-[13px] text-gray-400">
            基于 {vocs.length} 条用户原声，AI 自动生成研究总结
          </p>
        </div>
        <button
          onClick={generate}
          disabled={loading || vocs.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4361EE] text-white text-[13px] font-medium hover:bg-[#3451d1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin" />生成中...</>
          ) : (
            <><RefreshCw size={14} />{summary ? '重新生成' : 'AI 生成总结'}</>
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={40} className="text-[#4361EE] animate-spin mb-4" />
          <p className="text-gray-600 font-medium">AI 正在生成项目总结…</p>
          <p className="text-gray-400 text-[13px] mt-1">通常需要 15–30 秒</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !summary && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <FileText size={28} className="text-gray-300" />
          </div>
          <h3 className="text-[16px] font-semibold text-gray-700 mb-2">
            {!hasFiles ? '请先上传文件' : processingFiles > 0 ? '文件处理中…' : '点击右上角生成总结'}
          </h3>
          <p className="text-[13px] text-gray-400 max-w-xs">
            {!hasFiles
              ? '在顶部文件栏上传访谈文字稿或录音，AI 将自动提取分析数据'
              : processingFiles > 0
              ? `正在处理 ${processingFiles} 个文件，处理完成后可以生成总结`
              : '已有数据可供分析，点击「AI 生成总结」开始'}
          </p>
        </div>
      )}

      {/* Summary content */}
      {!loading && summary && (
        <div className="space-y-5">
          {/* Project info card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-[#4361EE]" />
              <h3 className="font-semibold text-gray-900 text-[14px]">项目信息</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="项目名称" value={project.name} />
              <StatCard
                label="样本"
                value={`${project.files.filter((f) => f.status === 'ready').length} 位家长`}
              />
              <StatCard
                label="品牌 / 产品"
                value={`${new Set(vocs.map((v) => v.brand)).size} 类`}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[11px] text-gray-400 mb-1.5">研究方法</p>
              <p className="text-[13px] text-gray-700">{summary.methodology}</p>
            </div>
          </motion.div>

          {/* Core findings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb size={16} className="text-amber-500" />
              <h3 className="font-semibold text-gray-900 text-[14px]">核心发现</h3>
              <span className="ml-1 flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[11px] rounded-full">
                <Sparkles size={10} /> AI 生成
              </span>
            </div>
            <div className="space-y-3">
              {summary.coreFindings.map((finding, i) => (
                <div key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-[#4361EE]/10 text-[#4361EE] rounded-lg flex items-center justify-center text-[12px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[13px] text-gray-700 leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action items */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <ArrowRight size={16} className="text-emerald-500" />
              <h3 className="font-semibold text-gray-900 text-[14px]">行动建议</h3>
            </div>
            <div className="space-y-2.5">
              {summary.actionItems.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100"
                >
                  <span className="shrink-0 w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[13px] text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Generated at */}
          <p className="text-[11px] text-gray-300 text-center">
            生成于 {new Date(summary.generatedAt).toLocaleString('zh-CN')}
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      <p className="text-[13px] font-semibold text-gray-800">{value}</p>
    </div>
  );
}
