// 欢迎屏（进入即播放动画，结束后自动跳回首页）
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/siteConfig";

// 获取时间问候
function getTimeGreeting() {
  const now = new Date();
  const h = now.getHours();
  const period = h < 6 ? "凌晨" : h < 9 ? "早上" : h < 12 ? "上午" : h < 14 ? "中午" : h < 18 ? "下午" : "晚上";
  const hour = h <= 12 ? h : h - 12;
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const min = now.getMinutes();
  return `${now.getFullYear()}年${m}月${d}日${period}${hour}点${min > 0 ? min + "分" : ""}，很高兴与你相遇`;
}

// 欢迎屏组件
export default function WelcomeScreen() {
  const router = useRouter();
  // 每次进入本页都显示欢迎动画
  const [show, setShow] = useState(true);

  useEffect(() => {
    // 跳回首页的时间
    const timer = setTimeout(() => setShow(false), 600000);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 动效编写
    <AnimatePresence onExitComplete={() => router.push("/")}>
      {show && (

        // 欢迎屏容器
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          // transition  动画过度效果
          // opacity 初始状态 1
          // 动画状态 1
          // 退出状态 0
          // 退出动画 0.8s easeInOut
          initial={{ opacity: 1 }}
          // 
          animate={{ opacity: 1, pointerEvents: "auto" }}
          // pointerEvents 
          exit={{ opacity: 0, pointerEvents: "none" }}
          //  duration: 0.8 持续时间   ease: "easeInOut"  动作速度曲线  easeInOut easeIn easeOut
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >


          {/* 背景 */}
          <motion.div
            className="absolute inset-0 bg-slate-950"
            // scale          
            exit={{ scale: 1.2 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          {/* 背景模糊 */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${siteConfig.bgImages[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
            }}
            // 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 1.2 }}
          />

          {/* 内容 */}
          <div className="relative z-10 text-center px-6">
            {/* 欢迎来到 */}
            <motion.p
              className="text-lg md:text-xl text-slate-400 mb-4 tracking-[0.3em]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              欢迎来到
            </motion.p>

            {/* 站名 */}
            <motion.div
              className="flex items-center justify-center space-x-1 mb-4"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
            >
              <span
                className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                {siteConfig.authorName}
              </span>
              <span
                className="text-4xl md:text-5xl font-bold text-sky-400"
                style={{ fontFamily: "serif" }}
              >
                の
              </span>
              <span
                className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                小站
              </span>
            </motion.div>

            {/* 时间问候 */}
            <motion.p
              className="text-sm md:text-base text-slate-500 tracking-wider"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              {getTimeGreeting()}
            </motion.p>

            {/* 装饰线 */}
            <motion.div
              className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 160, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}