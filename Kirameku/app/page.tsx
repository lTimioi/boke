// 导入客户端组件 HomeClient
import HomeClient from "./HomeClient";

// 定义 API 基础地址，优先从环境变量获取，否则使用本地开发地址
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * 获取首页统计数据
 * 并行请求文章数、短动态数和相册数据
 * 使用 Next.js 的 ISR 重新验证机制，每 60 秒更新缓存
 */
async function fetchProfileData() {
  try {
    // 使用 Promise.all 并行发起三个请求，提高性能
    const [postsRes, chattersRes, albums] = await Promise.all([
      // 获取已发布文章数量
      fetch(`${API}/api/posts/count?status=published`, { next: { revalidate: 60 } }).then((r) => r.json()),
      // 获取已发布短动态数量
      fetch(`${API}/api/chatters/count?status=published`, { next: { revalidate: 60 } }).then((r) => r.json()),
      // 获取相册列表
      fetch(`${API}/api/albums`, { next: { revalidate: 60 } }).then((r) => r.json()),
    ]);
    return {
      postCount: postsRes.count ?? 0,        // 文章数，默认为 0
      chatterCount: chattersRes.count ?? 0,  // 短动态数，默认为 0
      // 计算总照片数：遍历所有相册累加 photo_count
      photoCount: Array.isArray(albums)
        ? albums.reduce((acc: number, a: { photo_count?: number }) => acc + (a.photo_count ?? 0), 0)
        : 0,
    };
  } catch {
    // 请求失败时返回默认值
    return { postCount: 0, chatterCount: 0, photoCount: 0 };
  }
}

/**
 * 首页服务端组件
 * 在服务端获取数据，然后传递给客户端组件渲染
 */
export default async function Home() {
  const { postCount, chatterCount, photoCount } = await fetchProfileData();

  return (
    <HomeClient
      postCount={postCount}
      chatterCount={chatterCount}
      photoCount={photoCount}
    />
  );
}
