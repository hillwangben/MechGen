// 任务 API 服务 - Mock 实现
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task'
import { mockTasks } from '@/mock/data'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 获取任务列表
export const getTasks = async (): Promise<Task[]> => {
  await delay(500)
  return [...mockTasks]
}

// 获取单个任务
export const getTask = async (taskId: string): Promise<Task | null> => {
  await delay(300)
  return mockTasks.find(t => t.id === taskId) || null
}

// 创建任务
export const createTask = async (request: CreateTaskRequest): Promise<Task> => {
  await delay(500)
  const newTask: Task = {
    id: `TASK-${Date.now()}`,
    name: request.name,
    status: 'draft',
    currentPhase: 'created',
    phaseHistory: [],
    context: request.context,
    artifacts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  return newTask
}

// 更新任务
export const updateTask = async (taskId: string, request: UpdateTaskRequest): Promise<Task | null> => {
  await delay(300)
  const task = mockTasks.find(t => t.id === taskId)
  if (!task) return null

  return {
    ...task,
    ...request,
    context: request.context ? { ...task.context, ...request.context } : task.context,
    updatedAt: new Date().toISOString()
  }
}

// 删除任务
export const deleteTask = async (taskId: string): Promise<boolean> => {
  await delay(300)
  return mockTasks.some(t => t.id === taskId)
}
