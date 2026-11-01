"""公共依赖 — 统一从这里导入 get_session / get_current_user"""
# 数据库会话依赖
from app.database import get_session
# 认证依赖
from app.utils.auth import get_current_user
# 导出依赖
__all__ = ["get_session", "get_current_user"]
