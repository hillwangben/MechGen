<script setup lang="ts">
// 顶栏组件 — 赛博朋克HUD顶栏
import { ref } from 'vue'

const currentTaskId = ref('TASK-2024-001')
const saving = ref(false)

const handleSave = () => {
  saving.value = true
  setTimeout(() => { saving.value = false }, 1000)
}
</script>

<template>
  <header class="topbar">
    <!-- 左侧：Logo + 标题 -->
    <div class="topbar__left">
      <div class="topbar__logo">
        <el-icon :size="26"><Monitor /></el-icon>
      </div>
      <div class="topbar__brand">
        <h1 class="topbar__title">反无技战法生成模块</h1>
        <span class="topbar__subtitle">ANTI-DRONE TACTICS GENERATOR</span>
      </div>
    </div>

    <!-- 中间：任务信息 -->
    <div class="topbar__center">
      <div class="topbar__task">
        <span class="topbar__task-bracket">[</span>
        <span class="topbar__task-id">{{ currentTaskId }}</span>
        <span class="topbar__task-bracket">]</span>
      </div>
    </div>

    <!-- 右侧：操作 + 用户 -->
    <div class="topbar__right">
      <el-button type="primary" size="default" :loading="saving" @click="handleSave">
        <el-icon :size="18"><Download /></el-icon>
        <span>保存</span>
      </el-button>

      <el-dropdown trigger="click">
        <div class="topbar__user">
          <el-avatar :size="34" class="topbar__avatar">
            <el-icon :size="20"><User /></el-icon>
          </el-avatar>
          <span class="topbar__username">分析师</span>
          <el-icon :size="12" class="topbar__user-arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.topbar {
  @include flex-between;
  height: $topbar-height;
  padding: 0 $spacing-lg;
  background: $bg-secondary;
  border-bottom: 1px solid $neon-cyan-dim;
  position: relative;

  // 底部发光分割线
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      $neon-cyan 10%,
      transparent 50%,
      $neon-cyan 90%,
      transparent 100%
    );
    box-shadow: 0 0 10px rgba($neon-cyan, 0.5);
  }

  // ===== 左侧 =====
  &__left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  // Logo 容器 — 发光斜切方框
  &__logo {
    @include flex-center;
    width: 40px;
    height: 40px;
    color: $neon-cyan;
    background: rgba($neon-cyan, 0.08);
    border: 2px solid $neon-cyan;
    box-shadow:
      0 0 14px rgba($neon-cyan, 0.5),
      0 0 30px rgba($neon-cyan, 0.2),
      inset 0 0 12px rgba($neon-cyan, 0.1);
    clip-path: polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%);
    animation: logo-pulse 3s ease-in-out infinite;
  }

  @keyframes logo-pulse {
    0%, 100% {
      box-shadow: 0 0 14px rgba($neon-cyan, 0.5), 0 0 30px rgba($neon-cyan, 0.2), inset 0 0 12px rgba($neon-cyan, 0.1);
    }
    50% {
      box-shadow: 0 0 22px rgba($neon-cyan, 0.7), 0 0 45px rgba($neon-cyan, 0.35), inset 0 0 20px rgba($neon-cyan, 0.2);
    }
  }

  // 品牌区
  &__brand {
    @include flex-column;
    gap: 0;
  }

  &__title {
    font-family: $font-serif;
    font-size: 20px;
    font-weight: 700;
    @include neon-text($neon-cyan);
    letter-spacing: 0.1em;
    line-height: 1.2;
  }

  &__subtitle {
    font-family: $font-mono;
    font-size: 9px;
    color: $neon-cyan-dim;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  // ===== 中间 =====
  &__center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  &__task {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 4px 16px;
    border: 1px solid rgba($neon-yellow-dim, 0.4);
    background: rgba($neon-yellow, 0.04);
  }

  &__task-bracket {
    font-family: $font-mono;
    font-size: 18px;
    color: $neon-yellow-dim;
    text-shadow: 0 0 6px rgba($neon-yellow, 0.3);
  }

  &__task-id {
    @include hud-readout($neon-yellow);
    font-size: 15px;
    font-weight: 600;
    padding: 0 8px;
    letter-spacing: 0.1em;
  }

  // ===== 右侧 =====
  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    padding: $spacing-xs $spacing-sm;
    transition: background $transition-fast;

    &:hover {
      background: rgba($neon-cyan, 0.06);
    }
  }

  &__avatar {
    background: rgba($neon-cyan, 0.15);
    color: $neon-cyan;
    border: 2px solid $neon-cyan-dim;
    box-shadow: 0 0 10px rgba($neon-cyan, 0.3);
  }

  &__username {
    font-family: $font-serif;
    font-size: 15px;
    color: $text-primary;
    letter-spacing: 0.05em;
  }

  &__user-arrow {
    color: $text-dim;
    margin-left: -2px;
  }
}
</style>
