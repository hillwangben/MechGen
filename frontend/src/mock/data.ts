// Mock 数据 - 反无技战法生成模块
import type { Task } from '@/types/task'
import type { ModelAsset, CollisionRule } from '@/types/model'

// Mock 任务数据
export const mockTasks: Task[] = [
  {
    id: 'TASK-2024-001',
    name: '城市反无人机场景分析',
    status: 'allocating',
    currentPhase: 'allocation',
    phaseHistory: [
      {
        phase: 'created',
        timestamp: '2024-03-21T10:00:00Z',
        result: null
      }
    ],
    context: {
      scene: '同行人识别',
      scenarioCategory: '人员集结类',
      constraints: {
        latency: '<100ms',
        accuracy: '>90%'
      }
    },
    artifacts: [],
    createdAt: '2024-03-21T10:00:00Z',
    updatedAt: '2024-03-21T10:00:00Z'
  },
  {
    id: 'TASK-2024-002',
    name: '装备筹措行为检测',
    status: 'optimizing',
    currentPhase: 'optimization',
    phaseHistory: [
      {
        phase: 'created',
        timestamp: '2024-03-20T14:30:00Z',
        result: null
      },
      {
        phase: 'allocation',
        timestamp: '2024-03-20T15:00:00Z',
        result: { matched: true, model: '整机采购识别模型 v1' }
      }
    ],
    context: {
      scene: '整机采购识别',
      scenarioCategory: '装备筹措类',
      constraints: {}
    },
    artifacts: ['model_asset://v1/purchase_detection_v1'],
    createdAt: '2024-03-20T14:30:00Z',
    updatedAt: '2024-03-21T09:00:00Z'
  },
  {
    id: 'TASK-2024-003',
    name: '物流运输风险评估',
    status: 'completed',
    currentPhase: 'completed',
    phaseHistory: [
      {
        phase: 'created',
        timestamp: '2024-03-19T08:00:00Z',
        result: null
      },
      {
        phase: 'allocation',
        timestamp: '2024-03-19T08:30:00Z',
        result: { matched: false }
      },
      {
        phase: 'optimization',
        timestamp: '2024-03-19T09:00:00Z',
        result: { success: true }
      },
      {
        phase: 'collision',
        timestamp: '2024-03-19T11:00:00Z',
        result: { findings: 3 }
      }
    ],
    context: {
      scene: '无人机寄递',
      scenarioCategory: '物流运输类',
      constraints: {}
    },
    artifacts: [
      'model_asset://v2/drone_delivery_v2',
      'collision_rule://logistics_risk_001'
    ],
    createdAt: '2024-03-19T08:00:00Z',
    updatedAt: '2024-03-19T12:00:00Z'
  }
]

// Mock 模型数据
export const mockModels: ModelAsset[] = [
  // 基础模型
  {
    id: 'model-001',
    name: 'YOLOv8 目标检测',
    description: '通用目标检测基础模型，支持 80 类目标识别',
    form: 'basic',
    level: 'L4',
    detectionPhase: 'planning',
    version: '8.0',
    tags: ['目标检测', '通用'],
    accuracy: 0.89,
    latency: 25,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'model-002',
    name: 'ResNet50 特征提取',
    description: '深度残差网络，用于图像特征提取',
    form: 'basic',
    level: 'L4',
    detectionPhase: 'planning',
    version: '50.0',
    tags: ['特征提取', '图像'],
    accuracy: 0.92,
    latency: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'model-003',
    name: 'BERT 文本理解',
    description: '预训练语言模型，用于文本语义理解',
    form: 'basic',
    level: 'L4',
    detectionPhase: 'planning',
    version: '1.0',
    tags: ['NLP', '文本'],
    accuracy: 0.88,
    latency: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },

  // 场景模型
  {
    id: 'model-101',
    name: '同行人识别模型 v2',
    description: '识别可疑同行人员，基于轨迹和行为特征分析',
    form: 'scene',
    level: 'L3',
    detectionPhase: 'assembly',
    version: '2.0',
    tags: ['人员集结类', '同行人识别', '城市反无人机'],
    accuracy: 0.92,
    latency: 45,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z'
  },
  {
    id: 'model-102',
    name: '频繁通信关联模型 v1',
    description: '检测人员间异常频繁通信行为',
    form: 'scene',
    level: 'L2',
    detectionPhase: 'assembly',
    version: '1.0',
    tags: ['人员集结类', '通信关联'],
    accuracy: 0.85,
    latency: 30,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: 'model-103',
    name: '整机采购识别模型 v1',
    description: '识别可疑的无人机整机采购行为',
    form: 'scene',
    level: 'L2',
    detectionPhase: 'procurement',
    version: '1.0',
    tags: ['装备筹措类', '整机采购'],
    accuracy: 0.78,
    latency: 60,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-18T00:00:00Z'
  },
  {
    id: 'model-104',
    name: '涉机敏感言论模型 v1',
    description: '检测网络中涉及无人机的敏感言论',
    form: 'scene',
    level: 'L2',
    detectionPhase: 'planning',
    version: '1.0',
    tags: ['行动策划类', '涉机言论'],
    accuracy: 0.82,
    latency: 40,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-19T00:00:00Z'
  },
  {
    id: 'model-105',
    name: '携带无人机背包模型 v1',
    description: '识别携带无人机背包的可疑人员',
    form: 'scene',
    level: 'L2',
    detectionPhase: 'preparation',
    version: '1.0',
    tags: ['临期准备类', '背包检测'],
    accuracy: 0.80,
    latency: 35,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z'
  },

  // 组合模型
  {
    id: 'model-201',
    name: '人员集结综合研判模型',
    description: '融合同行人识别和通信关联的综合研判',
    form: 'composite',
    level: 'L2',
    detectionPhase: 'assembly',
    version: '1.0',
    tags: ['人员集结类', '综合研判'],
    accuracy: 0.88,
    latency: 80,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-21T00:00:00Z'
  }
]

// Mock 碰撞规则
export const mockCollisionRules: CollisionRule[] = [
  {
    id: 'rule-001',
    name: '同行+通信→高危',
    description: '同行人出现且存在频繁通信行为，判定为高危',
    conditions: ['同行人识别阳性', '频繁通信关联阳性'],
    conclusion: '高危人员集结',
    confidence: 0.85,
    triggerConditions: ['同行人数 >= 2', '通信频率 > 阈值'],
    suggestedAction: '重点监控，上报指挥中心',
    relatedModels: ['model-101', 'model-102'],
    createdAt: '2024-03-18T00:00:00Z'
  },
  {
    id: 'rule-002',
    name: '背包+遥控→准备',
    description: '检测到携带背包且手持遥控器，判定为临期准备',
    conditions: ['携带无人机背包阳性', '手持遥控器阳性'],
    conclusion: '临期准备阶段',
    confidence: 0.78,
    triggerConditions: ['背包检测置信度 > 0.7', '遥控器检测置信度 > 0.7'],
    suggestedAction: '持续跟踪，准备拦截',
    relatedModels: ['model-105'],
    createdAt: '2024-03-19T00:00:00Z'
  },
  {
    id: 'rule-003',
    name: '多车驻留→集结',
    description: '多辆车辆在重点区域异常驻留，判定为人员集结',
    conditions: ['车辆驻留时间 > 阈值', '驻留车辆数量 >= 3'],
    conclusion: '可疑人员集结',
    confidence: 0.72,
    triggerConditions: ['驻留时长 > 30分钟', '车辆间距 < 50米'],
    suggestedAction: '派遣人员现场核实',
    relatedModels: [],
    createdAt: '2024-03-20T00:00:00Z'
  }
]
