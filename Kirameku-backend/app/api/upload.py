# 上传接口
import uuid
from io import BytesIO
from pathlib import Path

import oss2
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from PIL import Image

from app.deps import get_current_user
from app.config import (
    OSS_ACCESS_KEY_ID,
    OSS_ACCESS_KEY_SECRET,
    OSS_BUCKET_NAME,
    OSS_ENDPOINT,
    OSS_CUSTOM_DOMAIN,
    OSS_PREFIX,
    oss_is_configured,
)
# 上传路由
router = APIRouter(prefix="/api/upload", tags=["上传"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_SIZE = 10 * 1024 * 1024  # 10MB

# 本地存储目录
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
LOCAL_IMAGE_DIR = UPLOAD_DIR / "images"  # 通用图片（文章封面、相册照片）
AIGC_UPLOAD_DIR = UPLOAD_DIR / "aigc"  # AIGC 专用图片


def _get_bucket():
    auth = oss2.Auth(OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET)
    return oss2.Bucket(auth, OSS_ENDPOINT, OSS_BUCKET_NAME)

# 图片方向检测
def _detect_orientation(content: bytes) -> str:
    try:
        img = Image.open(BytesIO(content))
        w, h = img.size
        return "landscape" if w >= h else "portrait"
    except Exception:
        return "landscape"

# 本地图片保存
def _save_local(content: bytes, filename: str, subdir: Path) -> str:
    """保存图片到本地 uploads/<subdir>/，返回可访问的 URL 路径"""
    ext = filename.split(".")[-1] if filename and "." in filename else "webp"
    name = f"{uuid.uuid4().hex}.{ext}"
    subdir.mkdir(parents=True, exist_ok=True)
    (subdir / name).write_bytes(content)
    return f"/uploads/{subdir.name}/{name}"

# 图片上传接口上传到OSS
@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"不支持的文件类型: {file.content_type}")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(400, "文件大小不能超过 10MB")

    orientation = _detect_orientation(content)

    # OSS 未配置真实凭据时，回退到本地存储
    if not oss_is_configured():
        url = _save_local(content, file.filename or "image.jpg", LOCAL_IMAGE_DIR)
        return {"url": url, "orientation": orientation}

    # 上传到 OSS
    ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "webp"
    filename = f"{uuid.uuid4().hex}.{ext}"
    oss_key = f"{OSS_PREFIX}{filename}"

    bucket = _get_bucket()
    bucket.put_object(oss_key, content)

    url = f"{OSS_CUSTOM_DOMAIN}/{oss_key}"
    return {"url": url, "orientation": orientation}

# 本地图片上传接口
@router.post("/local")
async def upload_image_local(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"不支持的文件类型: {file.content_type}")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(400, "文件大小不能超过 10MB")

    url = _save_local(content, file.filename or "image.webp", AIGC_UPLOAD_DIR)
    return {"url": url}
