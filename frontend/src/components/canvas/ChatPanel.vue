<script setup lang="ts">
// 问答面板组件 - 自然语言交互
import { ref, nextTick } from 'vue'

// 消息接口
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// 消息列表
const messages = ref<Message[]>([
  {
    id: '1',
    role: 'assistant',
    content: '您好！我是反无技战法生成助手。请描述您的分析任务需求，我将协助您完成模型分配、优化和碰撞。',
    timestamp: new Date()
  }
])

// 输入内容
const inputText = ref('')

// 发送中状态
const sending = ref(false)

// 消息容器引用
const messagesRef = ref<HTMLDivElement>()

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// 发送消息
const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || sending.value) return

  // 添加用户消息
  messages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content: text,
    timestamp: new Date()
  })

  inputText.value = ''
  sending.value = true
  await scrollToBottom()

  // 模拟 AI 响应
  setTimeout(() => {
    messages.value.push({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: getMockResponse(text),
      timestamp: new Date()
    })
    sending.value = false
    scrollToBottom()
  }, 1000)
}

// 获取模拟响应
const getMockResponse = (query: string): string => {
  if (query.includes('模型') || query.includes('分配')) {
    return '已为您检索到相关模型资产。当前场景下推荐使用"同行人识别模型 v2"和"频繁通信关联模型 v1"。是否确认使用这些模型进行分析？'
  }
  if (query.includes('优化') || query.includes('训练')) {
    return '建议对"同行人识别模型"进行优化训练。预计训练时间约 2 小时，需要使用城市反无人机场景数据集。是否跳转到训练工作台？'
  }
  if (query.includes('碰撞') || query.includes('规则')) {
    return '当前已选择 2 个模型进行碰撞分析。碰撞将基于时间相关性和空间关联性进行推理。请确认是否开始碰撞？'
  }
  return '收到您的请求。我将协助您完成任务分析。请提供更多关于场景和需求的详细信息。'
}

// 处理键盘事件
const handleKeydown = (e: Event | KeyboardEvent) => {
  const ke = e as KeyboardEvent
  if (ke.key === 'Enter' && !ke.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

// 格式化时间
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="chat-panel">
    <!-- 面板头部 -->
    <div class="chat-panel__header">
      <el-icon><ChatDotRound /></el-icon>
      <span>问答交互</span>
      <el-tag size="small" type="success" effect="dark">在线</el-tag>
    </div>

    <!-- 消息列表 -->
    <div ref="messagesRef" class="chat-panel__messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="chat-panel__message"
        :class="`is-${msg.role}`"
      >
        <div class="chat-panel__message-avatar">
          <el-avatar :size="32" :class="`is-${msg.role}`">
            <el-icon>
              <component :is="msg.role === 'user' ? 'User' : 'Service'" />
            </el-icon>
          </el-avatar>
        </div>
        <div class="chat-panel__message-content">
          <div class="chat-panel__message-bubble">
            {{ msg.content }}
          </div>
          <div class="chat-panel__message-time">
            {{ formatTime(msg.timestamp) }}
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="sending" class="chat-panel__message is-assistant">
        <div class="chat-panel__message-avatar">
          <el-avatar :size="32" class="is-assistant">
            <el-icon><Service /></el-icon>
          </el-avatar>
        </div>
        <div class="chat-panel__message-content">
          <div class="chat-panel__message-bubble is-loading">
            <span class="chat-panel__loading-dot"></span>
            <span class="chat-panel__loading-dot"></span>
            <span class="chat-panel__loading-dot"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-panel__input">
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="3"
        placeholder="请输入您的需求或问题..."
        resize="none"
        @keydown="handleKeydown"
      />
      <div class="chat-panel__input-actions">
        <span class="chat-panel__input-hint">
          按 Enter 发送，Shift + Enter 换行
        </span>
        <el-button type="primary" size="small" :disabled="!inputText.trim()" @click="sendMessage">
          <el-icon><Promotion /></el-icon>
          <span>发送</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.chat-panel {
  @include flex-column;
  height: 100%;
  background: $bg-secondary;

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
      border-radius: 0;  // 直角设计

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
    border-radius: 0;  // 直角设计
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

  // 加载动画 — 霓虹色光点
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

  // 输入区域 — 霓虹发光聚焦
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
