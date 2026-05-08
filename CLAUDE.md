# MechGen — 反无技战法生成模块

## 项目概述
反无技战法生成模块提供从基础模型到场景化可用模型的智能化生产与演进生成能力，构建以智能体为驱动、以人机协作为交互模式、以模型进化为目标的闭环工作系统。

## 技术栈

### 前端
- **框架**: Vue 3 (Composition API + `<script setup>`)
- **构建工具**: Vite
- **UI 组件库**: Element Plus (按需引入)
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **图形/画布**: AntV X6 (拖拽管道编排、模型画布)
- **图表**: ECharts 5 (评估仪表盘)
- **语言**: TypeScript

### 后端
- **框架**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy 2.0 (async)
- **任务队列**: Celery + Redis
- **数据库**: PostgreSQL 15
- **缓存**: Redis
- **通信协议**: REST API + WebSocket (实时状态推送)
- **模型推理**: PyTorch / ONNX Runtime
- **依赖管理**: uv

### 部署
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx

## 核心依赖

### 前端 (`package.json`)
```json
{
  "vue": "^3.4",
  "vue-router": "^4.3",
  "pinia": "^2.1",
  "element-plus": "^2.7",
  "axios": "^1.7",
  "@antv/x6": "^2.0",
  "@antv/x6-vue-shape": "^2.0",
  "echarts": "^5.5",
  "vue-echarts": "^6.6"
}
```

### 后端 (`pyproject.toml`)
```toml
[project]
dependencies = [
    "fastapi>=0.111",
    "uvicorn[standard]>=0.30",
    "sqlalchemy>=2.0",
    "asyncpg>=0.29",
    "redis>=5.0",
    "celery>=5.4",
    "pydantic>=2.7",
    "websockets>=12.0",
    "httpx>=0.27",
    "pydantic-settings>=2.3",
]
```

## 项目目录结构

```
MechGen/
├── frontend/                    # Vue 3 前端
│   ├── src/
│   │   ├── api/                 # API 请求层 (按模块拆分)
│   │   │   ├── tasks.ts
│   │   │   ├── models.ts
│   │   │   └── collision.ts
│   │   ├── assets/              # 静态资源 (图标、科技风背景图)
│   │   │   ├── images/
│   │   │   └── styles/
│   │   │       ├── variables.scss     # 赛博朋克主题变量
│   │   │       ├── global.scss        # 全局样式 + Element Plus 覆写
│   │   │       └── mixins.scss        # 霓虹/HUD 样式混入
│   │   ├── components/          # 公共组件
│   │   │   ├── layout/          # 布局组件
│   │   │   │   ├── AppLayout.vue
│   │   │   │   ├── SideNav.vue
│   │   │   │   └── TopBar.vue
│   │   │   ├── canvas/          # 画布相关组件
│   │   │   │   ├── ModelCanvas.vue
│   │   │   │   ├── NodePanel.vue
│   │   │   │   └── ChatPanel.vue
│   │   │   └── common/          # 通用组件
│   │   │       ├── StatusBadge.vue
│   │   │       ├── ConfirmDialog.vue
│   │   │       └── ProgressOverlay.vue
│   │   ├── composables/         # 组合式函数
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useTaskStatus.ts
│   │   │   └── useTheme.ts
│   │   ├── router/              # 路由配置
│   │   │   └── index.ts
│   │   ├── stores/              # Pinia 状态管理
│   │   │   ├── task.ts
│   │   │   ├── model.ts
│   │   │   └── user.ts
│   │   ├── views/               # 页面视图
│   │   │   ├── workspace/       # 统一工作空间
│   │   │   ├── training/        # 模型训练工作台
│   │   │   ├── evaluation/      # 模型评估仪表盘
│   │   │   └── assets/          # 模型资产管理
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # FastAPI 后端
│   ├── app/
│   │   ├── api/                 # API 路由
│   │   │   ├── v1/
│   │   │   └── deps.py
│   │   ├── core/                # 核心配置
│   │   ├── models/              # SQLAlchemy 模型
│   │   ├── schemas/             # Pydantic 校验
│   │   ├── services/            # 业务逻辑
│   │   ├── agents/              # 智能体实现
│   │   ├── workers/             # Celery 异步任务
│   │   └── main.py
│   ├── alembic/
│   ├── tests/
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── alembic.ini
│
├── docker-compose.yml
├── docs/
└── README.md
```

## 开发规范

### 通用
- **代码风格**: 遵循 ESLint (前端) / Ruff (后端) 配置,提交前自动格式化
- **命名规范**:
  - Vue 组件: PascalCase (`ModelCanvas.vue`)
  - TypeScript 文件/函数: camelCase (`useTaskStatus.ts`)
  - Python 文件/函数: snake_case (`agent_engine.py`)
  - Python 类: PascalCase
  - 常量: UPPER_SNAKE_CASE
- **注释**: 中文注释,解释"为什么"而非"是什么"
- **Git 提交**: 遵循 Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`)

### 前端
- 使用 `<script setup lang="ts">` 统一写法
- 组件拆分原则: 单个组件不超过 300 行,复杂逻辑抽离为 composables
- API 请求统一在 `api/` 目录封装,组件不直接调用 axios
- 类型定义统一放在 `src/types/` 目录

### 后端
- API 路由: 版本化前缀 `/api/v1/`,RESTful 风格
- 服务层: 业务逻辑集中在 `services/`,路由层只做参数校验和响应格式化
- 智能体: 每个智能体独立模块,通过事件总线通信,遵循统一消息协议
- 数据库: 所有表包含 `id`, `created_at`, `updated_at` 字段

## 构建与运行

### 本地开发
```bash
# 前端
cd frontend
npm install
npm run dev              # Vite 开发服务器,默认 :5173

# 后端
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload  # 默认 :8000

# 启动依赖服务 (Redis / PostgreSQL)
docker compose up -d redis postgres
```

### Docker 部署
```bash
docker compose up -d --build
```

### 前端构建
```bash
cd frontend
npm run build            # 生产构建 → dist/
npm run preview          # 预览生产构建
npm run lint             # ESLint 检查
npm run type-check       # TypeScript 类型检查
```

### 后端测试
```bash
cd backend
uv run pytest -v
```

## 需求规范
项目需求文档位于 `doc/需求文档/`，需求和规范细则参见 [需求规范说明](doc/需求文档/需求规范说明.md)。
讨论功能时优先加载对应需求文档；文档与代码冲突时以代码为准。

## 说明
目前项目处于原型阶段，为了便于快速演示，暂不考虑后端动态接口服务，所有交互数据均采用 mock 方案模拟。
