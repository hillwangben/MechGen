// 模型状态管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ModelAsset,
  CollisionRule,
  SearchResult,
  CollisionResult
} from '@/types/model'
import { mockModels, mockCollisionRules } from '@/mock/data'

export const useModelStore = defineStore('model', () => {
  // 状态
  const modelList = ref<ModelAsset[]>([])
  const collisionRules = ref<CollisionRule[]>([])
  const selectedModels = ref<string[]>([])
  const searchResult = ref<SearchResult | null>(null)
  const collisionResult = ref<CollisionResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const modelCount = computed(() => modelList.value.length)

  const selectedModelObjects = computed(() => {
    return modelList.value.filter(m => selectedModels.value.includes(m.id))
  })

  const modelsByForm = computed(() => {
    const grouped: Record<string, ModelAsset[]> = {
      basic: [],
      scene: [],
      composite: []
    }
    modelList.value.forEach(model => {
      grouped[model.form].push(model)
    })
    return grouped
  })

  // 加载模型列表
  const loadModels = async () => {
    loading.value = true
    error.value = null
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500))
      modelList.value = mockModels
    } catch (err) {
      error.value = '加载模型列表失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 加载碰撞规则
  const loadCollisionRules = async () => {
    loading.value = true
    error.value = null
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 300))
      collisionRules.value = mockCollisionRules
    } catch (err) {
      error.value = '加载碰撞规则失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 搜索模型
  const searchModels = async (query: string, scene?: string) => {
    loading.value = true
    error.value = null
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 800))
      // 简单的本地搜索逻辑
      const filtered = modelList.value.filter(model => {
        const matchesQuery = model.name.toLowerCase().includes(query.toLowerCase()) ||
          model.description.toLowerCase().includes(query.toLowerCase())
        const matchesScene = !scene || model.tags.includes(scene)
        return matchesQuery && matchesScene
      })

      searchResult.value = {
        models: filtered,
        matched: filtered.length > 0,
        recommendation: filtered.length > 0
          ? `找到 ${filtered.length} 个匹配模型`
          : '未找到匹配模型，建议从基础模型开始训练'
      }
    } catch (err) {
      error.value = '搜索模型失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 选择/取消选择模型
  const toggleModelSelection = (modelId: string) => {
    const index = selectedModels.value.indexOf(modelId)
    if (index === -1) {
      selectedModels.value.push(modelId)
    } else {
      selectedModels.value.splice(index, 1)
    }
  }

  // 清空选择
  const clearSelection = () => {
    selectedModels.value = []
  }

  // 执行碰撞
  const runCollision = async (scenario: string) => {
    if (selectedModels.value.length < 2) {
      error.value = '请选择至少两个模型进行碰撞'
      return
    }

    loading.value = true
    error.value = null
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      collisionResult.value = {
        id: `COL-${Date.now()}`,
        requestId: `REQ-${Date.now()}`,
        status: 'completed',
        findings: [
          {
            id: `F-${Date.now()}`,
            description: '发现潜在关联模式',
            confidence: 0.85,
            relatedModels: selectedModels.value,
            evidence: ['模型 A 输出与模型 B 输出存在时间相关性']
          }
        ],
        rules: [],
        createdAt: new Date().toISOString()
      }
    } catch (err) {
      error.value = '执行碰撞失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    modelList,
    collisionRules,
    selectedModels,
    searchResult,
    collisionResult,
    loading,
    error,

    // 计算属性
    modelCount,
    selectedModelObjects,
    modelsByForm,

    // 方法
    loadModels,
    loadCollisionRules,
    searchModels,
    toggleModelSelection,
    clearSelection,
    runCollision
  }
})
