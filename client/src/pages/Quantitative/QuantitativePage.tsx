import React from 'react';
import { BarChart3, Upload, FileSpreadsheet, Construction } from 'lucide-react';
import { toast } from 'sonner';

export default function QuantitativePage() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragging, setDragging] = React.useState(false);

  const handleFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const valid = arr.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ['xlsx', 'xls', 'csv'].includes(ext ?? '');
    });
    if (valid.length !== arr.length) {
      toast.error('仅支持 .xlsx / .xls / .csv 格式');
    }
    setFiles((prev) => [...prev, ...valid]);
    toast.info('定量数据上传功能即将上线，当前仅保存文件');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 size={20} className="text-[#4361EE]" />
        <h2 className="text-[22px] font-bold text-gray-900">定量报告</h2>
      </div>
      <p className="text-[13px] text-gray-400 mb-8">上传问卷或数据表，生成定量分析报告</p>

      {/* Coming soon banner */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-8">
        <Construction size={18} className="text-amber-500 shrink-0" />
        <p className="text-[13px] text-amber-700">
          定量分析功能正在开发中，当前可以先上传数据文件。
        </p>
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all
          ${dragging
            ? 'border-[#4361EE] bg-[#4361EE]/5'
            : 'border-gray-200 hover:border-[#4361EE]/50 hover:bg-gray-50'}
        `}
      >
        <div className="w-14 h-14 bg-[#4361EE]/10 rounded-2xl flex items-center justify-center mb-4">
          <Upload size={24} className="text-[#4361EE]" />
        </div>
        <p className="text-[15px] font-semibold text-gray-700 mb-1">上传定量数据文件</p>
        <p className="text-[12px] text-gray-400">支持 .xlsx / .xls / .csv，可拖拽上传</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              void handleFiles(e.target.files);
              e.target.value = '';
            }
          }}
        />
      </div>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-[12px] text-gray-400 mb-3 font-medium uppercase tracking-wide">
            已上传文件
          </p>
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
            >
              <FileSpreadsheet size={16} className="text-emerald-500 shrink-0" />
              <span className="text-[13px] text-gray-700 flex-1 truncate">{f.name}</span>
              <span className="text-[11px] text-gray-400">
                {(f.size / 1024).toFixed(0)} KB
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
