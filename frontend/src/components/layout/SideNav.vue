<script setup lang="ts">
// 侧边导航组件 - 图标模式
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

// 导航项配置
const navItems = [
  {
    path: '/workspace',
    icon: 'Monitor',
    title: '统一工作空间'
  },
  {
    path: '/training',
    icon: 'Cpu',
    title: '模型训练工作台'
  },
  {
    path: '/evaluation',
    icon: 'DataLine',
    title: '模型评估仪表盘'
  },
  {
    path: '/assets',
    icon: 'Files',
    title: '模型资产管理'
  }
]

// 当前激活的路由
const activeRoute = computed(() => route.path)

// 导航到指定路由
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
        <el-icon :size="20">
          <component :is="item.icon" />
        </el-icon>
      </div>
    </div>

    <!-- 底部工具区 -->
    <div class="sidenav__footer">
      <div class="sidenav__item" title="设置">
        <el-icon :size="20"><Setting /></el-icon>
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
    border-radius: $border-radius;
    cursor: pointer;
    transition: all $transition-fast;
    position: relative;

    &:hover {
      color: $tech-blue;
      background: rgba($tech-blue, 0.1);
    }

    &.is-active {
      color: $tech-blue;
      background: rgba($tech-blue, 0.15);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: $tech-blue;
        border-radius: 0 2px 2px 0;
        box-shadow: 0 0 8px rgba($tech-blue, 0.5);
      }
    }
  }
}
</style>
