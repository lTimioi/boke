"use client";
// 标记为客户端组件，因为需要使用 window.scrollTo 等浏览器 API

import Image from "next/image";
// 导入 Next.js 的 Image 组件，用于优化图片加载（比原生 <img> 更好）

// ==================== 滚动处理函数 ====================

/**
 * 平滑滚动到页面顶部
 * window.scrollTo 的 behavior: 'smooth' 实现平滑滚动动画
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * 平滑滚动到页面中间位置
 * document.documentElement.scrollHeight 获取页面总高度
 * 除以 2 得到中间位置
 */
function scrollToMiddle() {
  const middle = document.documentElement.scrollHeight / 2;
  window.scrollTo({ top: middle, behavior: "smooth" });
}

/**
 * 平滑滚动到页面最底端
 * 直接滚动到页面总高度即可
 */
function scrollToBottom() {
  const bottom = document.documentElement.scrollHeight;
  window.scrollTo({ top: bottom, behavior: "smooth" });
}

// ==================== 按钮配置数据 ====================

/**
 * 定义三个按钮的配置信息
 * 使用数组 + map 渲染，避免重复代码
 * 每个按钮包含：图标路径、提示文字、点击回调
 */
const buttons = [
  {
    src: "/arrow-up.svg",
    alt: "回到顶部",
    title: "回到顶部",
    onClick: scrollToTop,
  },
  {
    src: "/arrow-middle.svg",
    alt: "回到中间",
    title: "回到中间",
    onClick: scrollToMiddle,
  },
  {
    src: "/arrow-down.svg",
    alt: "到底部",
    title: "到底部",
    onClick: scrollToBottom,
  },
];

// ==================== 主组件 ====================

export default function ScrollNavigation() {
  return (
    // 外层容器：固定在页面左侧、垂直居中、z-index 保证在最上层
    <div className="fixed left-5.5 top-1/2 -translate-y-1/2 z-[10001] flex flex-col items-center">

      {/* 背景容器：毛玻璃效果，与项目整体风格一致 */}
      <div className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg">

        {/* 使用 map 遍历按钮配置，渲染三个按钮 */}
        {buttons.map((btn, index) => (
          <div key={btn.alt} className="flex flex-col items-center">

            {/* 按钮之间的分隔线（第一个按钮上方不显示） */}
            {index > 0 && (
              <div className="w-6 h-px bg-slate-300/60 dark:bg-slate-600/60 my-1" />
            )}

            {/* 滚动按钮 */}
            <button
              type="button"
              onClick={btn.onClick}
              title={btn.title}
              className="w-9 h-9 rounded-xl flex items-center justify-center
                         hover:bg-sky-100 dark:hover:bg-sky-900/30
                         active:scale-90
                         transition-all duration-200"
            >
              {/* 使用 next/image 渲染 SVG 图标 */}
              <Image
                src={btn.src}
                alt={btn.alt}
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
