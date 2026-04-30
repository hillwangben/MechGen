<script setup lang="ts">
// 顶栏组件 - 显示任务ID、保存按钮、用户信息
import { ref } from 'vue'

// 当前任务ID（mock）
const currentTaskId = ref('TASK-2024-001')

// 保存状态
const saving = ref(false)

// 保存任务
const handleSave = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
  }, 1000)
}
</script>

<template>
  <header class="topbar">
    <!-- 左侧 Logo 和标题 -->
    <div class="topbar__left">
      <div class="topbar__logo">
        <el-icon :size="24"><Monitor /></el-icon>
      </div>
      <h1 class="topbar__title">反无技战法生成模块</h1>
    </div>

    <!-- 中间任务信息 -->
    <div class="topbar__center">
      <div class="topbar__task">
        <span class="topbar__task-label">当前任务：</span>
        <el-tag type="info" effect="dark" size="small">
          {{ currentTaskId }}
        </el-tag>
      </div>
    </div>

    <!-- 右侧操作区 -->
    <div class="topbar__right">
      <el-button
        type="primary"
        size="small"
        :loading="saving"
        @click="handleSave"
      >
        <el-icon><Download /></el-icon>
        <span>保存</span>
      </el-button>

      <el-dropdown trigger="click">
        <div class="topbar__user">
          <el-avatar :size="32" class="topbar__avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="topbar__username">分析师</span>
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
    color: $tech-blue;
    background: rgba($tech-blue, 0.1);
    border-radius: $border-radius;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    font-family: $font-mono;
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
    font-size: 13px;
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
    border-radius: $border-radius;
    transition: background $transition-fast;

    &:hover {
      background: $bg-tertiary;
    }
  }

  &__avatar {
    background: rgba($tech-blue, 0.2);
    color: $tech-blue;
  }

  &__username {
    font-size: 13px;
    color: $text-primary;
  }
}
</style>
