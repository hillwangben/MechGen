<script setup lang="ts">
// 模型训练工作台
import { ref, reactive } from 'vue'

// 训练配置
const config = reactive({
  modelId: '',
  epochs: 100,
  batchSize: 32,
  learningRate: 0.001,
  optimizer: 'adam',
  dataset: ''
})

// 训练状态
const training = ref(false)
const progress = ref(0)
const currentEpoch = ref(0)

// 训练日志
const logs = ref<string[]>([
  '[INFO] 训练工作台就绪',
  '[INFO] 等待配置训练参数...'
])

// 可用模型列表
const availableModels = [
  { label: '同行人识别模型 v1', value: 'peer_recognition_v1' },
  { label: '频繁通信关联模型 v1', value: 'comm_correlation_v1' },
  { label: '整机采购识别模型 v1', value: 'purchase_detection_v1' }
]

// 可用数据集
const availableDatasets = [
  { label: '城市反无人机场景数据集', value: 'urban_counter_uav' },
  { label: '人员集结场景数据集', value: 'person_assembly' },
  { label: '装备筹措场景数据集', value: 'equipment_procurement' }
]

// 优化器选项
const optimizers = [
  { label: 'Adam', value: 'adam' },
  { label: 'SGD', value: 'sgd' },
  { label: 'AdamW', value: 'adamw' }
]

// 开始训练
const startTraining = () => {
  if (!config.modelId || !config.dataset) {
    return
  }

  training.value = true
  progress.value = 0
  currentEpoch.value = 0
  logs.value.push('[INFO] 开始训练...')

  // 模拟训练过程
  const interval = setInterval(() => {
    currentEpoch.value++
    progress.value = Math.min((currentEpoch.value / config.epochs) * 100, 100)

    logs.value.push(
      `[Epoch ${currentEpoch.value}/${config.epochs}] loss: ${(Math.random() * 0.5 + 0.1).toFixed(4)} accuracy: ${(0.7 + Math.random() * 0.25).toFixed(4)}`
    )

    if (currentEpoch.value >= config.epochs) {
      clearInterval(interval)
      training.value = false
      logs.value.push('[INFO] 训练完成！')
    }
  }, 200)
}

// 停止训练
const stopTraining = () => {
  training.value = false
  logs.value.push('[WARN] 训练已手动停止')
}
</script>

<template>
  <div class="training">
    <!-- 左侧配置面板 -->
    <div class="training__config">
      <div class="training__config-header">
        <el-icon><Setting /></el-icon>
        <span>训练配置</span>
      </div>

      <div class="training__config-content">
        <el-form label-position="top" size="small">
          <el-form-item label="选择模型">
            <el-select v-model="config.modelId" placeholder="请选择模型" style="width: 100%">
              <el-option
                v-for="model in availableModels"
                :key="model.value"
                :label="model.label"
                :value="model.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="选择数据集">
            <el-select v-model="config.dataset" placeholder="请选择数据集" style="width: 100%">
              <el-option
                v-for="ds in availableDatasets"
                :key="ds.value"
                :label="ds.label"
                :value="ds.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="训练轮数">
            <el-input-number v-model="config.epochs" :min="1" :max="1000" style="width: 100%" />
          </el-form-item>

          <el-form-item label="批次大小">
            <el-input-number v-model="config.batchSize" :min="1" :max="256" style="width: 100%" />
          </el-form-item>

          <el-form-item label="学习率">
            <el-input-number
              v-model="config.learningRate"
              :min="0.0001"
              :max="0.1"
              :step="0.0001"
              :precision="4"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="优化器">
            <el-select v-model="config.optimizer" style="width: 100%">
              <el-option
                v-for="opt in optimizers"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="training__config-actions">
          <el-button
            type="primary"
            :disabled="!config.modelId || !config.dataset || training"
            @click="startTraining"
          >
            <el-icon><VideoPlay /></el-icon>
            <span>开始训练</span>
          </el-button>
          <el-button
            type="danger"
            :disabled="!training"
            @click="stopTraining"
          >
            <el-icon><VideoPause /></el-icon>
            <span>停止训练</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 右侧日志和进度 -->
    <div class="training__monitor">
      <!-- 进度区域 -->
      <div class="training__progress">
        <div class="training__progress-header">
          <el-icon><TrendCharts /></el-icon>
          <span>训练进度</span>
          <el-tag v-if="training" type="warning" effect="dark" size="small">训练中</el-tag>
          <el-tag v-else type="info" effect="dark" size="small">就绪</el-tag>
        </div>
        <div class="training__progress-content">
          <el-progress
            :percentage="progress"
            :stroke-width="20"
            :text-inside="true"
            status="warning"
          />
          <div class="training__progress-info">
            <span>当前轮次：{{ currentEpoch }} / {{ config.epochs }}</span>
            <span>进度：{{ progress.toFixed(1) }}%</span>
          </div>
        </div>
      </div>

      <!-- 日志区域 -->
      <div class="training__logs">
        <div class="training__logs-header">
          <el-icon><Document /></el-icon>
          <span>训练日志</span>
        </div>
        <div class="training__logs-content">
          <div
            v-for="(log, index) in logs"
            :key="index"
            class="training__log-line"
          >
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.training {
  display: flex;
  height: 100%;
  background: $bg-primary;

  // 配置面板
  &__config {
    width: 320px;
    @include flex-column;
    background: $bg-secondary;
    border-right: 1px solid $border-color;
  }

  &__config-header {
    @include flex-between;
    height: 48px;
    padding: 0 $spacing-md;
    border-bottom: 1px solid $border-color;
    font-family: $font-mono;
    font-size: 14px;
    color: $text-primary;

    .el-icon {
      color: $tech-blue;
    }
  }

  &__config-content {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-md;
  }

  &__config-actions {
    display: flex;
    gap: $spacing-sm;
    margin-top: $spacing-lg;
  }

  // 监控区域
  &__monitor {
    flex: 1;
    @include flex-column;
    overflow: hidden;
  }

  // 进度区域
  &__progress {
    padding: $spacing-md;
    border-bottom: 1px solid $border-color;
  }

  &__progress-header {
    @include flex-between;
    margin-bottom: $spacing-md;
    font-family: $font-mono;
    font-size: 14px;
    color: $text-primary;

    .el-icon {
      color: $tech-blue;
    }
  }

  &__progress-info {
    @include flex-between;
    margin-top: $spacing-sm;
    font-family: $font-mono;
    font-size: 12px;
    color: $text-secondary;
  }

  // 日志区域
  &__logs {
    flex: 1;
    @include flex-column;
    overflow: hidden;
  }

  &__logs-header {
    @include flex-between;
    height: 48px;
    padding: 0 $spacing-md;
    border-bottom: 1px solid $border-color;
    font-family: $font-mono;
    font-size: 14px;
    color: $text-primary;

    .el-icon {
      color: $tech-blue;
    }
  }

  &__logs-content {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-md;
    background: $bg-primary;
  }

  &__log-line {
    font-family: $font-mono;
    font-size: 12px;
    line-height: 1.8;
    color: $text-secondary;
    white-space: pre-wrap;

    &:last-child {
      color: $status-green;
    }
  }
}
</style>
