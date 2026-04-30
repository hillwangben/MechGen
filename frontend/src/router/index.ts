// 路由配置 - 反无技战法生成模块
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/workspace'
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: () => import('@/views/workspace/WorkspaceView.vue'),
    meta: {
      title: '统一工作空间',
      icon: 'Monitor'
    }
  },
  {
    path: '/training',
    name: 'Training',
    component: () => import('@/views/training/TrainingView.vue'),
    meta: {
      title: '模型训练工作台',
      icon: 'Cpu'
    }
  },
  {
    path: '/evaluation',
    name: 'Evaluation',
    component: () => import('@/views/evaluation/EvaluationView.vue'),
    meta: {
      title: '模型评估仪表盘',
      icon: 'DataLine'
    }
  },
  {
    path: '/assets',
    name: 'Assets',
    component: () => import('@/views/assets/AssetsView.vue'),
    meta: {
      title: '模型资产管理',
      icon: 'Files'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - 反无技战法生成模块`
  }
  next()
})

export default router
