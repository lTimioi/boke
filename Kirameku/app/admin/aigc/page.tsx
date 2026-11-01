"use client";

import { useState, useEffect, useRef } from "react";
// 导入路由模块
import { useRouter } from "next/navigation";
import {
  getAigcPhotos,
  saveAigcPhotos,
  uploadAigcImage,
  type AigcPhoto,
} from "@/app/api/aigc-photos";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Upload,
  ImageIcon,
  FileText,
  Sparkles,
  LogIn,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

/* ────────── 消息提示 ────────── */
interface Toast {
  type: "success" | "error" | "info";
  text: string;
  id: number;
}

/* ────────── 主页面 ────────── */
export default function AdminAigcPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<AigcPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 添加表单
  const [addTitle, setAddTitle] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addFile, setAddFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = (type: Toast["type"], text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { type, text, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // ── 登录检测 ──
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isLoggedIn = !!token;

  // ── 加载数据 ──
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    getAigcPhotos()
      .then(setPhotos)
      .catch(() => toast("error", "加载数据失败"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 保存 ──
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAigcPhotos(photos);
      toast("success", "保存成功！刷新前台幻绘页面即可看到变化");
    } catch {
      toast("error", "保存失败，请确认已登录且有管理员权限");
    } finally {
      setSaving(false);
    }
  };

  // ── 添加照片 ──
  const handleAdd = async () => {
    if (!addTitle.trim()) {
      toast("error", "请输入图片标题");
      return;
    }
    let url = addImageUrl.trim();

    // 如果有上传文件，先上传
    if (addFile) {
      setUploading(true);
      try {
        url = await uploadAigcImage(addFile);
      } catch {
        toast("error", "图片上传失败");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (!url) {
      toast("error", "请输入图片 URL 或上传图片");
      return;
    }

    const maxId = photos.length > 0 ? Math.max(...photos.map((p) => p.id)) : 0;
    const newPhoto: AigcPhoto = {
      id: maxId + 1,
      title: addTitle.trim(),
      description: addDescription.trim(),
      imageUrl: url,
      sort: photos.length + 1,
    };
    setPhotos((prev) => [...prev, newPhoto]);
    setAddTitle("");
    setAddDescription("");
    setAddImageUrl("");
    setAddFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast("success", "已添加，点击「保存到数据库」生效");
  };

  // ── 删除 ──
  const handleDelete = (id: number) => {
    if (!confirm("确定删除这张照片？")) return;
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      return filtered.map((p, i) => ({ ...p, sort: i + 1 }));
    });
    toast("info", "已删除，点击「保存到数据库」生效");
  };

  // ── 排序 ──
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setPhotos((prev) => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr.map((p, i) => ({ ...p, sort: i + 1 }));
    });
  };
  const moveDown = (idx: number) => {
    setPhotos((prev) => {
      if (idx >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.map((p, i) => ({ ...p, sort: i + 1 }));
    });
  };

  // ── 编辑 description ──
  const updateDesc = (id: number, description: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, description } : p))
    );
  };

  // ── 未登录界面 ──
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-400">
        加载中...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-12 border border-slate-200/50 shadow-lg">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            需要管理员登录
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            请先使用管理员账号登录后才能管理 AIGC 照片
          </p>
          <button
            onClick={() => router.push("/Login")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-sky-500/20 transition-all"
          >
            <LogIn className="w-5 h-5" />
            前往登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* ── Toast ── */}
      <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium backdrop-blur-md border transition-all ${
              t.type === "success"
                ? "bg-emerald-500/90 text-white border-emerald-400/50"
                : t.type === "error"
                  ? "bg-red-500/90 text-white border-red-400/50"
                  : "bg-sky-500/90 text-white border-sky-400/50"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {t.text}
          </div>
        ))}
      </div>

      {/* ── 页头 ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
              AIGC 照片管理
            </h1>
            <p className="text-xs text-slate-400">管理幻绘页面的所有照片</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "保存中..." : "保存到数据库"}
        </button>
      </div>

      {/* ── 添加表单 ── */}
      <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-sky-500/20 shadow-lg p-4 md:p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-sky-500" />
          添加新照片
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 标题 */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">标题 *</label>
            <input
              type="text"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              placeholder="如：山海幻境"
              className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          {/* 图片 URL 或上传 */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">图片</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={addImageUrl}
                onChange={(e) => setAddImageUrl(e.target.value)}
                placeholder="图片 URL（或点击上传）"
                className="flex-1 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setAddFile(f);
                    setAddImageUrl("");
                    toast("info", `已选择: ${f.name}`);
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-2 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-800/60 transition-all"
                title="上传图片"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            {addFile && (
              <p className="text-[10px] text-emerald-500 mt-1">
                已选择: {addFile.name}
              </p>
            )}
          </div>
        </div>
        {/* 描述 */}
        <div className="mt-3">
          <label className="block text-xs text-slate-400 mb-1">
            文字描述（支持 Markdown）
          </label>
          <textarea
            value={addDescription}
            onChange={(e) => setAddDescription(e.target.value)}
            placeholder={"## 标题\n\n正文内容...\n\n> 引用语"}
            rows={4}
            className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 font-mono"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={uploading}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <>上传中...</>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              添加
            </>
          )}
        </button>
      </div>

      {/* ── 照片列表 ── */}
      <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-sky-500/20 shadow-lg overflow-hidden">
        <div className="px-4 md:px-6 py-3 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            照片列表
            <span className="text-xs text-slate-400 font-normal">
              （共 {photos.length} 张）
            </span>
          </h2>
          <span className="text-[10px] text-slate-400">
            拖动按钮调整顺序 • 点击编辑描述
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            暂无照片，请在上方添加
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="flex items-start gap-3 md:gap-4 p-3 md:p-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {/* 排序按钮 */}
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="w-6 h-5 rounded flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx >= photos.length - 1}
                    className="w-6 h-5 rounded flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 缩略图 */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                    #{photo.sort} {photo.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate mb-1">
                    {photo.imageUrl}
                  </p>
                  {editingId === photo.id ? (
                    <textarea
                      value={photo.description}
                      onChange={(e) => updateDesc(photo.id, e.target.value)}
                      rows={3}
                      className="w-full text-[11px] px-2 py-1.5 rounded-lg bg-white/80 dark:bg-slate-700/80 border border-sky-300 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 font-mono"
                      onBlur={() => setEditingId(null)}
                    />
                  ) : (
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setEditingId(photo.id)}
                    >
                      <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <p className="text-[11px] text-slate-400 truncate">
                        {photo.description
                          ? photo.description.slice(0, 60) + "..."
                          : "点击添加描述"}
                      </p>
                    </div>
                  )}
                </div>

                {/* 删除 */}
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all flex-shrink-0"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 已保存数据预览 ── */}
      <details className="mt-4">
        <summary className="text-xs text-slate-400 cursor-pointer hover:text-sky-500">
          查看当前 JSON 数据（调试用）
        </summary>
        <pre className="mt-2 p-3 rounded-xl bg-slate-900/80 text-[10px] text-green-400 overflow-x-auto max-h-60">
          {JSON.stringify(photos, null, 2)}
        </pre>
      </details>
    </div>
  );
}
