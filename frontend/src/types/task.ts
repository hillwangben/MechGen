// 任务相关类型定义

// 任务状态枚举
export type TaskStatus = 'draft' | 'allocating' | 'optimizing' | 'colliding' | 'completed' | 'failed'

// 任务阶段枚举
export type TaskPhase = 'created' | 'allocation' | 'optimization' | 'collision' | 'completed'

// 任务上下文
export interface TaskContext {
  scene: string
  scenarioCategory: string
  constraints: Record<string, unknown>
}

// 阶段历史记录
export interface PhaseHistory {
  phase: TaskPhase
  timestamp: string
  result: unknown | null
  decision?: string
}

// 任务接口
export interface Task {
  id: string
  name: string
  status: TaskStatus
  currentPhase: TaskPhase
  phaseHistory: PhaseHistory[]
  context: TaskContext
  artifacts: string[]
  createdAt: string
  updatedAt: string
}

// 创建任务请求
export interface CreateTaskRequest {
  name: string
  context: TaskContext
}

// 更新任务请求
export interface UpdateTaskRequest {
  name?: string
  status?: TaskStatus
  currentPhase?: TaskPhase
  context?: Partial<TaskContext>
}
