<script setup lang="ts">
// 统一工作空间 - 主界面
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useModelStore } from '@/stores/model'
import NodePanel from '@/components/canvas/NodePanel.vue'
import ModelCanvas from '@/components/canvas/ModelCanvas.vue'
import ChatPanel from '@/components/canvas/ChatPanel.vue'

const taskStore = useTaskStore()
const modelStore = useModelStore()

// 问答面板折叠状态
const chatCollapsed = ref(false)

// 切换问答面板
const toggleChat = () => {
  chatCollapsed.value = !chatCollapsed.value
}

// 组件挂载时加载数据
onMounted(async () => {
  await Promise.all([
    taskStore.loadTasks(),
    modelStore.loadModels()
  ])
})
</script>

<template>
  <div class="workspace">
    <!-- 工具栏 -->
    <div class="workspace__toolbar">
      <div class="workspace__toolbar-left">
        <el-button size="small" type="primary">
          <el-icon><Plus /></el-icon>
          <span>新建节点</span>
        </el-button>
        <el-button size="small">
          <el-icon><ZoomIn /></el-icon>
          <span>放大</span>
        </el-button>
        <el-button size="small">
          <el-icon><ZoomOut /></el-icon>
          <span>缩小</span>
        </el-button>
        <el-button size="small">
          <el-icon><FullScreen /></el-icon>
          <span>适应画布</span>
        </el-button>
      </div>
      <div class="workspace__toolbar-right">
        <el-button size="small" @click="toggleChat">
          <el-icon><ChatDotRound /></el-icon>
          <span>{{ chatCollapsed ? '展开面板' : '收起面板' }}</span>
        </el-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="workspace__content">
      <!-- 模型组件面板 -->
      <NodePanel class="workspace__panel" />

      <!-- 模型画布 -->
      <div class="workspace__canvas" :class="{ 'is-expanded': chatCollapsed }">
        <ModelCanvas />
      </div>

      <!-- 问答面板 -->
      <div
        class="workspace__chat"
        :class="{ 'is-collapsed': chatCollapsed }"
      >
        <ChatPanel />
      </div>
    </div>

    <!-- 状态栏 -->
    <div class="workspace__statusbar">
      <div class="workspace__status-left">
        <span class="workspace__status-item">
          <span class="workspace__status-dot is-success"></span>
          引擎就绪
        </span>
        <span class="workspace__status-item">
          当前阶段：模型分配
        </span>
      </div>
      <div class="workspace__status-right">
        <span class="workspace__status-item">
          模型数量：{{ modelStore.modelCount }}
        </span>
        <span class="workspace__status-item">
          任务数量：{{ taskStore.taskCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.workspace {
  @include flex-column;
  height: 100%;
  background: $bg-primary;

  // 工具栏
  &__toolbar {
    @include flex-between;
    height: 40px;
    padding: 0 $spacing-md;
    background: $bg-secondary;
    border-bottom: 1px solid $border-color;

    &-left,
    &-right {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
    }
  }

  // 主内容区
  &__content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  // 组件面板
  &__panel {
    flex-shrink: 0;
  }

  // 画布区域
  &__canvas {
    flex: 1;
    overflow: hidden;
    transition: all $transition-normal;

    &.is-expanded {
      flex: 1;
    }
  }

  // 问答面板
  &__chat {
    width: $chat-panel-width;
    flex-shrink: 0;
    border-left: 1px solid $border-color;
    transition: all $transition-normal;

    &.is-collapsed {
      width: 0;
      overflow: hidden;
      border-left: none;
    }
  }

  // 状态栏
  &__statusbar {
    @include flex-between;
    height: $statusbar-height;
    padding: 0 $spacing-md;
    background: $bg-secondary;
    border-top: 1px solid $border-color;
    font-family: $font-mono;
    font-size: 12px;
    color: $text-secondary;
  }

  &__status-left,
  &__status-right {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
  }

  &__status-item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  &__status-dot {
    @include status-dot($status-green);
  }
}
</style>
