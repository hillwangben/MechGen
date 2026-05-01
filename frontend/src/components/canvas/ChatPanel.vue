<script setup lang="ts">
// 问答面板组件 — 终端风格交互
import { ref, nextTick } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([
  {
    id: '1',
    role: 'assistant',
    content: '> 系统就绪。\n您好！我是反无技战法生成助手。请描述您的分析任务需求。',
    timestamp: new Date()
  }
])

const inputText = ref('')
const sending = ref(false)
const messagesRef = ref<HTMLDivElement>()

const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || sending.value) return

  messages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content: text,
    timestamp: new Date()
  })

  inputText.value = ''
  sending.value = true
  await scrollToBottom()

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

const getMockResponse = (query: string): string => {
  if (query.includes('模型') || query.includes('分配')) {
    return '> 检索完成。\n已为您检索到相关模型资产。推荐使用"同行人识别模型 v2"和"频繁通信关联模型 v1"。是否确认？'
  }
  if (query.includes('优化') || query.includes('训练')) {
    return '> 优化建议。\n建议对"同行人识别模型"进行优化训练。预计训练时间约 2 小时。是否跳转到训练工作台？'
  }
  if (query.includes('碰撞') || query.includes('规则')) {
    return '> 碰撞分析就绪。\n当前已选择 2 个模型进行碰撞分析。请确认是否开始碰撞？'
  }
  return '> 确认。\n收到您的请求。请提供更多关于场景和需求的详细信息。'
}

const handleKeydown = (e: Event | KeyboardEvent) => {
  const ke = e as KeyboardEvent
  if (ke.key === 'Enter' && !ke.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<template>
  <div class="chat-panel">
    <!-- 面板头部 -->
    <div class="chat-panel__header">
      <div class="chat-panel__header-status"></div>
      <el-icon :size="18" class="chat-panel__header-icon"><ChatDotRound /></el-icon>
      <span class="chat-panel__header-title">问答交互</span>
      <span class="chat-panel__header-tag">LIVE</span>
    </div>

    <!-- 消息列表 -->
    <div ref="messagesRef" class="chat-panel__messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="chat-panel__message"
        :class="`is-${msg.role}`"
      >
        <div class="chat-panel__message-label">
          {{ msg.role === 'user' ? 'USER' : 'SYS' }}
        </div>
        <div class="chat-panel__message-bubble">
          <pre class="chat-panel__message-text">{{ msg.content }}</pre>
          <span class="chat-panel__message-time">
            {{ formatTime(msg.timestamp) }}
          </span>
        </div>
      </div>

      <!-- 加载态 -->
      <div v-if="sending" class="chat-panel__message is-assistant">
        <div class="chat-panel__message-label">SYS</div>
        <div class="chat-panel__message-bubble is-loading">
          <span class="chat-panel__loading-bar"></span>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-panel__input">
      <div class="chat-panel__input-prefix">
        <span class="chat-panel__input-prompt">&gt;</span>
        <span class="chat-panel__input-label">输入指令</span>
      </div>
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="3"
        placeholder="描述您的需求..."
        resize="none"
        @keydown="handleKeydown"
      />
      <div class="chat-panel__input-actions">
        <span class="chat-panel__input-hint">
          Enter 发送 · Shift+Enter 换行
        </span>
        <el-button type="primary" size="default" :disabled="!inputText.trim()" @click="sendMessage">
          <el-icon :size="16"><Promotion /></el-icon>
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
    letter-spacing: 0.06em;
    gap: $spacing-sm;
  }

  &__header-status {
    width: 8px;
    height: 8px;
    background: $status-green;
    box-shadow:
      0 0 8px rgba($status-green, 0.9),
      0 0 18px rgba($status-green, 0.5);
    animation: status-blink 2s ease-in-out infinite;
  }

  &__header-icon {
    color: $neon-cyan;
  }

  &__header-title {
    @include neon-text($neon-cyan);
  }

  &__header-tag {
    @include hud-readout($status-green);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border: 1px solid rgba($status-green, 0.5);
    background: rgba($status-green, 0.06);
    margin-left: auto;
    letter-spacing: 0.12em;
  }

  @keyframes status-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
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
    margin-bottom: $spacing-lg;

    &.is-assistant {
      .chat-panel__message-label {
        color: $neon-cyan;
        text-shadow: 0 0 6px rgba($neon-cyan, 0.6);
      }
      .chat-panel__message-bubble {
        background: rgba($neon-cyan, 0.04);
        border-color: rgba($neon-cyan-dim, 0.5);
      }
    }

    &.is-user {
      flex-direction: row-reverse;

      .chat-panel__message-label {
        color: $neon-magenta;
        text-shadow: 0 0 6px rgba($neon-magenta, 0.6);
      }
      .chat-panel__message-bubble {
        background: rgba($neon-magenta, 0.04);
        border-color: rgba($neon-magenta-dim, 0.4);
      }
    }
  }

  // 角色标签
  &__message-label {
    font-family: $font-mono;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.15em;
    padding-top: 4px;
    width: 36px;
    flex-shrink: 0;
  }

  // 消息气泡
  &__message-bubble {
    flex: 1;
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-color;
    font-size: 14px;
    line-height: 1.7;
    color: $text-primary;
    position: relative;

    &.is-loading {
      display: flex;
      align-items: center;
      padding: $spacing-md;
    }
  }

  &__message-text {
    font-family: inherit;
    font-size: inherit;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
    background: none;
    border: none;
    color: inherit;
  }

  &__message-time {
    display: block;
    font-family: $font-mono;
    font-size: 10px;
    color: $text-disabled;
    margin-top: $spacing-sm;
    letter-spacing: 0.06em;
  }

  // 加载条
  &__loading-bar {
    display: block;
    width: 60%;
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent,
      $neon-cyan,
      transparent
    );
    background-size: 200% 100%;
    animation: loading-scan 1.5s linear infinite;
  }

  @keyframes loading-scan {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  // 输入区域
  &__input {
    padding: $spacing-md;
    border-top: 1px solid $border-color;
  }

  &__input-prefix {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
  }

  &__input-prompt {
    font-family: $font-mono;
    font-size: 20px;
    font-weight: 700;
    color: $neon-cyan;
    text-shadow: 0 0 10px rgba($neon-cyan, 0.7);
    line-height: 1;
  }

  &__input-label {
    font-family: $font-serif;
    font-size: 13px;
    color: $text-dim;
    letter-spacing: 0.05em;
  }

  &__input-actions {
    @include flex-between;
    margin-top: $spacing-sm;
  }

  &__input-hint {
    font-family: $font-serif;
    font-size: 11px;
    color: $text-dim;
    letter-spacing: 0.04em;
  }

  // 深度覆写输入框
  :deep(.el-textarea__inner) {
    font-family: $font-mono;
    font-size: 14px;
    background: rgba($bg-void, 0.6);
    border: 2px solid $neon-cyan-dim;
    color: $text-primary;
    letter-spacing: 0.03em;

    &:focus {
      border-color: $neon-cyan;
      box-shadow: 0 0 20px rgba($neon-cyan, 0.4);
    }

    &::placeholder {
      color: $text-disabled;
    }
  }
}
</style>
