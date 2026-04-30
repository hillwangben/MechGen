// 任务状态管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStatus, CreateTaskRequest } from '@/types/task'
import { mockTasks } from '@/mock/data'

export const useTaskStore = defineStore('task', () => {
  // 状态
  const currentTask = ref<Task | null>(null)
  const taskList = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const taskCount = computed(() => taskList.value.length)

  const tasksByStatus = computed(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      draft: [],
      allocating: [],
      optimizing: [],
      colliding: [],
      completed: [],
      failed: []
    }
    taskList.value.forEach(task => {
      grouped[task.status].push(task)
    })
    return grouped
  })

  // 加载任务列表
  const loadTasks = async () => {
    loading.value = true
    error.value = null
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500))
      taskList.value = mockTasks
    } catch (err) {
      error.value = '加载任务列表失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 加载单个任务
  const loadTask = async (taskId: string) => {
    loading.value = true
    error.value = null
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 300))
      const task = mockTasks.find(t => t.id === taskId)
      if (task) {
        currentTask.value = task
      } else {
        error.value = '任务不存在'
      }
    } catch (err) {
      error.value = '加载任务失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 创建任务
  const createTask = async (request: CreateTaskRequest) => {
    loading.value = true
    error.value = null
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500))
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
      taskList.value.push(newTask)
      currentTask.value = newTask
      return newTask
    } catch (err) {
      error.value = '创建任务失败'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新任务状态
  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const task = taskList.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
      task.updatedAt = new Date().toISOString()
      if (currentTask.value?.id === taskId) {
        currentTask.value.status = status
      }
    }
  }

  return {
    // 状态
    currentTask,
    taskList,
    loading,
    error,

    // 计算属性
    taskCount,
    tasksByStatus,

    // 方法
    loadTasks,
    loadTask,
    createTask,
    updateTaskStatus
  }
})
