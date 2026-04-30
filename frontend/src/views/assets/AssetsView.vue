<script setup lang="ts">
// 模型资产管理
import { ref, computed, onMounted } from 'vue'
import { useModelStore } from '@/stores/model'

const modelStore = useModelStore()

// 搜索关键词
const searchText = ref('')

// 筛选条件
const filterForm = ref('all')
const filterLevel = ref('all')

// 模型形态选项
const formOptions = [
  { label: '全部形态', value: 'all' },
  { label: '基础模型', value: 'basic' },
  { label: '场景模型', value: 'scene' },
  { label: '组合模型', value: 'composite' }
]

// 成熟度等级选项
const levelOptions = [
  { label: '全部等级', value: 'all' },
  { label: 'L1-实验验证', value: 'L1' },
  { label: 'L2-场景验证', value: 'L2' },
  { label: 'L3-业务可用', value: 'L3' },
  { label: 'L4-生产就绪', value: 'L4' }
]

// 筛选后的模型列表
const filteredModels = computed(() => {
  return modelStore.modelList.filter(model => {
    const matchesSearch = !searchText.value ||
      model.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      model.description.toLowerCase().includes(searchText.value.toLowerCase())

    const matchesForm = filterForm.value === 'all' || model.form === filterForm.value
    const matchesLevel = filterLevel.value === 'all' || model.level === filterLevel.value

    return matchesSearch && matchesForm && matchesLevel
  })
})

// 获取形态标签类型
const getFormTagType = (form: string): 'info' | 'primary' | 'success' | 'warning' | 'danger' | undefined => {
  const map: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
    basic: 'info',
    scene: 'success',
    composite: 'warning'
  }
  return map[form] || 'info'
}

// 获取形态文本
const getFormText = (form: string) => {
  const map: Record<string, string> = {
    basic: '基础模型',
    scene: '场景模型',
    composite: '组合模型'
  }
  return map[form] || form
}

// 获取等级标签类型
const getLevelTagType = (level: string): 'info' | 'primary' | 'success' | 'warning' | 'danger' | undefined => {
  const map: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
    L1: 'info',
    L2: 'warning',
    L3: 'success',
    L4: 'success'
  }
  return map[level] || 'info'
}

onMounted(() => {
  modelStore.loadModels()
})
</script>

<template>
  <div class="assets">
    <!-- 头部工具栏 -->
    <div class="assets__header">
      <div class="assets__title">
        <el-icon><Files /></el-icon>
        <span>模型资产管理</span>
        <el-tag type="info" effect="dark" size="small">
          共 {{ filteredModels.length }} 个模型
        </el-tag>
      </div>
      <div class="assets__actions">
        <el-button type="primary" size="small">
          <el-icon><Plus /></el-icon>
          <span>导入模型</span>
        </el-button>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="assets__filters">
      <el-input
        v-model="searchText"
        placeholder="搜索模型名称或描述..."
        size="small"
        clearable
        style="width: 300px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select v-model="filterForm" size="small" style="width: 140px">
        <el-option
          v-for="opt in formOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>

      <el-select v-model="filterLevel" size="small" style="width: 140px">
        <el-option
          v-for="opt in levelOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
    </div>

    <!-- 模型列表 -->
    <div class="assets__list">
      <el-table
        :data="filteredModels"
        style="width: 100%"
        :row-class-name="'assets__table-row'"
      >
        <el-table-column prop="name" label="模型名称" min-width="180">
          <template #default="{ row }">
            <div class="assets__model-name">
              <el-icon class="assets__model-icon"><Box /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />

        <el-table-column prop="form" label="形态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getFormTagType(row.form)" effect="dark" size="small">
              {{ getFormText(row.form) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="level" label="成熟度" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.level)" effect="dark" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="version" label="版本" width="100" align="center">
          <template #default="{ row }">
            <span class="assets__version">v{{ row.version }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="accuracy" label="准确率" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.accuracy" class="assets__accuracy">
              {{ (row.accuracy * 100).toFixed(1) }}%
            </span>
            <span v-else class="assets__na">-</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="primary" link size="small">使用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.assets {
  @include flex-column;
  height: 100%;
  padding: $spacing-lg;
  background: $bg-primary;

  // 头部
  &__header {
    @include flex-between;
    margin-bottom: $spacing-lg;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-family: $font-mono;
    font-size: 16px;
    color: $text-primary;

    .el-icon {
      color: $tech-blue;
    }
  }

  // 筛选栏
  &__filters {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  // 列表
  &__list {
    flex: 1;
    overflow: hidden;
    @include tech-card;
    padding: $spacing-md;
  }

  &__model-name {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-family: $font-mono;
    font-weight: 500;
  }

  &__model-icon {
    color: $tech-blue;
  }

  &__version {
    font-family: $font-mono;
    color: $text-secondary;
  }

  &__accuracy {
    font-family: $font-mono;
    color: $status-green;
  }

  &__na {
    color: $text-disabled;
  }

  :deep(.assets__table-row) {
    background: transparent;

    &:hover > td {
      background: $bg-tertiary;
    }
  }
}
</style>
