"use client";
// 组件标识标签组件
import { useState } from "react";

/**
 * 组件标识标签 - 用于在页面上可视化标识每个组件区域
 * 显示组件名称、来源文件、功能说明
 */
export default function ComponentLabel({
  name,
  file,
  description,
  children,
}: {
  name: string;
  file: string;
  description: string;
  children: React.ReactNode;
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative group">
      {/* 悬浮标签 */}
      <div
        className="absolute -top-2 left-2 z-50 cursor-pointer select-none"
        onClick={() => setShowInfo(!showInfo)}
      >
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-bold rounded bg-blue-500/90 text-white shadow-lg backdrop-blur-sm border border-blue-400/50 hover:bg-blue-600/90 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          {name}
        </span>
      </div>

      {/* 点击展开的详细信息 */}
      {showInfo && (
        <div
          className="absolute -top-16 left-2 z-50 px-3 py-2 text-xs rounded-lg bg-gray-900/95 text-white shadow-xl backdrop-blur-sm border border-gray-700 min-w-[200px]"
          onClick={() => setShowInfo(false)}
        >
          <div className="font-bold text-blue-400 mb-1">{name}</div>
          <div className="text-gray-400 text-[10px] mb-1">📁 {file}</div>
          <div className="text-gray-300">{description}</div>
          <div className="text-gray-500 text-[10px] mt-1">点击关闭</div>
        </div>
      )}

      {/* 区域边框高亮 */}
      <div className="relative ring-1 ring-transparent hover:ring-blue-400/30 transition-all duration-300 rounded-lg">
        {children}
      </div>
    </div>
  );
}
