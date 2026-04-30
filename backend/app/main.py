"""MechGen 后端服务入口."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import tasks, models, collision


@asynccontextmanager
async def lifespan(app: FastAPI):
    """管理应用生命周期：启动时初始化资源，关闭时清理."""
    # TODO: 初始化数据库连接池、Redis、Celery 等
    yield
    # TODO: 关闭资源


app = FastAPI(
    title="MechGen API",
    description="反无技战法生成模块 - 后端服务",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(models.router, prefix="/api/v1")
app.include_router(collision.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """健康检查端点."""
    return {"status": "ok"}
