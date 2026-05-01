<script setup lang="ts">
// 侧边导航组件 — 赛博朋克风格
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const navItems = [
  { path: '/workspace',  icon: 'Monitor',  title: '统一工作空间' },
  { path: '/training',   icon: 'Cpu',       title: '模型训练工作台' },
  { path: '/evaluation', icon: 'DataLine',  title: '模型评估仪表盘' },
  { path: '/assets',     icon: 'Files',     title: '模型资产管理' },
]

const activeRoute = computed(() => route.path)

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <nav class="sidenav">
    <div class="sidenav__menu">
      <div
        v-for="item in navItems"
        :key="item.path"
        class="sidenav__item"
        :class="{ 'is-active': activeRoute === item.path }"
        :title="item.title"
        @click="navigateTo(item.path)"
      >
        <!-- 激活态外发光环 -->
        <span v-if="activeRoute === item.path" class="sidenav__glow-ring"></span>
        <div class="sidenav__item-inner">
          <el-icon :size="26">
            <component :is="item.icon" />
          </el-icon>
        </div>
        <!-- 激活态指示线 -->
        <span v-if="activeRoute === item.path" class="sidenav__active-bar"></span>
      </div>
    </div>

    <!-- 底部 -->
    <div class="sidenav__footer">
      <div class="sidenav__item" title="设置">
        <div class="sidenav__item-inner">
          <el-icon :size="26"><Setting /></el-icon>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.sidenav {
  @include flex-column;
  justify-content: space-between;
  height: 100%;
  background: $bg-secondary;
  border-right: 1px solid $neon-cyan-dim;
  position: relative;
  width: $sidenav-width;

  // 右侧发光分割线
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -1px;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba($neon-cyan, 0.6) 20%,
      rgba($neon-cyan, 0.6) 80%,
      transparent 100%
    );
    box-shadow: 0 0 8px rgba($neon-cyan, 0.4);
  }

  &__menu {
    @include flex-column;
    align-items: center;
    padding-top: $spacing-md;
    gap: 6px;
  }

  &__footer {
    @include flex-column;
    align-items: center;
    padding-bottom: $spacing-md;
  }

  &__item {
    @include flex-center;
    width: 48px;
    height: 48px;
    color: $text-dim;
    cursor: pointer;
    transition: all $transition-fast;
    position: relative;

    &:hover {
      color: $neon-cyan;

      .sidenav__item-inner {
        text-shadow: 0 0 16px rgba($neon-cyan, 0.7);
        transform: scale(1.1);
      }
    }

    &.is-active {
      color: $neon-cyan;
      background: rgba($neon-cyan, 0.1);

      .sidenav__item-inner {
        text-shadow: 0 0 18px rgba($neon-cyan, 0.8), 0 0 36px rgba($neon-cyan, 0.4);
        transform: scale(1.15);
      }
    }
  }

  &__item-inner {
    @include flex-center;
    transition: all 200ms ease;
  }

  // 激活态发光环 — 围绕图标的外圈
  &__glow-ring {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 1px solid rgba($neon-cyan, 0.5);
    box-shadow:
      0 0 12px rgba($neon-cyan, 0.4),
      0 0 28px rgba($neon-cyan, 0.15),
      inset 0 0 8px rgba($neon-cyan, 0.08);
    animation: ring-pulse 2.5s ease-in-out infinite;
  }

  @keyframes ring-pulse {
    0%, 100% {
      border-color: rgba($neon-cyan, 0.4);
      box-shadow: 0 0 10px rgba($neon-cyan, 0.3), 0 0 20px rgba($neon-cyan, 0.1);
    }
    50% {
      border-color: rgba($neon-cyan, 0.8);
      box-shadow: 0 0 20px rgba($neon-cyan, 0.6), 0 0 40px rgba($neon-cyan, 0.25);
    }
  }

  // 激活态指示条
  &__active-bar {
    position: absolute;
    right: -1px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 28px;
    background: $neon-cyan;
    box-shadow:
      0 0 10px rgba($neon-cyan, 0.9),
      0 0 25px rgba($neon-cyan, 0.5);
    animation: active-bar-pulse 2s ease-in-out infinite;
  }

  @keyframes active-bar-pulse {
    0%, 100% { box-shadow: 0 0 10px rgba($neon-cyan, 0.9), 0 0 25px rgba($neon-cyan, 0.5); }
    50% { box-shadow: 0 0 18px rgba($neon-cyan, 1), 0 0 40px rgba($neon-cyan, 0.7), 0 0 60px rgba($neon-cyan, 0.3); }
  }
}
</style>
