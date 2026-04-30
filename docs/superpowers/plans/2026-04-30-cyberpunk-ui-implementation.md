# 赛博朋克风格界面优化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 MechGen 前端界面升级为赛博朋克 2077 风格，标题/标签使用宋体，增强霓虹发光效果。

**Architecture:** 在现有 SCSS 样式系统基础上，新增霓虹色变量和宋体字体栈，通过 mixin 封装霓虹效果，覆写 Element Plus 组件样式，最后更新各组件引用。

**Tech Stack:** Vue 3, SCSS, Element Plus

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `variables.scss` | 定义霓虹色、宋体字体、增强阴影变量 |
| `mixins.scss` | 封装霓虹边框、按钮、故障动画等复用样式 |
| `global.scss` | 覆写 Element Plus 组件的赛博朋克样式 |
| `SideNav.vue` | 侧边导航应用宋体和霓虹效果 |
| `TopBar.vue` | 顶栏标题应用宋体样式 |
| `NodePanel.vue` | 模型组件面板应用宋体和霓虹效果 |
| `ChatPanel.vue` | 问答面板应用宋体和霓虹效果 |

---

## Task 1: 更新变量文件 (variables.scss)

**Files:**
- Modify: `frontend/src/assets/styles/variables.scss`

- [ ] **Step 1: 新增霓虹色变量**

在 `variables.scss` 文件的 `// ========== 科技蓝系` 部分之后，新增霓虹色变量：

```scss
// ========== 霓虹色系统（赛博朋克风格）==========
// 主霓虹色 - 青色系
$neon-cyan: #00ffff;        // 纯青色（比$tech-blue更亮）
$neon-cyan-dim: #00a8b5;    // 弱化青色

// 辅助霓虹色
$neon-magenta: #ff00ff;     // 品红（警告/强调）
$neon-yellow: #f0ff00;      // 荧光黄（数据高亮）
$neon-gold: #ffd700;        // 金色（特殊标识）
```

- [ ] **Step 2: 更新功能色增强霓虹感**

修改 `// ========== 功能色` 部分：

```scss
// ========== 功能色 ==========
$status-green: #00ff88;     // 成功 - 增强霓虹感
$status-orange: #ff6600;    // 警告 - 更鲜艳的橙色
$status-red: #ff0044;       // 错误 - 霓虹红
$status-purple: #cc00ff;    // 碰撞 - 霓虹紫
```

- [ ] **Step 3: 新增宋体字体变量**

修改 `// ========== 字体` 部分：

```scss
// ========== 字体 ==========
// 宋体字体栈 - 用于标题/标签
$font-serif: "SimSun", "宋体", "Songti SC", "Noto Serif CJK SC", serif;

// 等宽字体栈 - 用于数据/代码
$font-mono: "JetBrains Mono", "Fira Code", "Courier New", monospace;

// 无衬线字体栈 - 用于正文
$font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
            "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;

// 字号层级
$font-size-xs: 12px;    // 辅助信息
$font-size-sm: 13px;    // 标签、按钮
$font-size-base: 14px;  // 正文
$font-size-md: 16px;    // 小标题
$font-size-lg: 18px;    // 卡片标题
$font-size-xl: 22px;    // 页面标题
```

- [ ] **Step 4: 增强阴影/发光变量**

修改 `// ========== 阴影` 部分：

```scss
// ========== 阴影 ==========
$shadow-glow: 0 0 15px rgba(0, 255, 255, 0.4);
$shadow-glow-strong: 0 0 30px rgba(0, 255, 255, 0.6);
$shadow-neon-magenta: 0 0 15px rgba(255, 0, 255, 0.4);
$shadow-neon-yellow: 0 0 15px rgba(240, 255, 0, 0.4);
```

- [ ] **Step 5: 提交变量更新**

```bash
git add frontend/src/assets/styles/variables.scss
git commit -m "feat(styles): 添加霓虹色和宋体字体变量

- 新增 $neon-cyan, $neon-magenta, $neon-yellow 等霓虹色
- 新增 $font-serif 宋体字体栈
- 增强 $shadow-glow 发光效果
- 更新功能色为霓虹风格

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2: 新增霓虹效果 Mixins (mixins.scss)

**Files:**
- Modify: `frontend/src/assets/styles/mixins.scss`

- [ ] **Step 1: 新增霓虹边框 mixin**

在 `mixins.scss` 文件末尾添加：

```scss
// ========== 霓虹边框效果 ==========
// 普通边框发光
@mixin neon-border($color: $neon-cyan) {
  border: 1px solid $color;
  box-shadow:
    0 0 8px rgba($color, 0.3),
    inset 0 0 8px rgba($color, 0.1);
}

// 强发光边框（用于激活状态）
@mixin neon-border-strong($color: $neon-cyan) {
  border: 1px solid $color;
  box-shadow:
    0 0 15px rgba($color, 0.5),
    0 0 30px rgba($color, 0.2),
    inset 0 0 10px rgba($color, 0.15);
}
```

- [ ] **Step 2: 新增霓虹按钮 mixin**

```scss
// ========== 霓虹按钮效果 ==========
@mixin neon-button($color: $neon-cyan) {
  font-family: $font-serif;
  background: transparent;
  border: 1px solid $color;
  color: $color;
  text-shadow: 0 0 8px rgba($color, 0.6);
  box-shadow:
    0 0 10px rgba($color, 0.3),
    inset 0 0 10px rgba($color, 0.1);

  &:hover {
    background: rgba($color, 0.15);
    box-shadow:
      0 0 20px rgba($color, 0.5),
      0 0 40px rgba($color, 0.2),
      inset 0 0 15px rgba($color, 0.2);
  }

  &:active {
    background: rgba($color, 0.25);
  }
}
```

- [ ] **Step 3: 新增故障闪烁动画 mixin**

```scss
// ========== 故障闪烁动画 ==========
@mixin glitch-hover {
  &:hover {
    animation: glitch 0.3s ease;
  }

  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 1px); }
    40% { transform: translate(2px, -1px); }
    60% { transform: translate(-1px, -1px); }
    80% { transform: translate(1px, 1px); }
  }
}
```

- [ ] **Step 4: 新增扫描线效果 mixin**

```scss
// ========== 扫描线效果（可选） ==========
@mixin scanline-overlay {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.1) 2px,
      rgba(0, 0, 0, 0.1) 4px
    );
    pointer-events: none;
    z-index: 1;
  }
}
```

- [ ] **Step 5: 新增霓虹文字效果 mixin**

```scss
// ========== 霓虹文字效果 ==========
@mixin neon-text($color: $neon-cyan) {
  color: $color;
  text-shadow: 0 0 8px rgba($color, 0.6);
}
```

- [ ] **Step 6: 提交 mixins 更新**

```bash
git add frontend/src/assets/styles/mixins.scss
git commit -m "feat(styles): 添加霓虹效果 mixins

- 新增 neon-border 和 neon-border-strong 边框效果
- 新增 neon-button 按钮效果
- 新增 glitch-hover 故障动画
- 新增 scanline-overlay 扫描线效果
- 新增 neon-text 文字发光效果

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: 更新全局样式和组件覆写 (global.scss)

**Files:**
- Modify: `frontend/src/assets/styles/global.scss`

- [ ] **Step 1: 更新 CSS 变量**

修改 `:root` 部分，添加霓虹色变量：

```scss
// ========== CSS 变量 (供 Element Plus 覆写) ==========
:root {
  // 背景
  --el-bg-color: #{$bg-secondary};
  --el-bg-color-overlay: #{$bg-tertiary};
  --el-bg-color-page: #{$bg-primary};

  // 文字
  --el-text-color-primary: #{$text-primary};
  --el-text-color-regular: #{$text-secondary};
  --el-text-color-disabled: #{$text-disabled};

  // 边框
  --el-border-color: #{$border-color};
  --el-border-color-light: #{$neon-cyan-dim};
  --el-border-radius-base: 0;  // 直角更符合赛博朋克

  // 主题色
  --el-color-primary: #{$neon-cyan};
  --el-color-primary-light-3: #{lighten($neon-cyan, 15%)};
  --el-color-primary-light-5: #{lighten($neon-cyan, 25%)};
  --el-color-primary-dark-2: #{darken($neon-cyan, 15%)};

  // 功能色
  --el-color-success: #{$status-green};
  --el-color-warning: #{$neon-magenta};
  --el-color-danger: #{$status-red};

  // 字体
  --font-serif: #{$font-serif};
  --font-mono: #{$font-mono};
  --font-sans: #{$font-sans};
}
```

- [ ] **Step 2: 更新背景网格**

修改 `.bg-grid` 样式：

```scss
// ========== 网格线背景 ==========
.bg-grid {
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 25px 25px;
}
```

- [ ] **Step 3: 更新按钮组件覆写**

修改 Element Plus 按钮覆写：

```scss
// ========== Element Plus 覆写 ==========

// 按钮
.el-button {
  font-family: $font-serif;
  border-radius: 0;  // 直角
  transition: all $transition-fast;

  &--primary {
    @include neon-button($neon-cyan);
  }

  &--success {
    @include neon-button($status-green);
  }

  &--warning {
    @include neon-button($neon-magenta);
  }

  &--danger {
    @include neon-button($status-red);
  }

  &--default {
    font-family: $font-serif;
    background: transparent;
    border: 1px solid $border-color;
    color: $text-primary;

    &:hover,
    &:focus {
      border-color: $neon-cyan;
      color: $neon-cyan;
      box-shadow: 0 0 10px rgba($neon-cyan, 0.3);
    }
  }
}
```

- [ ] **Step 4: 更新输入框组件覆写**

```scss
// 输入框
.el-input {
  &__wrapper {
    background-color: rgba(0, 20, 40, 0.6);
    border: 1px solid $neon-cyan-dim;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
    border-radius: 0;

    &:hover,
    &.is-focus {
      border-color: $neon-cyan;
      box-shadow:
        0 0 15px rgba($neon-cyan, 0.3),
        inset 0 0 10px rgba(0, 0, 0, 0.3);
    }
  }

  &__inner {
    font-family: $font-sans;
    color: $text-primary;

    &::placeholder {
      color: $text-disabled;
    }
  }
}

// 文本域
.el-textarea {
  &__inner {
    font-family: $font-sans;
    background-color: rgba(0, 20, 40, 0.6);
    border: 1px solid $neon-cyan-dim;
    border-radius: 0;
    color: $text-primary;

    &:focus {
      border-color: $neon-cyan;
      box-shadow: 0 0 15px rgba($neon-cyan, 0.3);
    }
  }
}
```

- [ ] **Step 5: 更新表格组件覆写**

```scss
// 表格
.el-table {
  background-color: transparent;
  color: $text-primary;

  th.el-table__cell {
    font-family: $font-serif;
    background-color: rgba(0, 168, 181, 0.15);
    color: $neon-cyan;
    text-shadow: 0 0 5px rgba($neon-cyan, 0.4);
    border-bottom-color: $border-color;
  }

  td.el-table__cell {
    font-family: $font-sans;
    border-bottom-color: rgba($border-color, 0.5);
  }

  tr {
    background-color: transparent;

    &:hover > td.el-table__cell {
      background-color: $bg-tertiary;
    }
  }

  &__row--striped td.el-table__cell {
    background-color: rgba($bg-tertiary, 0.5);
  }
}
```

- [ ] **Step 6: 更新卡片组件覆写**

```scss
// 卡片
.el-card {
  background: $bg-overlay;
  @include neon-border($neon-cyan-dim);
  backdrop-filter: blur(12px);
  transition: all $transition-fast;

  &:hover {
    @include neon-border($neon-cyan);
  }

  &__header {
    font-family: $font-serif;
    font-size: $font-size-lg;
    @include neon-text($neon-cyan);
    border-bottom: 1px solid $border-color;
    padding: $spacing-md;
  }

  &__body {
    font-family: $font-sans;
  }
}
```

- [ ] **Step 7: 更新对话框组件覆写**

```scss
// 对话框
.el-dialog {
  background-color: $bg-secondary;
  border: 1px solid $neon-cyan-dim;
  @include neon-border($neon-cyan-dim);
  border-radius: 0;

  &__header {
    font-family: $font-serif;
    border-bottom: 1px solid $border-color;
  }

  &__title {
    @include neon-text($neon-cyan);
  }

  &__body {
    font-family: $font-sans;
  }
}
```

- [ ] **Step 8: 更新消息提示组件覆写**

```scss
// 消息提示
.el-message {
  background-color: $bg-secondary;
  border: 1px solid $neon-cyan-dim;
  border-radius: 0;
  @include neon-border($neon-cyan-dim);
}

// 通知
.el-notification {
  background-color: $bg-secondary;
  border: 1px solid $neon-cyan-dim;
  border-radius: 0;
}
```

- [ ] **Step 9: 更新标签组件覆写**

```scss
// 标签
.el-tag {
  font-family: $font-serif;
  border-radius: 0;  // 直角

  &--success {
    background: rgba($status-green, 0.15);
    border-color: $status-green;
    color: $status-green;
    text-shadow: 0 0 8px rgba($status-green, 0.5);
  }

  &--warning {
    background: rgba($neon-magenta, 0.15);
    border-color: $neon-magenta;
    color: $neon-magenta;
    text-shadow: 0 0 8px rgba($neon-magenta, 0.5);
  }

  &--danger {
    background: rgba($status-red, 0.15);
    border-color: $status-red;
    color: $status-red;
    text-shadow: 0 0 8px rgba($status-red, 0.5);
  }

  &--info {
    background: rgba($neon-cyan, 0.15);
    border-color: $neon-cyan-dim;
    color: $neon-cyan;
    text-shadow: 0 0 8px rgba($neon-cyan, 0.5);
  }
}
```

- [ ] **Step 10: 更新下拉菜单组件覆写**

```scss
// 下拉菜单
.el-dropdown-menu {
  background-color: $bg-secondary;
  border: 1px solid $neon-cyan-dim;
  border-radius: 0;
  @include neon-border($neon-cyan-dim);

  &__item {
    font-family: $font-sans;
    color: $text-primary;

    &:hover {
      background-color: $bg-tertiary;
      color: $neon-cyan;
    }
  }
}
```

- [ ] **Step 11: 提交全局样式更新**

```bash
git add frontend/src/assets/styles/global.scss
git commit -m "feat(styles): 更新全局样式和 Element Plus 组件覆写

- 更新 CSS 变量为霓虹色
- 按钮应用霓虹效果 mixin
- 输入框增强发光效果
- 表格表头应用宋体和霓虹文字
- 卡片应用霓虹边框
- 标签改为直角设计并应用发光效果
- 对话框和消息提示应用霓虹风格

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: 更新侧边导航组件 (SideNav.vue)

**Files:**
- Modify: `frontend/src/components/layout/SideNav.vue`

- [ ] **Step 1: 更新样式部分**

替换 `<style>` 部分的样式：

```scss
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.sidenav {
  @include flex-column;
  justify-content: space-between;
  height: 100%;
  background: $bg-secondary;
  border-right: 1px solid $border-color;

  &__menu {
    @include flex-column;
    align-items: center;
    padding-top: $spacing-md;
    gap: $spacing-xs;
  }

  &__footer {
    @include flex-column;
    align-items: center;
    padding-bottom: $spacing-md;
  }

  &__item {
    @include flex-center;
    width: 44px;
    height: 44px;
    color: $text-secondary;
    border-radius: 0;
    cursor: pointer;
    transition: all $transition-fast;
    position: relative;

    &:hover {
      color: $neon-cyan;
      background: rgba($neon-cyan, 0.1);
    }

    &.is-active {
      color: $neon-cyan;
      background: rgba($neon-cyan, 0.15);
      text-shadow: 0 0 10px rgba($neon-cyan, 0.6);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: $neon-cyan;
        border-radius: 0 2px 2px 0;
        box-shadow: 0 0 15px rgba($neon-cyan, 0.8);
      }
    }
  }
}
</style>
```

- [ ] **Step 2: 提交组件更新**

```bash
git add frontend/src/components/layout/SideNav.vue
git commit -m "feat(SideNav): 应用霓虹效果和宋体样式

- 导航项激活状态应用霓虹发光
- 左侧指示条增强发光效果
- 使用 $neon-cyan 替代 $tech-blue

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: 更新顶栏组件 (TopBar.vue)

**Files:**
- Modify: `frontend/src/components/layout/TopBar.vue`

- [ ] **Step 1: 更新样式部分**

替换 `<style>` 部分的样式：

```scss
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.topbar {
  @include flex-between;
  height: $topbar-height;
  padding: 0 $spacing-md;
  background: $bg-secondary;
  border-bottom: 1px solid $border-color;

  &__left {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__logo {
    @include flex-center;
    width: 36px;
    height: 36px;
    color: $neon-cyan;
    background: rgba($neon-cyan, 0.1);
    border-radius: 0;
    border: 1px solid $neon-cyan-dim;
  }

  &__title {
    font-family: $font-serif;
    font-size: $font-size-md;
    font-weight: 600;
    @include neon-text($neon-cyan);
  }

  &__center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  &__task {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-family: $font-mono;
    font-size: $font-size-sm;
  }

  &__task-label {
    color: $text-secondary;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    padding: $spacing-xs $spacing-sm;
    border-radius: 0;
    transition: background $transition-fast;

    &:hover {
      background: $bg-tertiary;
    }
  }

  &__avatar {
    background: rgba($neon-cyan, 0.2);
    color: $neon-cyan;
  }

  &__username {
    font-family: $font-serif;
    font-size: $font-size-sm;
    color: $text-primary;
  }
}
</style>
```

- [ ] **Step 2: 提交组件更新**

```bash
git add frontend/src/components/layout/TopBar.vue
git commit -m "feat(TopBar): 应用宋体标题和霓虹效果

- 标题使用宋体字体栈
- 标题应用霓虹发光效果
- Logo 图标应用霓虹边框
- 用户名使用宋体

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6: 更新模型组件面板 (NodePanel.vue)

**Files:**
- Modify: `frontend/src/components/canvas/NodePanel.vue`

- [ ] **Step 1: 更新样式部分**

替换 `<style>` 部分的样式：

```scss
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.node-panel {
  @include flex-column;
  width: 240px;
  height: 100%;
  background: $bg-secondary;
  border-right: 1px solid $border-color;

  // 头部
  &__header {
    @include flex-between;
    height: 48px;
    padding: 0 $spacing-md;
    border-bottom: 1px solid $border-color;
    font-family: $font-serif;
    font-size: $font-size-base;
    @include neon-text($neon-cyan);

    .el-icon {
      color: $neon-cyan;
    }

    > :last-child {
      margin-left: $spacing-sm;
    }
  }

  // 内容区
  &__content {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-sm;
  }

  // 分类
  &__category {
    margin-bottom: $spacing-xs;
  }

  &__category-header {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm;
    color: $text-secondary;
    font-family: $font-serif;
    font-size: $font-size-xs;
    font-weight: 500;
    cursor: pointer;
    border-radius: 0;
    transition: all $transition-fast;

    &:hover {
      background: $bg-tertiary;
      color: $text-primary;
    }

    > :nth-child(2) {
      color: $neon-cyan;
    }
  }

  &__category-count {
    margin-left: auto;
    padding: 2px 6px;
    font-family: $font-mono;
    font-size: 10px;
    background: $bg-tertiary;
    border-radius: 0;
    color: $neon-yellow;
    border: 1px solid $neon-cyan-dim;
  }

  // 节点列表
  &__nodes {
    padding-left: $spacing-md;
  }

  &__node {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-sm;
    margin-bottom: 2px;
    border-radius: 0;
    cursor: grab;
    transition: all $transition-fast;

    &:hover {
      background: $bg-tertiary;
      @include neon-border($neon-cyan-dim);

      .node-panel__node-drag {
        opacity: 1;
      }
    }

    &:active {
      cursor: grabbing;
      transform: scale(0.98);
    }
  }

  &__node-icon {
    @include flex-center;
    width: 28px;
    height: 28px;
    border: 1px solid;
    border-radius: 0;
    background: rgba($bg-primary, 0.5);
    flex-shrink: 0;
  }

  &__node-name {
    flex: 1;
    font-family: $font-serif;
    font-size: $font-size-xs;
    color: $text-primary;
    @include ellipsis;
  }

  &__node-drag {
    opacity: 0;
    color: $text-disabled;
    transition: opacity $transition-fast;
  }

  // 底部
  &__footer {
    @include flex-center;
    gap: $spacing-xs;
    padding: $spacing-sm;
    border-top: 1px solid $border-color;
    font-family: $font-serif;
    font-size: 11px;
    color: $text-disabled;
  }
}
</style>
```

- [ ] **Step 2: 提交组件更新**

```bash
git add frontend/src/components/canvas/NodePanel.vue
git commit -m "feat(NodePanel): 应用宋体和霓虹效果

- 面板标题使用宋体和霓虹发光
- 分类标题使用宋体
- 节点名称使用宋体
- 计数标签使用等宽字体和霓虹黄
- 悬浮时应用霓虹边框效果

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: 更新问答面板组件 (ChatPanel.vue)

**Files:**
- Modify: `frontend/src/components/canvas/ChatPanel.vue`

- [ ] **Step 1: 更新样式部分**

替换 `<style>` 部分的样式：

```scss
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.chat-panel {
  @include flex-column;
  height: 100%;
  background: $bg-secondary;

  // 头部
  &__header {
    @include flex-between;
    height: 48px;
    padding: 0 $spacing-md;
    border-bottom: 1px solid $border-color;
    font-family: $font-serif;
    font-size: $font-size-base;
    @include neon-text($neon-cyan);

    .el-icon {
      color: $neon-cyan;
    }
  }

  // 消息列表
  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-md;
  }

  // 消息项
  &__message {
    display: flex;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    &.is-user {
      flex-direction: row-reverse;

      .chat-panel__message-content {
        align-items: flex-end;
      }

      .chat-panel__message-bubble {
        background: rgba($neon-cyan, 0.15);
        border: 1px solid rgba($neon-cyan, 0.3);
        @include neon-border($neon-cyan-dim);
      }
    }

    &.is-assistant {
      .chat-panel__message-bubble {
        background: $bg-tertiary;
        border: 1px solid $border-color;
      }
    }
  }

  &__message-avatar {
    flex-shrink: 0;

    .el-avatar {
      border-radius: 0;

      &.is-user {
        background: rgba($neon-cyan, 0.2);
        color: $neon-cyan;
        border: 1px solid $neon-cyan-dim;
      }

      &.is-assistant {
        background: rgba($status-purple, 0.2);
        color: $status-purple;
        border: 1px solid $status-purple;
      }
    }
  }

  &__message-content {
    @include flex-column;
    max-width: 80%;
  }

  &__message-bubble {
    padding: $spacing-sm $spacing-md;
    border-radius: 0;
    font-family: $font-sans;
    font-size: $font-size-sm;
    line-height: 1.6;
    color: $text-primary;

    &.is-loading {
      display: flex;
      gap: 4px;
      padding: $spacing-md;
    }
  }

  &__message-time {
    font-family: $font-mono;
    font-size: 11px;
    color: $text-disabled;
    margin-top: $spacing-xs;
  }

  // 加载动画
  &__loading-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: $neon-cyan;
    animation: loading 1.4s infinite both;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes loading {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  // 输入区域
  &__input {
    padding: $spacing-md;
    border-top: 1px solid $border-color;

    :deep(.el-textarea__inner) {
      font-family: $font-sans;
      background: rgba(0, 20, 40, 0.6);
      border: 1px solid $neon-cyan-dim;
      border-radius: 0;
      color: $text-primary;

      &:focus {
        border-color: $neon-cyan;
        box-shadow: 0 0 15px rgba($neon-cyan, 0.3);
      }

      &::placeholder {
        color: $text-disabled;
      }
    }
  }

  &__input-actions {
    @include flex-between;
    margin-top: $spacing-sm;
  }

  &__input-hint {
    font-family: $font-serif;
    font-size: 11px;
    color: $text-disabled;
  }
}
</style>
```

- [ ] **Step 2: 提交组件更新**

```bash
git add frontend/src/components/canvas/ChatPanel.vue
git commit -m "feat(ChatPanel): 应用宋体和霓虹效果

- 面板标题使用宋体和霓虹发光
- 用户消息气泡应用霓虹边框
- 时间戳使用等宽字体
- 头像改为直角设计
- 输入框应用霓虹发光聚焦效果

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 8: 验证和构建测试

**Files:**
- None (验证任务)

- [ ] **Step 1: 启动前端开发服务器**

```bash
cd /home/admin/code/MechGen/frontend && npm run dev
```

- [ ] **Step 2: 验证样式效果**

在浏览器中检查以下页面：
- `/workspace` - 统一工作空间，检查侧边导航、顶栏、模型面板、问答面板
- 验证宋体是否正确应用于标题和标签
- 验证霓虹发光效果是否正常显示
- 验证悬浮效果和动画是否流畅

- [ ] **Step 3: 运行 TypeScript 类型检查**

```bash
cd /home/admin/code/MechGen/frontend && npm run type-check
```

- [ ] **Step 4: 运行 ESLint 检查**

```bash
cd /home/admin/code/MechGen/frontend && npm run lint
```

- [ ] **Step 5: 构建生产版本**

```bash
cd /home/admin/code/MechGen/frontend && npm run build
```

- [ ] **Step 6: 提交最终验证**

```bash
git add -A
git commit -m "feat(styles): 完成赛博朋克风格界面优化

整体改动：
- 新增霓虹色系统 ($neon-cyan, $neon-magenta, $neon-yellow)
- 新增宋体字体栈用于标题和标签
- 增强边框发光和文字发光效果
- 更新所有 Element Plus 组件为赛博朋克风格
- 组件采用直角设计

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## 执行摘要

| Task | 文件 | 改动类型 |
|------|------|---------|
| 1 | `variables.scss` | 新增霓虹色、宋体变量 |
| 2 | `mixins.scss` | 新增霓虹效果 mixins |
| 3 | `global.scss` | 更新组件覆写样式 |
| 4 | `SideNav.vue` | 应用霓虹效果 |
| 5 | `TopBar.vue` | 应用宋体标题 |
| 6 | `NodePanel.vue` | 应用宋体和霓虹效果 |
| 7 | `ChatPanel.vue` | 应用宋体和霓虹效果 |
| 8 | - | 验证和构建测试 |
