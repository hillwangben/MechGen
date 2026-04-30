<script setup lang="ts">
// 模型评估仪表盘
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 评估指标
const metrics = ref({
  accuracy: 0.92,
  precision: 0.89,
  recall: 0.94,
  f1Score: 0.91,
  latency: 45,
  throughput: 120
})

// 图表引用
const radarChartRef = ref<HTMLDivElement>()
const barChartRef = ref<HTMLDivElement>()

// 初始化雷达图
const initRadarChart = () => {
  if (!radarChartRef.value) return

  const chart = echarts.init(radarChartRef.value)
  chart.setOption({
    backgroundColor: 'transparent',
    title: {
      text: '模型综合评估',
      left: 'center',
      textStyle: {
        color: '#e0e6ff',
        fontFamily: 'JetBrains Mono, monospace'
      }
    },
    radar: {
      indicator: [
        { name: '准确率', max: 1 },
        { name: '精确率', max: 1 },
        { name: '召回率', max: 1 },
        { name: 'F1分数', max: 1 },
        { name: '实时性', max: 1 }
      ],
      axisName: {
        color: '#8890b5'
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(0, 212, 255, 0.02)', 'rgba(0, 212, 255, 0.05)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 102, 128, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 102, 128, 0.3)'
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [0.92, 0.89, 0.94, 0.91, 0.85],
        name: '同行人识别模型 v2',
        areaStyle: {
          color: 'rgba(0, 212, 255, 0.2)'
        },
        lineStyle: {
          color: '#00d4ff'
        },
        itemStyle: {
          color: '#00d4ff'
        }
      }]
    }]
  })
}

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return

  const chart = echarts.init(barChartRef.value)
  chart.setOption({
    backgroundColor: 'transparent',
    title: {
      text: '模型对比分析',
      left: 'center',
      textStyle: {
        color: '#e0e6ff',
        fontFamily: 'JetBrains Mono, monospace'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      bottom: 10,
      textStyle: {
        color: '#8890b5'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['v1', 'v2', 'v3'],
      axisLabel: {
        color: '#8890b5'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 102, 128, 0.3)'
        }
      }
    },
    yAxis: {
      type: 'value',
      max: 1,
      axisLabel: {
        color: '#8890b5'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 102, 128, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 102, 128, 0.1)'
        }
      }
    },
    series: [
      {
        name: '准确率',
        type: 'bar',
        data: [0.85, 0.92, 0.95],
        itemStyle: {
          color: '#00d4ff'
        }
      },
      {
        name: 'F1分数',
        type: 'bar',
        data: [0.82, 0.91, 0.93],
        itemStyle: {
          color: '#b366ff'
        }
      }
    ]
  })
}

onMounted(() => {
  initRadarChart()
  initBarChart()
})
</script>

<template>
  <div class="evaluation">
    <!-- 指标卡片区域 -->
    <div class="evaluation__metrics">
      <div class="evaluation__metric-card">
        <div class="evaluation__metric-label">准确率</div>
        <div class="evaluation__metric-value is-success">
          {{ (metrics.accuracy * 100).toFixed(1) }}%
        </div>
      </div>
      <div class="evaluation__metric-card">
        <div class="evaluation__metric-label">精确率</div>
        <div class="evaluation__metric-value is-info">
          {{ (metrics.precision * 100).toFixed(1) }}%
        </div>
      </div>
      <div class="evaluation__metric-card">
        <div class="evaluation__metric-label">召回率</div>
        <div class="evaluation__metric-value is-warning">
          {{ (metrics.recall * 100).toFixed(1) }}%
        </div>
      </div>
      <div class="evaluation__metric-card">
        <div class="evaluation__metric-label">F1 分数</div>
        <div class="evaluation__metric-value is-purple">
          {{ (metrics.f1Score * 100).toFixed(1) }}%
        </div>
      </div>
      <div class="evaluation__metric-card">
        <div class="evaluation__metric-label">推理延迟</div>
        <div class="evaluation__metric-value is-info">
          {{ metrics.latency }}ms
        </div>
      </div>
      <div class="evaluation__metric-card">
        <div class="evaluation__metric-label">吞吐量</div>
        <div class="evaluation__metric-value is-success">
          {{ metrics.throughput }}/s
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="evaluation__charts">
      <div ref="radarChartRef" class="evaluation__chart"></div>
      <div ref="barChartRef" class="evaluation__chart"></div>
    </div>

    <!-- 操作区域 -->
    <div class="evaluation__actions">
      <el-button type="primary">
        <el-icon><Download /></el-icon>
        <span>导出报告</span>
      </el-button>
      <el-button>
        <el-icon><Refresh /></el-icon>
        <span>重新评估</span>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.evaluation {
  @include flex-column;
  height: 100%;
  padding: $spacing-lg;
  background: $bg-primary;
  overflow-y: auto;

  // 指标卡片
  &__metrics {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__metric-card {
    @include tech-card;
    @include flex-column;
    align-items: center;
    padding: $spacing-md;
  }

  &__metric-label {
    font-size: 12px;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
  }

  &__metric-value {
    font-family: $font-mono;
    font-size: 24px;
    font-weight: 600;

    &.is-success {
      color: $status-green;
    }
    &.is-info {
      color: $tech-blue;
    }
    &.is-warning {
      color: $status-orange;
    }
    &.is-purple {
      color: $status-purple;
    }
  }

  // 图表区域
  &__charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
  }

  &__chart {
    @include tech-card;
    height: 350px;
    padding: $spacing-md;
  }

  // 操作区域
  &__actions {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
  }
}
</style>
