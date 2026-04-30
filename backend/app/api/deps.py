"""FastAPI 依赖注入：提供 DB 会话、当前用户等公共依赖."""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.core.config import settings

engine = create_async_engine(settings.database_url, echo=settings.debug)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """提供异步数据库会话的依赖."""
    async with async_session() as session:
        yield session
