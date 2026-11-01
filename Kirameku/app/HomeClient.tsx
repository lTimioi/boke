"use client"; // 声明这是一个客户端组件，需要在浏览器端运行

// 首页页面 和 首页客户端组件

import dynamic from "next/dynamic"; // 从 Next.js 导入动态导入功能，用于按需加载组件
import SearchBar from "@/components/ui/SearchBar"; // 导入搜索栏组件

import ProfileCard from "@/components/home/ProfileCard"; // 导入个人资料卡片组件
import FadeIn from "@/components/ui/FadeIn"; // 导入淡入动画组件
import ComponentLabel from "@/components/ui/ComponentLabel"; // 导入组件标签包装器，用于开发调试时显示组件信息
import TopORDown from "@/components/ui/topORdown"; // 导入滚动导航组件（顶部/中间/底部）

// 使用 dynamic 动态导入 CloudPlayer 组件，禁用服务端渲染(ssr: false)，因为音乐播放器需要浏览器 API
const CloudPlayer = dynamic(() => import("@/components/music/CloudPlayer"), { ssr: false });
// 动态导入歌词栏组件，同样禁用 SSR
const LyricBar = dynamic(() => import("@/components/music/LyricBar"), { ssr: false });
// 动态导入最新文章轮播组件
const LatestPostsCarousel = dynamic(() => import("@/components/home/LatestPostsCarousel"), { ssr: false });
// 动态导入最新说说轮播组件
const LatestChatterCarousel = dynamic(() => import("@/components/home/LatestChatterCarousel"), { ssr: false });

// 动态导入照片墙预览组件
const PhotoWallPreview = dynamic(() => import("@/components/home/PhotoWallPreview"), { ssr: false });
// 动态导入舔狗日记组件
const DogDiary = dynamic(() => import("@/components/home/DogDiary"), { ssr: false });
// 动态导入站点数据面板组件
const SiteDashboard = dynamic(() => import("@/components/widgets/SiteDashboard"), { ssr: false });

// 导出默认的 HomeClient 组件，接收 postCount(文章数)、chatterCount(说说数)、photoCount(照片数)三个 props
export default function HomeClient({
  postCount,
  chatterCount,
  photoCount,
}: {
  postCount: number; // 文章数量，number 类型
  chatterCount: number; // 说说数量，number 类型
  photoCount: number; // 照片数量，number 类型
}) {
  return (
    <>
      {/* 左侧悬浮滚动导航组件：固定在页面左侧，不随页面滚动 */}
      <TopORDown />
      {/* 主内容区域 */}
      {/* 书写主体框架，将组件加入进去
      // 外层容器：全宽、最大宽度 6xl、水平居中、垂直内边距、水平内边距、相对定位、z-index 10 */}
      <div className="w-full max-w-6xl mx-auto py-6 md:py-12 px-4 sm:px-10 relative z-10">
      {/* 搜索栏区域 在Kirameku\components\ui\SearchBar.tsx 书写好 这里进行调用*/}
      {/* 这里可以看成框架 ，用于包裹组件 */}
      <FadeIn> {/* 使用 FadeIn 组件包裹，实现淡入动画效果 */}
        {/* 在中等屏幕及以上显示，小屏幕隐藏 */}
        <div className="hidden md:block">
          {/* ComponentLabel 用于开发时显示组件信息，包含组件名、文件路径、描述 */}
          <ComponentLabel
            name="SearchBar" // 组件名称
            file="components/ui/SearchBar.tsx" // 组件文件路径
            description="搜索栏组件，支持全局搜索文章、说说等内容" // 组件功能描述
          >
            <SearchBar /> {/* 实际的搜索栏组件 */}
          </ComponentLabel>
        </div>
      </FadeIn>
      
      {/* 主要内容区域，使用 flex 布局，垂直排列，设置间距 */}
      <main className="flex flex-col gap-4 md:gap-6 w-full">
        {/* 第一行：个人信息卡片 + 音乐播放器 */}
        <FadeIn delay={0.1}> {/* 延迟 0.1 秒执行淡入动画 */}
          {/* 网格布局：小屏幕单列，中等屏幕 12 列 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full items-stretch">
            {/* 个人信息卡片区域，中等屏幕占 8 列 */}
            <div className="md:col-span-8 flex w-full">
              {/* 组件导入 */}
              <ComponentLabel
                name="ProfileCard"
                file="components/home/ProfileCard.tsx"
                // 使用模板字符串动态插入数据到描述中
                description={`博主信息卡片，显示头像、昵称、简介。数据：文章数=${postCount}，说说数=${chatterCount}，照片数=${photoCount}（来自 page.tsx 服务端获取）`}
              >
                {/* 传递统计数据给 ProfileCard 组件 */}
                <ProfileCard
                  postCount={postCount}
                  chatterCount={chatterCount}
                  photoCount={photoCount}
                />
              </ComponentLabel>
            </div>
            {/* 音乐播放器区域，中等屏幕占 4 列 */}
            <div className="md:col-span-4 flex w-full">
              <ComponentLabel
                name="CloudPlayer"
                file="components/music/CloudPlayer.tsx"
                description="云音乐播放器，支持播放/暂停、切歌、音量控制"
              >
                <CloudPlayer />
              </ComponentLabel>
            </div>
          </div>
        </FadeIn>
        
        {/* 歌词栏区域 */}
        <FadeIn delay={0.15}> {/* 延迟 0.15 秒执行淡入动画 */}
          <div className="w-full">
            <ComponentLabel
              name="LyricBar"
              file="components/music/LyricBar.tsx"
     
              description="歌词显示条，实时显示当前播放歌曲的歌词"
            >
              <LyricBar />
            </ComponentLabel>
          </div>
        </FadeIn>


        {/* 第二行：照片墙 + 文章 + 说说 + 舔狗日记 */}
        <FadeIn delay={0.2}> {/* 延迟 0.2 秒执行淡入动画 */}
          {/* 外层网格布局 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full items-stretch">
            {/* 照片墙预览区域，中等屏幕占 4 列，高度 100% */}
            <div className="md:col-span-4 h-full">
              <ComponentLabel
                name="PhotoWallPreview"
                file="components/home/PhotoWallPreview.tsx"
                description="照片墙预览，展示最新照片的缩略图网格"
              >
                <PhotoWallPreview />
              </ComponentLabel>
            </div>
            {/* 右侧区域：文章轮播 + 说说轮播 + 舔狗日记，中等屏幕占 8 列 */}
            <div className="md:col-span-8 flex flex-col gap-4 md:gap-6 h-full">
              {/* 最新文章轮播 */}
              <ComponentLabel
                name="LatestPostsCarousel"
                file="components/home/LatestPostsCarousel.tsx"
                description="最新文章轮播，展示最近发布的文章卡片"
              >
                <LatestPostsCarousel />
              </ComponentLabel>
              {/* 内部网格：说说轮播 + 舔狗日记 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1 md:min-h-[220px] items-stretch">
                {/* 最新说说轮播，中等屏幕占 8 列 */}
                <div className="md:col-span-8 h-full">
                  <ComponentLabel
                    name="LatestChatterCarousel"
                    file="components/home/LatestChatterCarousel.tsx"
                    description="最新说说轮播，展示最近的短动态内容"
                  >
                    <LatestChatterCarousel />
                  </ComponentLabel>
                </div>
                {/* 舔狗日记，中等屏幕占 4 列，高度 100%，flex 布局 */}
                <div className="md:col-span-4 h-full flex">
                  <ComponentLabel
                    name="DogDiary"
                    file="components/home/DogDiary.tsx"
                    description="舔狗日记，趣味组件，随机展示舔狗语录"
                  >
                    <DogDiary />
                  </ComponentLabel>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 底部数据面板 */}
        <FadeIn delay={0.25}> {/* 延迟 0.25 秒执行淡入动画 */}
          <div className="w-full">
            <ComponentLabel
              name="SiteDashboard"
              file="components/widgets/SiteDashboard.tsx"
              description="站点数据面板，展示网站运行统计、访客数据等"
            >
              <SiteDashboard />
            </ComponentLabel>
          </div>
        </FadeIn>
      </main>
    </div>
    </>
  );
}
