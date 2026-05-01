<script setup lang="ts">
// 模型组件选择面板 — 赛博朋克HUD风格
import { ref } from 'vue'

const categories = ref([
  {
    name: '基础模型',
    icon: 'Box',
    expanded: true,
    nodes: [
      { type: 'basic', name: '目标检测', icon: 'Aim', color: '#00ffff' },
      { type: 'basic', name: '特征提取', icon: 'DataLine', color: '#00ffff' },
      { type: 'basic', name: '文本理解', icon: 'Document', color: '#00ffff' }
    ]
  },
  {
    name: '场景模型',
    icon: 'Cpu',
    expanded: true,
    nodes: [
      { type: 'scene', name: '同行人识别', icon: 'User', color: '#00ff88' },
      { type: 'scene', name: '通信关联', icon: 'Connection', color: '#00ff88' },
      { type: 'scene', name: '整机采购', icon: 'ShoppingCart', color: '#00ff88' },
      { type: 'scene', name: '涉机言论', icon: 'ChatDotSquare', color: '#00ff88' },
      { type: 'scene', name: '背包检测', icon: 'Suitcase', color: '#00ff88' }
    ]
  },
  {
    name: '组合模型',
    icon: 'Connection',
    expanded: false,
    nodes: [
      { type: 'composite', name: '综合研判', icon: 'DataBoard', color: '#ffd700' }
    ]
  },
])

const onDragStart = (event: DragEvent, node: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify(node))
    event.dataTransfer.effectAllowed = 'move'
  }
}

const toggleCategory = (category: any) => {
  category.expanded = !category.expanded
}
</script>

<template>
  <div class="node-panel">
    <!-- 面板头部 -->
    <div class="node-panel__header">
      <div class="node-panel__header-icon">
        <el-icon :size="18"><Menu /></el-icon>
      </div>
      <span class="node-panel__header-title">模型组件</span>
      <span class="node-panel__header-divider">/</span>
      <span class="node-panel__header-count">{{ categories.reduce((s, c) => s + c.nodes.length, 0) }}</span>
    </div>

    <!-- 组件列表 -->
    <div class="node-panel__content">
      <div
        v-for="category in categories"
        :key="category.name"
        class="node-panel__category"
      >
        <!-- 分类标题 -->
        <div
          class="node-panel__category-header"
          @click="toggleCategory(category)"
        >
          <el-icon :size="16">
            <component :is="category.expanded ? 'ArrowDown' : 'ArrowRight'" />
          </el-icon>
          <span class="node-panel__category-name">{{ category.name }}</span>
          <span class="node-panel__category-count">
            {{ category.nodes.length }}
          </span>
        </div>

        <!-- 节点列表 -->
        <div v-show="category.expanded" class="node-panel__nodes">
          <div
            v-for="node in category.nodes"
            :key="node.name"
            class="node-panel__node"
            :draggable="true"
            @dragstart="onDragStart($event, node)"
          >
            <div
              class="node-panel__node-icon"
              :style="{ borderColor: node.color, boxShadow: `0 0 10px rgba(${node.color === '#ffd700' ? '255,215,0' : node.color === '#00ff88' ? '0,255,136' : '0,255,255'}, 0.35)` }"
            >
              <el-icon :size="18" :style="{ color: node.color }">
                <component :is="node.icon" />
              </el-icon>
            </div>
            <span class="node-panel__node-name">{{ node.name }}</span>
            <el-icon class="node-panel__node-drag" :size="14">
              <Rank />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="node-panel__footer">
      <span class="node-panel__footer-pulse"></span>
      <span class="node-panel__footer-text">拖拽组件到画布</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.node-panel {
  @include flex-column;
  width: 248px;
  height: 100%;
  background: $bg-secondary;
  border-right: 1px solid $neon-cyan-dim;
  position: relative;
  @include corner-brackets($neon-cyan-dim, 10px, 2px);

  // 头部
  &__header {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 $spacing-md;
    border-bottom: 1px solid $border-color;
    font-family: $font-serif;
    font-size: 17px;
    font-weight: 600;
    @include neon-text($neon-cyan);
    letter-spacing: 0.08em;
    gap: $spacing-sm;
  }

  &__header-icon {
    @include flex-center;
    color: $neon-cyan;
  }

  &__header-title {
    flex: 1;
  }

  &__header-divider {
    color: $neon-cyan-dim;
    font-family: $font-mono;
    font-size: 14px;
  }

  &__header-count {
    @include hud-readout($neon-yellow);
    font-size: 14px;
    font-weight: 600;
  }

  // 内容
  &__content {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-sm;
  }

  // 分类
  &__category {
    margin-bottom: 4px;
  }

  &__category-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: 10px $spacing-sm;
    color: $text-secondary;
    font-family: $font-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-fast;
    letter-spacing: 0.06em;

    &:hover {
      background: rgba($neon-cyan, 0.06);
      color: $text-primary;
    }
  }

  &__category-name {
    flex: 1;
  }

  &__category-count {
    @include hud-readout($neon-cyan);
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border: 1px solid rgba($neon-cyan-dim, 0.4);
    background: rgba($neon-cyan, 0.05);
  }

  // 节点列表
  &__nodes {
    padding-left: 4px;
  }

  &__node {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px $spacing-sm;
    margin-bottom: 2px;
    cursor: grab;
    transition: all $transition-fast;
    border: 1px solid transparent;

    &:hover {
      background: rgba($neon-cyan, 0.06);
      border-color: $neon-cyan-dim;
      box-shadow: 0 0 10px rgba($neon-cyan, 0.2);

      .node-panel__node-drag {
        opacity: 1;
      }

      .node-panel__node-icon {
        transform: scale(1.12);
      }
    }

    &:active {
      cursor: grabbing;
    }
  }

  &__node-icon {
    @include flex-center;
    width: 32px;
    height: 32px;
    border: 2px solid;
    background: rgba($bg-void, 0.5);
    flex-shrink: 0;
    transition: transform 150ms ease;
  }

  &__node-name {
    flex: 1;
    font-family: $font-serif;
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    @include ellipsis;
    letter-spacing: 0.05em;
  }

  &__node-drag {
    opacity: 0;
    color: $text-dim;
    transition: opacity $transition-fast;
  }

  // 底部
  &__footer {
    @include flex-center;
    gap: $spacing-sm;
    padding: 10px;
    border-top: 1px solid $border-color;
  }

  &__footer-pulse {
    width: 7px;
    height: 7px;
    background: $neon-cyan;
    box-shadow: 0 0 6px rgba($neon-cyan, 0.7), 0 0 14px rgba($neon-cyan, 0.3);
    animation: footer-dot-pulse 2s ease-in-out infinite;
  }

  &__footer-text {
    font-family: $font-serif;
    font-size: 12px;
    color: $text-dim;
    letter-spacing: 0.05em;
  }

  @keyframes footer-dot-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
}
</style>
