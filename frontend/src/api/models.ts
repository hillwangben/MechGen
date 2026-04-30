// 模型 API 服务 - Mock 实现
import type {
  ModelAsset,
  SearchRequest,
  SearchResult,
  CollisionRequest,
  CollisionResult
} from '@/types/model'
import { mockModels, mockCollisionRules } from '@/mock/data'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 获取模型列表
export const getModels = async (): Promise<ModelAsset[]> => {
  await delay(500)
  return [...mockModels]
}

// 获取单个模型
export const getModel = async (modelId: string): Promise<ModelAsset | null> => {
  await delay(300)
  return mockModels.find(m => m.id === modelId) || null
}

// 搜索模型
export const searchModels = async (request: SearchRequest): Promise<SearchResult> => {
  await delay(800)

  const filtered = mockModels.filter(model => {
    const matchesQuery = !request.query ||
      model.name.toLowerCase().includes(request.query.toLowerCase()) ||
      model.description.toLowerCase().includes(request.query.toLowerCase())

    const matchesScene = !request.scene ||
      model.tags.includes(request.scene)

    return matchesQuery && matchesScene
  })

  return {
    models: filtered,
    matched: filtered.length > 0,
    recommendation: filtered.length > 0
      ? `找到 ${filtered.length} 个匹配模型`
      : '未找到匹配模型，建议从基础模型开始训练',
    unmatchedReason: filtered.length === 0
      ? '当前场景无匹配模型'
      : undefined
  }
}

// 获取碰撞规则
export const getCollisionRules = async () => {
  await delay(300)
  return [...mockCollisionRules]
}

// 执行模型碰撞
export const runCollision = async (request: CollisionRequest): Promise<CollisionResult> => {
  await delay(2000)

  return {
    id: `COL-${Date.now()}`,
    requestId: `REQ-${Date.now()}`,
    status: 'completed',
    findings: [
      {
        id: `F-${Date.now()}-1`,
        description: '发现潜在关联模式',
        confidence: 0.85,
        relatedModels: request.modelIds,
        evidence: ['模型输出存在时间相关性', '空间分布呈现聚集特征']
      },
      {
        id: `F-${Date.now()}-2`,
        description: '检测到异常行为序列',
        confidence: 0.72,
        relatedModels: request.modelIds.slice(0, 2),
        evidence: ['行为序列符合预设模式']
      }
    ],
    rules: mockCollisionRules.filter(r =>
      r.relatedModels.some(m => request.modelIds.includes(m))
    ),
    createdAt: new Date().toISOString()
  }
}
