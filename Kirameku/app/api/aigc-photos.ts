import { request } from "./client";

/** 单张 AIGC 照片的数据结构 */
export interface AigcPhoto {
  id: number;
  /** 图片 URL（可以是本地 /images/aigc/ 或 OSS URL 或 /uploads/aigc/） */
  imageUrl: string;
  /** 图片标题（如"山海幻境"） */
  title: string;
  /** 对应的 Markdown 文字描述（完整.md内容） */
  description: string;
  /** 排序序号 */
  sort: number;
}

/** 默认种子数据（与现有硬编码保持一致） */
const DEFAULT_PHOTOS: AigcPhoto[] = [
  {
    id: 1,
    title: "山海幻境",
    imageUrl: "/images/aigc/2.jpg",
    description: "## 山海幻境\n\n云海翻涌之间，群山若隐若现。在这片由算法编织的梦境中，现实与幻想的边界逐渐消融。\n\n每一缕光，都是数据的低语；每一片雾，都是像素的呼吸。\n\n> 当代码遇见艺术，便有了灵魂。",
    sort: 1,
  },
  {
    id: 2,
    title: "星夜流光",
    imageUrl: "/images/aigc/3.jpg",
    description: "## 星夜流光\n\n星河倒悬于苍穹之上，流光溢彩间，宇宙的奥秘在眼前徐徐展开。\n\n在这片被光污染遗忘的角落，星星不再是遥远的光点，而是触手可及的梦境。\n\n> 仰望星空时，我们都在寻找自己的坐标。",
    sort: 2,
  },
  {
    id: 3,
    title: "花语秘境",
    imageUrl: "/images/aigc/4.jpg",
    description: "## 花语秘境\n\n一座被时光遗忘的花园，每一朵花都在诉说着自己的故事。\n\n花瓣上的露珠折射出七彩光芒，像是被遗落的彩虹碎片。微风拂过，花香与数据流交织成一首无声的诗。\n\n> 每一朵花，都是一个未完成的梦。",
    sort: 3,
  },
  {
    id: 4,
    title: "机械心跳",
    imageUrl: "/images/aigc/5.jpg",
    description: "## 机械心跳\n\n在钢铁与琉璃构筑的世界里，机械之心缓缓跳动。\n\n齿轮咬合，蒸汽升腾，每一个零件都闪耀着金属的光泽。这是人类智慧与算法美学的完美交融。\n\n> 当机械拥有了心跳，它便不再是冰冷的工具。",
    sort: 4,
  },
];

/** 读取 AIGC 照片列表，如果后端不存在则返回默认数据并自动初始化 */
export async function getAigcPhotos(): Promise<AigcPhoto[]> {
  try {
    // 尝试读取 site_config 中的 aigc_photos
    const res = await fetch("/api/site-config/aigc_photos");
    if (res.ok) {
      const data = await res.json();
      // site_config 的 get_config 返回的是 JSON 解析后的值
      if (data && Array.isArray(data)) {
        return data;
      }
    }
  } catch {
    // 网络错误时返回默认
  }
  return DEFAULT_PHOTOS;
}

/** 获取带 token 的请求头 */
function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 保存 AIGC 照片列表（需要管理员认证） */
export async function saveAigcPhotos(photos: AigcPhoto[]): Promise<void> {
  // 使用 batch_update：PUT /api/site-config
  // body 格式为 {"aigc_photos": JSON.stringify(photos)}
  const body: Record<string, string> = {
    aigc_photos: JSON.stringify(photos),
  };
  await request("/api/site-config", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: authHeaders(),
  });
}

/** 上传图片到后端本地存储，返回图片 URL */
export async function uploadAigcImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("/api/upload/local", {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`上传失败: ${res.status}`);
  }
  const data = await res.json();
  return data.url;
}
