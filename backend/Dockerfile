# 基于 uv 官方镜像实现依赖安装和运行
FROM ghcr.io/astral-sh/uv:python3.11-bookworm AS build

WORKDIR /app

# 先复制依赖元数据，利用缓存加速
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

# 复制应用代码
COPY app/ ./app/

# 运行阶段
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim

WORKDIR /app

COPY --from=build /app /app

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
