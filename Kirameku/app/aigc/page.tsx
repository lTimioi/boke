"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import HoverToggle from "@/components/ui/HoverToggle";
import TopORDown from "@/components/ui/topORdown";
/* ── Types ── */
interface Artwork {
  id: number;
  prefix: string; // filename prefix, e.g. "2" → 2.jpg + 2.md
  title: string;
}

interface GalleryItem {
  id: number;
  prefix: string;
  
  src: string; // 图片完整路径
  title: string;
}

/* ── 数据：意境·幻象（图片 + 文字描述）── */
const fantasyWorks: Artwork[] = [
  { id: 1, prefix: "2", title: "山海幻境" },
  { id: 2, prefix: "3", title: "星夜流光" },
  { id: 3, prefix: "4", title: "花语秘境" },
  { id: 4, prefix: "5", title: "机械心跳" },
  { id: 5, prefix: "6", title: "杉满福" },
 
];

/* ── 数据：艺术长廊（仅图片，与意境·幻象使用不同图片）── */
const galleryWorks: GalleryItem[] = [
   { id: 0, prefix: "7", src: "/images/aigc/7.jpg", title: "谷雨植境" },
  { id: 1, prefix: "8", src: "/images/aigc/8.jpg", title: "柔焦花境" },
  { id: 2, prefix: "9", src: "/images/aigc/9.jpg", title: "染花境" },

  { id: 3, prefix: "", src: "/images/1.webp", title: "晨曦微光" },
  { id: 8, prefix: "", src: "/images/41.webp", title: "秘境之约" },
  { id: 9, prefix: "", src: "/images/42.webp", title: "远山如黛" },
  { id: 10, prefix: "", src: "/images/55.webp", title: "城市之光" },
];

/* ── 动画预设 ── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};
const fadeScale = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 280, damping: 20 } },
};

/* ── Markdown 渲染 ── */
function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold text-sky-600 dark:text-sky-400 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-white mb-2">$1</h2>')
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-3 border-sky-400/60 pl-3 italic text-white/70 text-sm my-2">$1</blockquote>')
    .replace(/\n\n/g, "<br/>")
    .replace(/([^>])\n([^>\n#])/g, "$1<br/>$2");
}

/* ===================== 主页面 ===================== */
export default function AIGCPage() {
  const [isInteractive, setIsInteractive] = useState(true); // true = 悬停触发动画
  const [textContents, setTextContents] = useState<Record<string, string>>({});
  const [lightbox, setLightbox] = useState<{ group: "fantasy" | "gallery"; index: number } | null>(null);

  // 读取文字内容（意境·幻象全部加载；艺术长廊仅加载有 prefix 的项目）
  useEffect(() => {
    const prefixes = [
      ...fantasyWorks.map((a) => a.prefix),
      ...galleryWorks.map((g) => g.prefix).filter(Boolean),
    ];
    prefixes.forEach(async (prefix) => {
      try {
        const res = await fetch(`/text/aigc/${prefix}.md`);
        if (res.ok) {
          const text = await res.text();
          setTextContents((prev) => ({ ...prev, [prefix]: text }));
        }
      } catch {
        /* 静默 */
      }
    });
  }, []);

  const getTitle = useCallback(
    (prefix: string) => {
      const raw = textContents[prefix] || "";
      const match = raw.match(/^##\s+(.*)$/m);
      return match ? match[1] : fantasyWorks.find((a) => a.prefix === prefix)?.title || "无题";
    },
    [textContents]
  );

  const getTextSummary = useCallback(
    (prefix: string, maxLen = 80) => {
      const raw = textContents[prefix] || "";
      const plain = raw
        .replace(/^#+\s*/gm, "")
        .replace(/>\s*/g, "")
        .replace(/\*\*/g, "")
        .replace(/\n/g, " ");
      return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain;
    },
    [textContents]
  );

  // Lightbox
  const openLightbox = (group: "fantasy" | "gallery", index: number) => setLightbox({ group, index });
  const closeLightbox = () => setLightbox(null);
  const stepImage = (dir: 1 | -1) =>
    setLightbox((prev) => {
      if (!prev) return prev;
      const works = prev.group === "fantasy" ? fantasyWorks : galleryWorks;
      return { ...prev, index: (prev.index + dir + works.length) % works.length };
    });

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepImage(-1);
      if (e.key === "ArrowRight") stepImage(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // 加入组件
    <>
      <TopORDown />
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12"
    >
      {/* ═══ 页头 ═══ */}
      <motion.div variants={fadeUp} className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">幻绘</h1>
        </div>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 ml-10 md:ml-13">
          梦幻画卷 · 在像素与想象之间探索无限可能
        </p>
      </motion.div>

      {/* ═══ 意境·幻象 ═══ */}
      <motion.div variants={fadeUp} className="mb-10 md:mb-14">
        <ZoneCard
          title="意境·幻象"
          subtitle="Artistic Realm"
          works={fantasyWorks}
          isInteractive={isInteractive}
          textContents={textContents}
          getTitle={getTitle}
          getTextSummary={getTextSummary}
          onImageClick={(idx) => openLightbox("fantasy", idx)}
          hoverToggle={
            <motion.div
              variants={fadeScale}
              className="bg-white/80 dark:bg-slate-700/60 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-200/50 dark:border-slate-600/50 shadow-sm"
            >
              <HoverToggle isInteractive={isInteractive} onChange={setIsInteractive} />
            </motion.div>
          }
        />
      </motion.div>

      {/* ═══ 艺术长廊 ═══ */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <ImageIcon className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">艺术长廊</h2>
          <span className="text-xs text-slate-400 ml-1">点击图片查看大图</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {galleryWorks.map((item, idx) => (
            <motion.button
              key={item.id}
              variants={fadeScale}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openLightbox("gallery", idx)}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-slate-200 dark:bg-slate-700 shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-sm font-bold text-white">{item.title}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ═══ Lightbox ═══ */}
      <AnimatePresence>
        {lightbox !== null &&
          (() => {
            const works =
              lightbox.group === "fantasy" ? fantasyWorks : galleryWorks;
            const current = works[lightbox.index];
            const isFantasy = lightbox.group === "fantasy";
            const currentPrefix = isFantasy
              ? (current as Artwork).prefix
              : (current as GalleryItem).prefix;
            const currentText = currentPrefix ? textContents[currentPrefix] : "";
            const currentTitle = currentText
              ? getTitle(currentPrefix)
              : current.title;
            const imgSrc = isFantasy
              ? `/images/aigc/${(current as Artwork).prefix}.jpg`
              : (current as GalleryItem).src;
            // 意境·幻象始终显示文字区；艺术长廊仅当配置了 prefix 时显示介绍
            const showTextPanel = isFantasy || !!currentPrefix;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center"
                onClick={closeLightbox}
              >
                <motion.div
                  key={`${lightbox.group}-${lightbox.index}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative max-w-[90vw] max-h-[90vh] flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/20 flex-shrink-0">
                    <img
                      src={imgSrc}
                      alt={currentTitle}
                      className="max-h-[70vh] max-w-[85vw] md:max-w-[50vw] object-contain"
                    />
                  </div>
                  {showTextPanel && (
                    <div className="md:w-72 flex flex-col gap-3 text-white/90 max-h-[70vh] overflow-y-auto p-2">
                      <h3 className="text-xl font-bold text-white">
                        {currentTitle}
                      </h3>
                      <div
                        className="text-sm text-white/70 leading-relaxed space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(currentText || ""),
                        }}
                      />
                    </div>
                  )}
                </motion.div>

                <button
                  type="button"
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {works.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepImage(-1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepImage(1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {lightbox.index + 1} / {works.length}
                </div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </motion.div>
    </>
  );
}

/* ════════════════════════ ZoneCard ════════════════════════ */

function ZoneCard({
  title,
  subtitle,
  works,
  isInteractive,
  textContents,
  getTitle,
  getTextSummary,
  onImageClick,
  hoverToggle,
}: {
  title: string;
  subtitle: string;
  works: Artwork[];
  isInteractive: boolean;
  textContents: Record<string, string>;
  getTitle: (prefix: string) => string;
  getTextSummary: (prefix: string, maxLen?: number) => string;
  onImageClick: (index: number) => void;
  hoverToggle: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeScale}
      className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-sky-500/30 shadow-lg overflow-hidden"
    >
      {/* 标题 */}
      <div className="px-4 md:px-5 pt-4 md:pt-5 pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white tracking-wider">
              {title}
            </h3>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">{subtitle}</p>
          </div>
          {hoverToggle}
        </div>
      </div>

      {/* 图片: 单列大图 */}
      <div className="p-3 md:p-4 space-y-3">
        {works.map((art, idx) => {
          const hasText = !!textContents[art.prefix];
          return (
            <div key={art.id}>
              <HoverZone
                prefix={art.prefix}
                artId={art.id}
                imageSrc={`/images/aigc/${art.prefix}.jpg`}
                title={getTitle(art.prefix)}
                summary={getTextSummary(art.prefix, 60)}
                isInteractive={isInteractive}
                hasText={hasText}
                onClick={() => onImageClick(idx)}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ════════════════════════ HoverZone ════════════════════════ */
/*
  玻璃层滑入动画:
  - id 为单数 → 从右侧滑入（right: 0），覆盖左侧约 2/3
  - id 为双数 → 从左侧滑入（left: 0），覆盖右侧约 2/3
  - 玻璃层与原始图片交界处用 mask-image 羽化过渡
  - 玻璃层渲染完成后（~0.55s），文字渐渐显示
*/

const GLASS_PANEL_WIDTH = "66%"; // 覆盖至画面约 2/3
const PANEL_DURATION = 0.55; // 玻璃层滑入动画时长（秒）
const TEXT_DELAY_MS = 580; // 玻璃层动画后延迟显示文字（毫秒）

function HoverZone({
  prefix,
  artId,
  imageSrc,
  title,
  summary,
  isInteractive,
  hasText,
  onClick,
}: {
  prefix: string;
  artId: number;
  imageSrc: string;
  title: string;
  summary: string;
  isInteractive: boolean;
  hasText: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(false);
  const textTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 单数 → 从右侧滑入；双数 → 从左侧滑入
  const fromRight = artId % 2 === 1; // 1, 3, 5... → right→left
  const panelVisible = isInteractive ? isHovered : true;

  // 当 panelVisible 变化时，控制文字显示时机
  useEffect(() => {
    if (panelVisible) {
      // 面板可见 → 延迟显示文字
      textTimerRef.current = setTimeout(() => {
        setShowText(true);
      }, TEXT_DELAY_MS);
    } else {
      // 面板隐藏 → 立即隐藏文字
      setShowText(false);
    }
    return () => {
      if (textTimerRef.current) {
        clearTimeout(textTimerRef.current);
        textTimerRef.current = null;
      }
    };
  }, [panelVisible]);

  // 羽化遮罩：交界处使用渐变实现自然过渡
  const maskStyle = fromRight
    ? {
        maskImage: "linear-gradient(to left, black 82%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to left, black 82%, transparent 100%)",
      }
    : {
        maskImage: "linear-gradient(to right, black 82%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, black 82%, transparent 100%)",
      };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      {/* 原始图片（始终显示） */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* 玻璃质感图层 */}
      <motion.div
        className="absolute inset-y-0 z-10 flex flex-col items-center justify-center overflow-hidden"
        style={{
          ...maskStyle,
          // 定位方向
          [fromRight ? "right" : "left"]: 0,
          // 玻璃质感
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderLeft: fromRight ? "1px solid rgba(255,255,255,0.15)" : "none",
          borderRight: !fromRight ? "1px solid rgba(255,255,255,0.15)" : "none",
        }}
        animate={{
          width: panelVisible ? GLASS_PANEL_WIDTH : "0%",
        }}
        transition={{
          duration: PANEL_DURATION,
          ease: [0.25, 0.1, 0.25, 1], // cubic-bezier ease-in-out
        }}
      >
        {/* 内层增加微光渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5 pointer-events-none" />

        {/* 文字内容（在玻璃层内部居中） */}
        <motion.div
          className="relative z-20 px-3 md:px-5 text-center"
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h4 className="text-sm md:text-base font-bold text-white drop-shadow-sm mb-1">
            {title}
          </h4>
          {hasText && (
            <p className="text-[11px] md:text-xs text-white/80 text-center leading-relaxed line-clamp-3 drop-shadow-sm">
              {summary}
            </p>
          )}
          {!hasText && (
            <p className="text-[11px] text-white/50 italic">暂无文字描述</p>
          )}
          {/* 装饰性小提示 */}
          <span className="inline-block mt-2 text-[9px] text-white/40 tracking-wider">
            ✦ 点击查看详情
          </span>
        </motion.div>
      </motion.div>
    </button>
  );
}
