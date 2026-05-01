<script setup lang="ts">
// 统一工作空间 — 赛博朋克HUD主界面
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useModelStore } from '@/stores/model'
import NodePanel from '@/components/canvas/NodePanel.vue'
import ModelCanvas from '@/components/canvas/ModelCanvas.vue'
import ChatPanel from '@/components/canvas/ChatPanel.vue'

const taskStore = useTaskStore()
const modelStore = useModelStore()

const chatCollapsed = ref(false)

const toggleChat = () => {
  chatCollapsed.value = !chatCollapsed.value
}

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
      <div class="workspace__toolbar-group">
        <el-button size="default" type="primary">
          <el-icon :size="18"><Plus /></el-icon>
          <span>新建节点</span>
        </el-button>
        <span class="workspace__toolbar-sep"></span>
        <el-button size="default">
          <el-icon :size="18"><ZoomIn /></el-icon>
          <span>放大</span>
        </el-button>
        <el-button size="default">
          <el-icon :size="18"><ZoomOut /></el-icon>
          <span>缩小</span>
        </el-button>
        <el-button size="default">
          <el-icon :size="18"><FullScreen /></el-icon>
          <span>适应画布</span>
        </el-button>
      </div>
      <div class="workspace__toolbar-group">
        <el-button size="default" @click="toggleChat">
          <el-icon :size="18"><ChatDotRound /></el-icon>
          <span>{{ chatCollapsed ? '展开面板' : '收起面板' }}</span>
        </el-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="workspace__content">
      <NodePanel class="workspace__panel" />

      <div
        class="workspace__canvas bg-grid"
        :class="{ 'is-expanded': chatCollapsed }"
      >
        <ModelCanvas />
      </div>

      <div
        class="workspace__chat"
        :class="{ 'is-collapsed': chatCollapsed }"
      >
        <ChatPanel />
      </div>
    </div>

    <!-- HUD 状态栏 -->
    <div class="workspace__statusbar">
      <div class="workspace__status-group">
        <span class="workspace__status-item">
          <span class="workspace__status-dot is-online"></span>
          <span class="workspace__status-label">引擎</span>
          <span class="workspace__status-value is-green">就绪</span>
        </span>
        <span class="workspace__status-sep">|</span>
        <span class="workspace__status-item">
          <span class="workspace__status-label">阶段</span>
          <span class="workspace__status-value">模型分配</span>
        </span>
      </div>
      <div class="workspace__status-group">
        <span class="workspace__status-item">
          <span class="workspace__status-label">模型</span>
          <span class="workspace__status-value is-gold">{{ modelStore.modelCount }}</span>
        </span>
        <span class="workspace__status-sep">|</span>
        <span class="workspace__status-item">
          <span class="workspace__status-label">任务</span>
          <span class="workspace__status-value is-gold">{{ taskStore.taskCount }}</span>
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
  background: $bg-void;

  // === 工具栏 ===
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 $spacing-lg;
    background: $bg-secondary;
    border-bottom: 1px solid $neon-cyan-dim;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($neon-cyan, 0.35) 30%,
        rgba($neon-cyan, 0.35) 70%,
        transparent
      );
    }
  }

  &__toolbar-group {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__toolbar-sep {
    width: 1px;
    height: 18px;
    background: $neon-cyan-dim;
    margin: 0 4px;
    opacity: 0.5;
  }

  // === 主内容区 ===
  &__content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__panel {
    flex-shrink: 0;
  }

  &__canvas {
    flex: 1;
    overflow: hidden;
    transition: all $transition-normal;

    &.is-expanded {
      flex: 1;
    }
  }

  &__chat {
    width: $chat-panel-width;
    flex-shrink: 0;
    border-left: 1px solid $neon-cyan-dim;
    transition: all $transition-normal;

    &.is-collapsed {
      width: 0;
      overflow: hidden;
      border-left: none;
    }
  }

  // === HUD 状态栏 ===
  &__statusbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 34px;
    padding: 0 $spacing-lg;
    background: $bg-secondary;
    border-top: 1px solid $neon-cyan-dim;
    font-family: $font-mono;
    font-size: 12px;
    letter-spacing: 0.06em;
  }

  &__status-group {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__status-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;

    &.is-online {
      background: $status-green;
      box-shadow: 0 0 8px rgba($status-green, 0.9), 0 0 18px rgba($status-green, 0.4);
      animation: dot-breathe 2s ease-in-out infinite;
    }
  }

  @keyframes dot-breathe {
    0%, 100% {
      box-shadow: 0 0 8px rgba($status-green, 0.9), 0 0 18px rgba($status-green, 0.4);
    }
    50% {
      box-shadow: 0 0 14px rgba($status-green, 1), 0 0 28px rgba($status-green, 0.6);
    }
  }

  &__status-label {
    color: $text-dim;
    text-transform: uppercase;
  }

  &__status-value {
    color: $text-secondary;
    font-weight: 500;

    &.is-green {
      color: $status-green;
      text-shadow: 0 0 6px rgba($status-green, 0.5);
    }

    &.is-gold {
      @include hud-readout($neon-yellow);
      font-size: 13px;
      font-weight: 700;
    }
  }

  &__status-sep {
    color: $neon-cyan-dim;
    opacity: 0.35;
    font-weight: 300;
  }
}
</style>
