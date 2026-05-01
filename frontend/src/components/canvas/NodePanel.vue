<script setup lang="ts">
// 模型组件选择面板 - 可拖拽节点列表
import { ref } from 'vue'

// 组件分类
const categories = ref([
  {
    name: '基础模型',
    icon: 'Box',
    expanded: true,
    nodes: [
      { type: 'basic', name: '目标检测', icon: 'Aim', color: '#00d4ff' },
      { type: 'basic', name: '特征提取', icon: 'DataLine', color: '#00d4ff' },
      { type: 'basic', name: '文本理解', icon: 'Document', color: '#00d4ff' }
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
      { type: 'composite', name: '综合研判', icon: 'DataBoard', color: '#ff8c00' }
    ]
  },
])

// 拖拽开始
const onDragStart = (event: DragEvent, node: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify(node))
    event.dataTransfer.effectAllowed = 'move'
  }
}

// 切换分类展开
const toggleCategory = (category: any) => {
  category.expanded = !category.expanded
}
</script>

<template>
  <div class="node-panel">
    <!-- 面板头部 -->
    <div class="node-panel__header">
      <el-icon><Menu /></el-icon>
      <span>模型组件</span>
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
          <el-icon :size="14">
            <component :is="category.expanded ? 'ArrowDown' : 'ArrowRight'" />
          </el-icon>
          <el-icon :size="14">
            <component :is="category.icon" />
          </el-icon>
          <span>{{ category.name }}</span>
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
              :style="{ borderColor: node.color }"
            >
              <el-icon :size="16" :style="{ color: node.color }">
                <component :is="node.icon" />
              </el-icon>
            </div>
            <span class="node-panel__node-name">{{ node.name }}</span>
            <el-icon class="node-panel__node-drag" :size="12">
              <Rank />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 面板底部提示 -->
    <div class="node-panel__footer">
      <el-icon :size="12"><InfoFilled /></el-icon>
      <span>拖拽组件到画布</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.node-panel {
  @include flex-column;
  width: 240px;
  height: 100%;
  background: $bg-secondary;
  border-right: 1px solid $border-color;

  // 头部 — 宋体 + 霓虹发光
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
