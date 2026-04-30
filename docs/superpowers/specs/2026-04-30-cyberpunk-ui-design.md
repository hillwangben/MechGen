# 赛博朋克风格界面优化设计文档

## 概述

本文档描述 MechGen 反无技战法生成模块的前端界面优化方案，将现有科技风主题升级为赛博朋克 2077 风格，并引入宋体字体作为标题和标签的显示字体。

## 设计目标

1. **风格升级**：在现有科技风基础上叠加赛博朋克元素，增强霓虹发光效果
2. **字体优化**：标题和标签使用宋体，打造东西方美学融合的独特风格
3. **视觉增强**：提升边框发光强度，添加故障艺术效果
4. **兼容性**：所有改动向后兼容，不影响现有功能

## 色彩系统

### 主背景色（保持不变）

```scss
$bg-primary: #0a0e27;       // 深空蓝黑
$bg-secondary: #111633;     // 卡片/面板背景
$bg-tertiary: #1a1f3f;      // 悬浮态背景
$bg-overlay: rgba(17, 22, 51, 0.85);  // 半透明背景
```

### 霓虹色系统（新增）

```scss
// 主霓虹色 - 青色系
$neon-cyan: #00ffff;        // 纯青色（比现有$tech-blue更亮）
$neon-cyan-dim: #00a8b5;    // 弱化青色

// 辅助霓虹色
$neon-magenta: #ff00ff;     // 品红（警告/强调）
$neon-yellow: #f0ff00;      // 荧光黄（数据高亮）
$neon-gold: #ffd700;        // 金色（特殊标识）
```

### 功能色（增强发光感）

```scss
$status-green: #00ff88;     // 成功 - 增强霓虹感
$status-orange: #ff6600;    // 警告 - 更鲜艳的橙色
$status-red: #ff0044;       // 错误 - 霓虹红
$status-purple: #cc00ff;    // 碰撞 - 霓虹紫
```

### 阴影/发光（增强强度）

```scss
$shadow-glow: 0 0 15px rgba(0, 255, 255, 0.4);
$shadow-glow-strong: 0 0 30px rgba(0, 255, 255, 0.6);
$shadow-neon-magenta: 0 0 15px rgba(255, 0, 255, 0.4);
$shadow-neon-yellow: 0 0 15px rgba(240, 255, 0, 0.4);
```

## 字体系统

### 字体定义

```scss
// 宋体字体栈 - 用于标题/标签
$font-serif: "SimSun", "宋体", "Songti SC", "Noto Serif CJK SC", serif;

// 等宽字体栈 - 用于数据/代码
$font-mono: "JetBrains Mono", "Fira Code", "Courier New", monospace;

// 无衬线字体栈 - 用于正文
$font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
            "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
```

### 字体应用规则

| 元素类型 | 字体 | 说明 |
|---------|------|------|
| 页面标题 | 宋体 | 如"统一工作空间" |
| 卡片/面板标题 | 宋体 | 如"模型组件面板" |
| 表格表头 | 宋体 | 列标题 |
| 状态标签 | 宋体 | 如"运行中"、"已完成" |
| 按钮文字 | 宋体 | 操作按钮 |
| 数字数据 | 等宽字体 | 如进度百分比、ID |
| 代码/路径 | 等宽字体 | 文件路径、命令 |
| 正文描述 | 无衬线字体 | 普通说明文字 |

### 字号层级

```scss
$font-size-xs: 12px;    // 辅助信息
$font-size-sm: 13px;    // 标签、按钮
$font-size-base: 14px;  // 正文
$font-size-md: 16px;    // 小标题
$font-size-lg: 18px;    // 卡片标题
$font-size-xl: 22px;    // 页面标题
```

## 视觉元素

### 霓虹边框效果

```scss
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

### 霓虹按钮效果

```scss
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
}
```

### 故障闪烁动画

```scss
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

### 扫描线效果（可选）

```scss
@mixin scanline-overlay {
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
  }
}
```

### 背景网格增强

```scss
.bg-grid {
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 25px 25px;
}
```

## 组件样式覆写

### 按钮

- 主按钮：霓虹青色边框 + 发光效果
- 警告按钮：霓虹品红边框 + 发光效果
- 成功按钮：霓虹绿边框 + 发光效果
- 默认按钮：透明背景 + 悬浮时霓虹边框

### 输入框

- 背景：半透明深色
- 边框：弱化青色，聚焦时霓虹发光
- 内阴影：增强深度感

### 卡片

- 背景：毛玻璃效果
- 边框：霓虹边框，悬浮增强发光
- 标题：宋体 + 霓虹青色 + 文字发光

### 表格

- 表头：宋体 + 霓虹青色 + 文字发光
- 数据行：无衬线字体
- 数字数据：等宽字体 + 荧光黄高亮

### 标签

- 直角设计（去除圆角）
- 背景半透明
- 文字发光效果

### 导航项

- 激活状态：霓虹青色 + 文字发光
- 左侧指示条：发光效果增强

## 文件改动清单

| 文件路径 | 改动内容 |
|---------|---------|
| `src/assets/styles/variables.scss` | 新增霓虹色变量、字体变量、阴影变量 |
| `src/assets/styles/mixins.scss` | 新增霓虹边框、霓虹按钮、故障动画等mixin |
| `src/assets/styles/global.scss` | 更新Element Plus组件覆写样式 |
| `src/components/layout/SideNav.vue` | 应用宋体和霓虹效果 |
| `src/components/layout/TopBar.vue` | 应用宋体标题样式 |
| `src/components/canvas/NodePanel.vue` | 面板标题宋体+霓虹效果 |
| `src/components/canvas/ChatPanel.vue` | 对话面板样式更新 |

## 兼容性说明

- 所有改动向后兼容，不影响现有布局
- 新变量命名遵循现有规范（`$neon-cyan` 对应 `$tech-blue`）
- 组件覆写在现有基础上增强，不破坏原有功能
- 字体降级策略：宋体不可用时使用系统衬线字体

## 预期效果

1. 整体视觉更具赛博朋克风格的霓虹发光感
2. 宋体标题与传统科技风形成独特东西方美学融合
3. 交互反馈更明显（发光、动画）
4. 保持现有布局和功能不变
