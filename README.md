# MechGen — 反无技战法生成模块

反无技战法生成模块提供从基础模型到场景化可用模型的智能化生产与演进生成能力，构建以智能体为驱动、以人机协作为交互模式、以模型进化为目标的闭环工作系统。

## 技术栈

### 前端
- **框架**: Vue 3 (Composition API + `<script setup>`)
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **图形/画布**: AntV X6
- **图表**: ECharts 5
- **语言**: TypeScript

### 后端
- **框架**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy 2.0
- **任务队列**: Celery + Redis
- **数据库**: PostgreSQL 15
- **缓存**: Redis
- **依赖管理**: uv

## 快速开始

### 本地开发

```bash
# 前端
cd frontend
npm install
npm run dev              # http://localhost:5173

# 后端
cd backend
uv sync
uv run uvicorn app.main:app --reload  # http://localhost:8000
```

### Docker 部署

```bash
docker compose up -d --build
```

## 项目结构

```
MechGen/
├── frontend/                    # Vue 3 前端
│   ├── src/
│   │   ├── api/                 # API 请求层
│   │   ├── assets/              # 静态资源
│   │   ├── components/          # 公共组件
│   │   ├── composables/         # 组合式函数
│   │   ├── mock/                # Mock 数据
│   │   ├── router/              # 路由配置
│   │   ├── stores/              # Pinia 状态管理
│   │   ├── types/               # TypeScript 类型
│   │   └── views/               # 页面视图
│   ├── Dockerfile
│   └── package.json
│
├── backend/                     # FastAPI 后端
│   ├── app/
│   │   ├── api/                 # API 路由
│   │   ├── core/                # 核心配置
│   │   ├── models/              # SQLAlchemy 模型
│   │   ├── schemas/             # Pydantic 校验
│   │   ├── services/            # 业务逻辑
│   │   └── agents/              # 智能体实现
│   ├── Dockerfile
│   └── pyproject.toml
│
├── docs/                        # 设计文档
├── docker-compose.yml
└── README.md
```

## 功能模块

- **统一工作空间** — 模型画布 + 问答面板的协同工作界面
- **模型训练工作台** — 训练配置、进度跟踪、超参数调优
- **模型评估仪表盘** — 指标看板、对比分析、报告生成
- **模型资产管理** — 模型检索、分类、版本管理

## 设计规范

详见 [CLAUDE.md](./CLAUDE.md) 和 [设计文档](./docs/superpowers/specs/2026-04-28-antidrone-tactics-design.md)
