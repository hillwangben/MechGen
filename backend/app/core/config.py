"""应用配置管理，从环境变量加载."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """应用配置，支持 .env 文件覆写."""

    # 应用
    app_name: str = "MechGen"
    debug: bool = False

    # 数据库
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/mechgen"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Celery
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    class Config:
        env_file = ".env"


settings = Settings()
