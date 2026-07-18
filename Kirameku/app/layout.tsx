import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/vs2015.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { BackgroundProvider } from "@/components/providers/BackgroundProvider";
import { MusicProvider } from "@/components/providers/MusicProvider";
import { EffectProvider } from "@/components/providers/EffectProvider";
import BackgroundRenderer from "@/components/layout/BackgroundRenderer";
import Navbar from "@/components/layout/Navbar";
import ClientWidgets from "@/components/layout/ClientWidgets";
import ClickEffect from "@/components/ui/ClickEffect";
import RadialMenu from "@/components/ui/RadialMenu";
import MouseTrail from "@/components/ui/MouseTrail";
import SeasonalEffect from "@/components/ui/SeasonalEffect";
import KiraSparkle from "@/components/ui/KiraSparkle";
import WelcomeScreen from "@/components/layout/WelcomeScreen";
import VisitorTracker from "@/components/layout/VisitorTracker";
import { siteConfig } from "@/siteConfig";

// 字体配置：Geist Sans - 现代无衬线字体，用于主要文本
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 字体配置：Geist Mono - 等宽字体，用于代码显示
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 字体配置：Noto Serif SC - 思源宋体，用于中文内容显示
const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// 页面元数据配置
export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.bio,
  alternates: {
    types: {
      "application/rss+xml": "/feed",
    },
  },
};

// 根布局组件：提供全局样式、字体、主题和各类功能Provider
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifSC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Provider层级结构：ThemeProvider -> EffectProvider -> BackgroundProvider -> MusicProvider -> ToastProvider */}
        <ThemeProvider>
          {/* 效果提供器：管理全局视觉效果状态和切换 */}
          <EffectProvider>
            {/* 欢迎屏幕组件 */}
            <WelcomeScreen />
         
            <BackgroundProvider>
              
              <MusicProvider>
                <ToastProvider>
                  {/* 背景渲染器 */}
                  <BackgroundRenderer />
                  {/* 访客追踪组件 */}
                  <VisitorTracker />
                  {/* 视觉效果组件 */}
                  <ClickEffect />
                  <RadialMenu />
                  <MouseTrail />
                  <SeasonalEffect />
                  <KiraSparkle />
                  {/* 导航栏组件 */}
                  <Navbar />
                  {/* 主内容区域 */}
                  <main className="flex-1 pt-16">
                    {children}
                  </main>
                  {/* 客户端小部件 */}
                  <ClientWidgets />
                </ToastProvider>
              </MusicProvider>
            </BackgroundProvider>
          </EffectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
