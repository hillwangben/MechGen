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
│   │   │       ├── variables.scss     # 科技风主题变量
│   │   │       ├── global.scss        # 全局样式
│   │   │       └── mixins.scss        # 样式混入
│   │   ├── components/          # 公共组件
│   │   │   ├── layout/          # 布局组件
│   │   │   │   ├── AppLayout.vue
│   │   │   │   ├── SideNav.vue
│   │   │   │   └── TopBar.vue
│   │   │   ├── canvas/          # 画布相关组件
│   │   │   │   ├── ModelCanvas.vue
│   │   │   │   ├── NodePanel.vue
│   │   │   │   └── PipelineEdge.vue
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
│   │   │   ├── workspace/       # 统一工作空间 (画布 + 问答面板)
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
│   │   │   │   ├── tasks.py
│   │   │   │   ├── models.py
│   │   │   │   ├── collision.py
│   │   │   │   └── agents.py
│   │   │   └── deps.py          # 依赖注入
│   │   ├── core/                # 核心配置
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── events.py        # 事件总线
│   │   ├── models/              # SQLAlchemy 模型
│   │   │   ├── task.py
│   │   │   ├── asset.py
│   │   │   └── rule.py
│   │   ├── schemas/             # Pydantic 校验
│   │   │   ├── task.py
│   │   │   ├── model.py
│   │   │   └── collision.py
│   │   ├── services/            # 业务逻辑
│   │   │   ├── agent_engine.py       # 智能体协同引擎
│   │   │   ├── model_service.py      # 模型资产管理
│   │   │   ├── collision_service.py  # 模型碰撞服务
│   │   │   └── task_orchestrator.py  # 任务编排
│   │   ├── agents/              # 智能体实现
│   │   │   ├── orchestrator.py       # 模型优化统筹
│   │   │   ├── retrieval.py          # 模型检索问答
│   │   │   ├── optimizer.py          # 模型优化智能体集
│   │   │   └── collision.py          # 模型碰撞统筹
│   │   ├── workers/             # Celery 异步任务
│   │   │   ├── training.py
│   │   │   └── inference.py
│   │   └── main.py              # 应用入口
│   ├── alembic/                 # 数据库迁移
│   ├── tests/
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── alembic.ini
│
├── docker-compose.yml           # 本地开发编排
├── docs/                        # 设计文档
└── README.md
```

## 布局方式

### 统一工作空间 (主界面)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TopBar (48px)                                         任务ID │ 保存 │ 用户  │
├──────────┬─────────────────┬───────────────────────┬────────────────────────┤
│ SideNav  │ 模型组件面板     │    模型画布 (中央)      │   问答面板 (380px)     │
│ (60px)   │ (240px)         │   - 决策树流程布局       │   - 自然语言交互       │
│ 图标模式  │ - 分类树形列表   │   - 模型→优化→碰撞→生成  │   - 状态查询           │
│          │ - 基础模型       │   - ●圆形模型嵌入框架   │   - 参数调整           │
│          │ - 场景模型       │   - 点击框架跳转工作台  │   - 确认门禁           │
│          │ - 组合模型       │                      │   (SSE/WS 流式)        │
│          │ - 操作节点       │   (AntV X6 画布)      │                       │
├──────────┴─────────────────┴───────────────────────┴────────────────────────┤
│ 状态栏 (32px)                               阶段指示器 │ 进度 │ 引擎状态     │
└──────────────────────────────────────────────────────────────────────────────┘
```
- 四栏布局：侧边导航(60px) + 模型组件面板(240px) + 画布区域(自适应) + 问答面板(380px)
- 模型组件面板支持拖拽到画布创建节点
- **画布布局 — 决策树流程结构**：
  - 自上而下的决策树结构，不体现内部架构分层
  - 模型为圆形节点（直径60px），直接嵌入优化框/碰撞框内部，框之间用直线连接
  - 业务流程：优化框(内含原始模型) ─→ 碰撞框(内含优化产物) ─→ 碰撞新模型（优化产物仅在碰撞框内体现，不重复）
  - 节点类型区分：
    - 模型节点（圆形 ●）：蓝色实线=原始模型、橙色虚线=生成模型
    - 框架节点（虚线大容器）：紫色=优化框、红色=碰撞框，框内2列网格排列，尺寸按模型数动态计算
  - 点击框架节点可跳转对应工作台（优化/碰撞），操作记录与画布同源
  - 连线采用直线样式
  - 滚轮缩放 · 拖拽平移
- 画布与问答面板双向联动,通过 Pinia store 共享状态
- 支持面板折叠/展开

### 模型组件面板
- 分类展示可用模型和操作节点：
  - 基础模型 — 通用预训练模型
  - 场景模型 — 场景微调模型
  - 组合模型 — 碰撞产物模型
  - 操作节点 — 模型优化、模型碰撞、验证评估
- 支持拖拽到画布创建节点
- 分类可折叠/展开

### 独立全屏界面 (训练工作台 / 评估仪表盘)
- 顶栏 + 侧边导航保留,中央内容区全宽展示
- 训练工作台: 左侧配置面板 + 右侧实时日志/图表

## 主题样式 — 科技风

### 色彩系统
```scss
// 暗色基底 (主背景)
$bg-primary: #0a0e27;       // 深空蓝黑
$bg-secondary: #111633;     // 卡片/面板背景
$bg-tertiary: #1a1f3f;      // 悬浮态背景

// 科技蓝系 (主色调)
$tech-blue: #00d4ff;        // 高亮蓝 (强调 / 选中)
$tech-blue-dim: #006680;    // 弱化蓝 (边框 / 分割)
$tech-cyan: #00f0ff;        // 荧光青 (数据高亮)

// 功能色
$status-green: #00ff88;     // 成功/就绪
$status-orange: #ff8c00;    // 警告/进行中
$status-red: #ff3860;       // 错误/失败
$status-purple: #b366ff;    // 碰撞/特殊状态

// 文字色
$text-primary: #e0e6ff;     // 主文字
$text-secondary: #8890b5;   // 次要文字
$text-disabled: #4a5080;    // 禁用文字
```

### 视觉元素
- **背景**: 深色底 + 微妙的网格线 (`background-image` 重复的点阵图案),模拟雷达/HUD 界面
- **边框**: 1px 细线,默认 `$tech-blue-dim`,悬浮时 `$tech-blue`,转角处有发光角标效果
- **卡片/面板**: 半透明深色背景 (`rgba(17,22,51,0.85)`) + backdrop-filter 模糊
- **文字**: 等宽/科技感字体栈 — `"JetBrains Mono", "Fira Code", "Courier New", monospace`
- **按钮**: 直角切角 (clip-path 或 border 模拟),悬浮时外发光 (box-shadow)
- **数据展示**: 数字使用 LED/数码管风格字体
- **动画**: 节点连线流动效果 (stroke-dasharray 动画),状态脉冲光点,面板滑动过渡 200ms ease

### Element Plus 覆写
- 全局覆写 Element Plus 的 CSS 变量以匹配科技风
- 按钮 `border-radius: 2px`,去除圆角
- 输入框暗色背景 + 荧光边框
- 表格暗色条纹行,悬浮行高亮

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
docker compose up -d --build   # 一键启动全部服务
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

## 可嵌入性
- 核心引擎以 `pip install mechgen-engine` 提供 Python SDK
- 前端组件可作为 Web Component 嵌入外部平台
- 服务间通过 REST API / gRPC 通信,支持独立部署

 
 ## 说明
 目前项目处于原型阶段，为了便于快速演示，暂不考虑后端动态接口服务，所有交互数据均采用 mock 方案模拟。