"use client";

import { motion } from "framer-motion";

/**
 * HoverToggle 组件
 * 控制"意境·幻象"区域的悬停动画行为
 *
 * @param isInteractive - true = 悬停触发玻璃层滑入动画；false = 玻璃层与文字常驻显示
 */
export default function HoverToggle({
  isInteractive,
  onChange,
}: {
  isInteractive: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className={isInteractive ? "text-sky-500 font-medium" : ""}>
          悬停动画
        </span>

        {/* 开关按钮 */}
        <button
          type="button"
          onClick={() => onChange(!isInteractive)}
          className="relative w-11 h-6 rounded-full transition-colors duration-300"
          style={{ backgroundColor: isInteractive ? "#0ea5e9" : "#94a3b8" }}
          title={isInteractive ? "切换到：玻璃层常驻显示" : "切换到：悬停触发动画"}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
            animate={{ x: isInteractive ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>

        <span className={!isInteractive ? "text-amber-500 font-medium" : ""}>
          始终显示
        </span>
      </div>
     
    </div>
  );
}
