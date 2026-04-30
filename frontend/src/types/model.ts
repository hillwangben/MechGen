// 模型相关类型定义

// 模型成熟度等级
export type ModelLevel = 'L1' | 'L2' | 'L3' | 'L4'

// 模型形态
export type ModelForm = 'basic' | 'scene' | 'composite'

// 侦测阶段
export type DetectionPhase =
  | 'planning'
  | 'assembly'
  | 'procurement'
  | 'logistics'
  | 'preparation'

// 模型资产
export interface ModelAsset {
  id: string
  name: string
  description: string
  form: ModelForm
  level: ModelLevel
  detectionPhase: DetectionPhase
  version: string
  tags: string[]
  accuracy?: number
  latency?: number
  createdAt: string
  updatedAt: string
}

// 碰撞规则
export interface CollisionRule {
  id: string
  name: string
  description: string
  conditions: string[]
  conclusion: string
  confidence: number
  triggerConditions: string[]
  suggestedAction: string
  relatedModels: string[]
  createdAt: string
}

// 模型碰撞请求
export interface CollisionRequest {
  modelIds: string[]
  scenario: string
  constraints?: Record<string, unknown>
}

// 模型碰撞结果
export interface CollisionResult {
  id: string
  requestId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  findings: CollisionFinding[]
  rules: CollisionRule[]
  createdAt: string
}

// 碰撞发现
export interface CollisionFinding {
  id: string
  description: string
  confidence: number
  relatedModels: string[]
  evidence: string[]
}

// 检索请求
export interface SearchRequest {
  query: string
  scene?: string
  scenario?: string
  constraints?: Record<string, unknown>
}

// 检索结果
export interface SearchResult {
  models: ModelAsset[]
  matched: boolean
  recommendation?: string
  unmatchedReason?: string
}
