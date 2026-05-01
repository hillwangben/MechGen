<script setup lang="ts">
// 模型画布组件 - 决策树流程布局
// Shift + 左键多选，右键菜单创建框，Del 删除
import { ref, reactive, onMounted, onUnmounted, nextTick, markRaw } from 'vue'
import { Graph, Node, Selection } from '@antv/x6'

const emit = defineEmits<{
  (e: 'frame-click', type: 'optimize' | 'collide', data: any): void
}>()

const containerRef = ref<HTMLDivElement>() // 画布外层容器
const x6ContainerRef = ref<HTMLDivElement>()  // X6 专用子容器，避免 snapshoot 移除 Vue 元素
let graph: Graph | null = null

// ========== 任务ID计数器 ==========
let taskIdCounter = 1
const generateTaskId = () => `TASK-${Date.now()}-${taskIdCounter++}`

// ========== 右键菜单状态 ==========
const ctxMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  targets: [] as Node[]
})

const showCtxMenu = (x: number, y: number, targets: Node[]) => {
  ctxMenu.visible = true
  ctxMenu.x = x
  ctxMenu.y = y
  // markRaw 防止 Vue 深度代理 X6 Node 对象（含循环引用/内部属性，reactive 会导致 __vnode 错误）
  ctxMenu.targets = targets.map(n => markRaw(n))
}

const hideCtxMenu = () => { ctxMenu.visible = false }

// ========== 框架覆盖层数据 ==========
const frameOverlays = ref<Array<{
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  title: string
  outputLabel: string
  frameType: 'optimize' | 'collide'
}>>([])

// ========== 常量 ==========
const CIRCLE_SIZE = 50
const CIRCLE_GAP = 16
const FRAME_PAD_X = 20
const HEADER_H = 30
const OUTPUT_H = 26
const MODELS_PAD_Y = 10

const COLOR = {
  basic: '#00f0ff',
  generated: '#ff8c00',
  optimize: '#00d4ff',
  collide: '#ff3860',
  edge: '#006680',
} as const

// ========== 框架尺寸计算 ==========
const calcFrameSize = (modelCount: number) => {
  const cols = Math.min(modelCount, 2)
  const rows = Math.ceil(modelCount / 2)
  const width = FRAME_PAD_X * 2 + cols * CIRCLE_SIZE + (cols - 1) * CIRCLE_GAP
  const height = HEADER_H + MODELS_PAD_Y * 2 + rows * CIRCLE_SIZE + (rows - 1) * CIRCLE_GAP + OUTPUT_H
  return { width, height, rows, cols }
}

// ========== 同步框架覆盖层位置 ==========
const syncFrameOverlays = () => {
  if (!graph || !containerRef.value) return

  const zoom = graph.zoom()
  const scale = graph.scale()
  const translate = graph.translate()

  frameOverlays.value = frameOverlays.value.map(frame => {
    const cell = graph!.getCellById(frame.id)
    if (!cell || !cell.isNode()) return frame

    const node = cell as Node
    const pos = node.getPosition()
    const size = node.getSize()

    return {
      ...frame,
      x: pos.x * scale.sx + translate.tx,
      y: pos.y * scale.sy + translate.ty,
      width: size.width * scale.sx,
      height: size.height * scale.sy
    }
  })
}

// ========== 初始化画布 ==========
const initGraph = () => {
  if (!x6ContainerRef.value) return

  // 注册独立模型圆形节点
  Graph.registerNode('model-circle', {
    inherit: 'circle',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    attrs: {
      body: {
        fill: 'transparent',
        stroke: COLOR.basic,
        strokeWidth: 2
      },
      label: {
        fill: '#e0e6ff',
        fontSize: 9,
        fontFamily: 'JetBrains Mono, monospace',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle'
      }
    }
  })

  // 注册生成模型圆形节点
  Graph.registerNode('model-circle-generated', {
    inherit: 'circle',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    attrs: {
      body: {
        fill: 'rgba(255, 140, 0, 0.15)',
        stroke: COLOR.generated,
        strokeWidth: 2,
        strokeDasharray: '5 3'
      },
      label: {
        fill: '#e0e6ff',
        fontSize: 9,
        fontFamily: 'JetBrains Mono, monospace',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle'
      }
    }
  })

  graph = new Graph({
    container: x6ContainerRef.value,
    width: x6ContainerRef.value.offsetWidth,
    height: x6ContainerRef.value.offsetHeight,
    background: { color: '#0a0e27' },
    grid: { visible: true, type: 'dot', size: 20, args: { color: 'rgba(0, 212, 255, 0.05)', thickness: 1 } },
    mousewheel: { enabled: true, minScale: 0.3, maxScale: 2.5, factor: 1.1 },
    panning: { enabled: true, eventTypes: ['leftMouseDown'] },
    connecting: { snap: true, allowBlank: false, allowMulti: true, highlight: true, connector: 'normal', router: 'normal' }
  })

  // 安装 Selection 插件 — 启用多选、选中样式、右键菜单功能
  graph.use(new Selection({
    enabled: true,
    multiple: true,
    rubberband: false,
    movable: true,
    showNodeSelectionBox: true
  }))

  // 监听画布变化，同步框架覆盖层位置
  graph.on('scale', syncFrameOverlays)
  graph.on('translate', syncFrameOverlays)
  graph.on('node:moved', syncFrameOverlays)
  graph.on('node:added', syncFrameOverlays)

  // 框架点击 → 跳转工作台
  graph.on('node:click', ({ node }) => {
    const d = node.getData<{ frameType?: string }>()
    if (d?.frameType) {
      emit('frame-click', d.frameType === 'optimize' ? 'optimize' : 'collide', d)
    }
  })

  // Shift + 左键：多选/取消选择模型节点
  graph.on('node:click', ({ node, e }) => {
    const shape = node.shape
    if (shape !== 'model-circle' && shape !== 'model-circle-generated') return

    if (e.shiftKey) {
      const selected = graph!.getSelectedCells()
        .filter(c => c.isNode() && (c.shape === 'model-circle' || c.shape === 'model-circle-generated')) as Node[]

      if (selected.map(s => s.id).includes(node.id)) {
        graph!.unselect(node)
      } else {
        graph!.select([...selected, node])
      }
    }
  })

  // 右键菜单：在画布任意位置右键 → 有选中模型时弹出菜单
  // 交互流程：左键单击选中模型 → Shift+左键多选 → 右键任意位置弹出菜单
  const handleCanvasContextMenu = (e: MouseEvent) => {
    e.preventDefault() // 阻止浏览器默认右键菜单
    const selectedModels = graph!.getSelectedCells()
      .filter((c: any) => c.isNode() && (c.shape === 'model-circle' || c.shape === 'model-circle-generated')) as Node[]
    if (selectedModels.length > 0) {
      showCtxMenu(e.clientX, e.clientY, selectedModels)
    } else {
      hideCtxMenu()
    }
  }
  // 捕获阶段监听：在 X6 之前拦截右键事件，确保菜单可靠弹出
  containerRef.value?.addEventListener('contextmenu', handleCanvasContextMenu, true)

  // 左键点击空白处关闭菜单
  graph.on('blank:click', () => hideCtxMenu())

  // 选中模型节点 → 实心色
  graph.on('node:selected', ({ node }) => {
    const shape = node.shape
    if (shape === 'model-circle') {
      node.setAttrs({ body: { fill: 'rgba(0, 240, 255, 0.35)', strokeWidth: 3 } })
    } else if (shape === 'model-circle-generated') {
      node.setAttrs({ body: { fill: 'rgba(255, 140, 0, 0.40)', strokeWidth: 3 } })
    }
  })

  // 取消选中模型节点 → 恢复透明
  graph.on('node:unselected', ({ node }) => {
    const shape = node.shape
    if (shape === 'model-circle') {
      node.setAttrs({ body: { fill: 'transparent', strokeWidth: 2 } })
    } else if (shape === 'model-circle-generated') {
      node.setAttrs({ body: { fill: 'rgba(255, 140, 0, 0.15)', strokeWidth: 2 } })
    }
  })

  // 悬浮光标
  graph.on('node:mouseenter', ({ node }) => {
    if (node.getData<{ frameType?: string }>()?.frameType) {
      document.body.style.cursor = 'pointer'
    }
  })
  graph.on('node:mouseleave', ({ node }) => {
    if (node.getData<{ frameType?: string }>()?.frameType) {
      document.body.style.cursor = ''
    }
  })

  // 键盘事件 - Del 删除
  document.addEventListener('keydown', handleKeyDown)

  addDemoTree()
  setupDragDrop()
}

// ========== 键盘事件处理 ==========
const handleKeyDown = (e: KeyboardEvent) => {
  if (!graph) return

  if (e.key === 'Delete' || e.key === 'Backspace') {
    // 防止在输入框中误删
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

    const selected = graph.getSelectedCells()
    if (selected.length === 0) return

    const removedFrameIds = new Set<string>()

    selected.forEach(cell => {
      if (cell.isNode()) {
        const node = cell as Node
        // 如果是框架节点，先获取所有嵌入的子模型节点并一并删除
        const children = node.getChildren()
        children?.forEach((child: any) => {
          if (child.isNode()) {
            // 移除子节点的相关边
            graph!.getConnectedEdges(child).forEach((edge: any) => graph!.removeCell(edge.id))
            graph!.removeCell(child.id)
          }
        })
        // 记录要移除的框架覆盖层
        if (node.getData<{ frameType?: string }>()?.frameType) {
          removedFrameIds.add(node.id)
        }
        // 移除该节点的相关边
        graph!.getConnectedEdges(node).forEach((edge: any) => graph!.removeCell(edge.id))
      }
      graph!.removeCell(cell.id)
    })

    // 移除对应的框架覆盖层
    if (removedFrameIds.size > 0) {
      frameOverlays.value = frameOverlays.value.filter(f => !removedFrameIds.has(f.id))
    }

    syncFrameOverlays()
    hideCtxMenu()
  }
}

// ========== 独立模型圆形节点 ==========
// 返回创建的节点引用，供 embed 使用
const addModelNode = (x: number, y: number, name: string, generated = false) => {
  if (!graph) return null
  return graph.addNode({
    x, y,
    shape: generated ? 'model-circle-generated' : 'model-circle',
    zIndex: 10,
    attrs: { label: { text: name } },
    data: { id: `model-${Date.now()}`, name, generated }
  })
}

// ========== 创建框架节点 ==========
// 框架作为父节点，模型节点通过 embed() 嵌入，拖动框架时模型自动跟随
const addFrameNode = (
  x: number, y: number,
  opts: {
    frameType: 'optimize' | 'collide'
    title: string
    outputLabel: string
    models: Array<{ id: string; name: string }>
  }
) => {
  if (!graph) return null

  const { width, height } = calcFrameSize(opts.models.length)
  const color = opts.frameType === 'optimize' ? COLOR.optimize : COLOR.collide
  const taskId = generateTaskId()
  // 优先使用传入的人为名称，回退到自动生成
  const title = opts.title || (opts.frameType === 'optimize' ? `优化-${taskId}` : `碰撞-${taskId}`)

  // 创建框架背景矩形（在下层）
  const frameNode = graph.addNode({
    x, y, width, height,
    shape: 'rect',
    zIndex: 1,
    attrs: {
      body: {
        fill: '#0a0e27',
        stroke: color,
        strokeWidth: 2,
        strokeDasharray: '6 3',
        rx: 6,
        ry: 6
      }
    },
    data: {
      frameType: opts.frameType,
      models: opts.models,
      title,
      outputLabel: opts.outputLabel,
      taskId
    }
  })

  // 添加圆形模型节点并嵌入框架
  const cols = Math.min(opts.models.length, 2)
  const contentWidth = cols * CIRCLE_SIZE + (cols - 1) * CIRCLE_GAP
  const startX = (width - contentWidth) / 2
  const startY = HEADER_H + MODELS_PAD_Y

  opts.models.forEach((model, index) => {
    const row = Math.floor(index / 2)
    const col = index % 2
    const circleX = x + startX + col * (CIRCLE_SIZE + CIRCLE_GAP)
    const circleY = y + startY + row * (CIRCLE_SIZE + CIRCLE_GAP)
    const modelNode = addModelNode(circleX, circleY, model.name, opts.frameType === 'collide')
    if (modelNode) {
      frameNode.embed(modelNode)  // 模型嵌入框架，拖动框架时自动跟随
    }
  })

  // 添加框架覆盖层数据
  frameOverlays.value.push({
    id: frameNode.id,
    x,
    y,
    width,
    height,
    color,
    title,
    outputLabel: opts.outputLabel,
    frameType: opts.frameType
  })

  nextTick(() => syncFrameOverlays())

  return frameNode
}

// ========== 直线连线 ==========
const addEdge = (sourceId: string, targetId: string, label?: string) => {
  if (!graph) return
  graph.addEdge({
    source: { cell: sourceId },
    target: { cell: targetId },
    router: 'normal',
    connector: 'normal',
    attrs: {
      line: {
        stroke: COLOR.edge,
        strokeWidth: 2,
        targetMarker: { name: 'classic', width: 10, height: 7, fill: COLOR.edge }
      }
    },
    labels: label ? [{
      attrs: {
        label: {
          text: label,
          fill: '#8890b5',
          fontSize: 10,
          fontFamily: 'JetBrains Mono, monospace'
        },
        rect: {
          fill: '#0a0e27',
          stroke: COLOR.edge,
          strokeWidth: 1,
          rx: 3,
          ry: 3
        }
      },
      position: { distance: 0.5 }
    }] : undefined
  })
}

// ========== 右键菜单：创建优化框 ==========
const createOptimizeFrame = () => {
  if (ctxMenu.targets.length === 0) return

  const models = ctxMenu.targets.map(n => ({
    id: n.getData<{ id: string }>()?.id || `model-${Date.now()}`,
    name: n.getData<{ name: string }>()?.name || '未命名'
  }))

  // 用模型名称拼接人为名称
  const title = models.map(m => m.name).join(' + ')

  // 计算框架居中位置
  const avgX = ctxMenu.targets.reduce((s, n) => s + n.getPosition().x, 0) / ctxMenu.targets.length
  const avgY = ctxMenu.targets.reduce((s, n) => s + n.getPosition().y, 0) / ctxMenu.targets.length

  // 获取并移除边
  ctxMenu.targets.forEach((n: any) => {
    graph!.getConnectedEdges(n).forEach((e: any) => {
      graph!.removeCell(e.id)
    })
  })

  // 移除选中的模型节点
  ctxMenu.targets.forEach((n: any) => graph!.removeCell(n.id))

  // 添加框架
  const frameSize = calcFrameSize(models.length)
  addFrameNode(avgX - frameSize.width / 2, avgY - frameSize.height / 2, {
    frameType: 'optimize',
    title,
    outputLabel: '→ 输出优化模型',
    models
  })

  hideCtxMenu()
}

// ========== 右键菜单：创建碰撞框 ==========
const createCollideFrame = () => {
  if (ctxMenu.targets.length === 0) return

  const models = ctxMenu.targets.map(n => ({
    id: n.getData<{ id: string }>()?.id || `model-${Date.now()}`,
    name: n.getData<{ name: string }>()?.name || '未命名'
  }))

  // 用模型名称拼接人为名称
  const title = models.map(m => m.name).join(' + ')

  const avgX = ctxMenu.targets.reduce((s, n) => s + n.getPosition().x, 0) / ctxMenu.targets.length
  const avgY = ctxMenu.targets.reduce((s, n) => s + n.getPosition().y, 0) / ctxMenu.targets.length

  // 获取并移除边
  ctxMenu.targets.forEach((n: any) => {
    graph!.getConnectedEdges(n).forEach((e: any) => {
      graph!.removeCell(e.id)
    })
  })

  // 移除模型节点
  ctxMenu.targets.forEach((n: any) => graph!.removeCell(n.id))

  // 添加框架
  const frameSize = calcFrameSize(models.length)
  addFrameNode(avgX - frameSize.width / 2, avgY - frameSize.height / 2, {
    frameType: 'collide',
    title,
    outputLabel: '→ 输出碰撞新模型',
    models
  })

  hideCtxMenu()
}

// ========== 示例决策树 ==========
const addDemoTree = () => {
  if (!graph) return
  const cx = 400
  const gapX = 340

  // 框架1 - 优化框：目标检测 + 文本理解
  const frame1 = addFrameNode(cx - gapX, 40, {
    frameType: 'optimize',
    title: '目标检测 + 文本理解',
    outputLabel: '→ 输出优化模型 A',
    models: [
      { id: 'm1', name: '目标检测' },
      { id: 'm2', name: '文本理解' }
    ]
  })

  // 框架2 - 优化框：文本理解 + 特征提取
  const frame2 = addFrameNode(cx + gapX - 140, 40, {
    frameType: 'optimize',
    title: '文本理解 + 特征提取',
    outputLabel: '→ 输出优化模型 B',
    models: [
      { id: 'm3', name: '文本理解' },
      { id: 'm4', name: '特征提取' }
    ]
  })

  // 框架3 - 碰撞框：优化产物A + 优化产物B 碰撞
  const frame3 = addFrameNode(cx - 80, 240, {
    frameType: 'collide',
    title: '优化模型A + 优化模型B',
    outputLabel: '→ 输出碰撞新模型',
    models: [
      { id: 'm5', name: '优化模型A' },
      { id: 'm6', name: '优化模型B' }
    ]
  })

  // 结果模型节点
  const resultNode = addModelNode(cx - 30, 430, '碰撞新模型', true)

  // 连线：优化框A → 碰撞框
  if (frame1 && frame3) {
    addEdge(frame1.id, frame3.id, '优化产物')
  }
  // 连线：优化框B → 碰撞框
  if (frame2 && frame3) {
    addEdge(frame2.id, frame3.id, '优化产物')
  }
  // 连线：碰撞框 → 结果模型
  if (frame3 && resultNode) {
    addEdge(frame3.id, resultNode.id, '碰撞生成')
  }

  graph.zoomToFit({ padding: 40, maxScale: 1 })
}

// ========== 拖放：创建独立模型节点 ==========
const setupDragDrop = () => {
  if (!containerRef.value) return
  const c = containerRef.value
  c.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'move'
  })
  c.addEventListener('drop', (e) => {
    e.preventDefault()
    if (!graph || !e.dataTransfer) return
    const data = e.dataTransfer.getData('application/vueflow')
    if (!data) return
    const nd = JSON.parse(data)
    const gpos = graph.clientToLocal(e.clientX, e.clientY)
    addModelNode(gpos.x - CIRCLE_SIZE / 2, gpos.y - CIRCLE_SIZE / 2, nd.name || '模型')
  })
}

const handleResize = () => {
  if (!graph || !x6ContainerRef.value) return
  graph.resize(x6ContainerRef.value.offsetWidth, x6ContainerRef.value.offsetHeight)
}

onMounted(() => {
  initGraph()
  window.addEventListener('resize', handleResize)
  // 点击画布容器外部时关闭菜单
  if (containerRef.value) {
    containerRef.value.addEventListener('click', (e: MouseEvent) => {
      const menu = document.querySelector('.model-canvas__ctxmenu')
      if (menu && !menu.contains(e.target as globalThis.Node)) {
        hideCtxMenu()
      }
    })
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeyDown)
  graph?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="model-canvas">
    <!-- X6 专用子容器 — 避免 X6 snapshoot 移除 Vue 管理的 DOM 元素 -->
    <div ref="x6ContainerRef" class="model-canvas__x6"></div>
    <!-- 框架覆盖层 -->
    <div
      v-for="frame in frameOverlays"
      :key="frame.id"
      class="model-canvas__frame-overlay"
      :style="{
        left: frame.x + 'px',
        top: frame.y + 'px',
        width: frame.width + 'px',
        height: frame.height + 'px',
        borderColor: frame.color
      }"
      @click.stop="emit('frame-click', frame.frameType, frame)"
    >
      <div
        class="model-canvas__frame-header"
        :style="{ backgroundColor: frame.color + '20', borderBottomColor: frame.color + '50', color: frame.color }"
      >
        {{ frame.title }}
      </div>
      <div class="model-canvas__frame-output" :style="{ backgroundColor: '#0a0e27', borderTopColor: frame.color + '40', color: '#00ff88' }">
        {{ frame.outputLabel }}
      </div>
    </div>

    <!-- 上下文菜单 — 内联渲染 -->
    <div
      v-if="ctxMenu.visible"
      class="model-canvas__ctxmenu"
      :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }"
      @click.stop
    >
        <div class="model-canvas__ctxmenu-title">
          已选 {{ ctxMenu.targets.length }} 个模型
        </div>
        <div class="model-canvas__ctxmenu-item" @click="createOptimizeFrame">
          <span class="model-canvas__ctxmenu-dot is-optimize"></span>
          创建优化框
        </div>
        <div class="model-canvas__ctxmenu-item" @click="createCollideFrame">
          <span class="model-canvas__ctxmenu-dot is-collide"></span>
          创建碰撞框
        </div>
      </div>

    <!-- 图例 -->
    <div class="model-canvas__legend">
      <div class="model-canvas__legend-title">图例</div>
      <div class="model-canvas__legend-items">
        <div class="model-canvas__legend-item">
          <span class="model-canvas__legend-shape is-model"></span>
          原始模型
        </div>
        <div class="model-canvas__legend-item">
          <span class="model-canvas__legend-shape is-generated"></span>
          生成模型
        </div>
        <div class="model-canvas__legend-item">
          <span class="model-canvas__legend-shape is-optimize-frame"></span>
          优化框
        </div>
        <div class="model-canvas__legend-item">
          <span class="model-canvas__legend-shape is-collide-frame"></span>
          碰撞框
        </div>
      </div>
      <div class="model-canvas__legend-hint">
        拖入模型 · Shift+左键多选 · 右键菜单 · Del删除
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.model-canvas {
  width: 100%;
  height: 100%;
  background: #0a0e27;
  position: relative;
  overflow: hidden;

  // X6 独立子容器 — 不对 Vue 元素进行 snapshoot
  &__x6 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  // 上下文菜单
  &__ctxmenu {
    position: fixed;
    z-index: 9999;
    min-width: 180px;
    background: rgba(17, 22, 51, 0.97);
    border: 1px solid #006680;
    border-radius: 4px;
    padding: 4px 0;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  &__ctxmenu-title {
    font-size: 11px;
    color: #8890b5;
    padding: 6px 12px;
    font-family: 'JetBrains Mono', monospace;
    border-bottom: 1px solid rgba(0, 106, 128, 0.3);
    margin-bottom: 2px;
  }

  &__ctxmenu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: #e0e6ff;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: rgba(0, 212, 255, 0.08);
    }
  }

  &__ctxmenu-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;

    &.is-optimize {
      background: #00d4ff;
    }

    &.is-collide {
      background: #ff3860;
    }
  }

  // 框架覆盖层
  &__frame-overlay {
    position: absolute;
    border: 2px dashed;
    border-radius: 6px;
    background: transparent; // 透明，让 X6 渲染的模型圆可见
    pointer-events: none;
    z-index: 5;
    box-sizing: border-box;
  }

  &__frame-header {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    font-family: 'JetBrains Mono', monospace;
    border-bottom: 1px solid;
    border-radius: 4px 4px 0 0;
    box-sizing: border-box;
  }

  &__frame-output {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    border-top: 1px solid;
    border-radius: 0 0 4px 4px;
    box-sizing: border-box;
  }

  &__legend {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
    @include glass;
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    min-width: 150px;
    z-index: 10;
    user-select: none;
  }

  &__legend-title {
    font-size: 11px;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
    font-family: $font-mono;
  }

  &__legend-items {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    margin-bottom: $spacing-sm;
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: 11px;
    color: $text-secondary;
  }

  &__legend-shape {
    flex-shrink: 0;

    &.is-model {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: transparent;
      border: 2px solid #00f0ff;
    }

    &.is-generated {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgba(255, 140, 0, 0.1);
      border: 2px dashed #ff8c00;
    }

    &.is-optimize-frame {
      width: 22px;
      height: 14px;
      background: rgba(0, 212, 255, 0.08);
      border: 2px dashed #00d4ff;
      border-radius: 2px;
    }

    &.is-collide-frame {
      width: 22px;
      height: 14px;
      background: rgba(255, 56, 96, 0.08);
      border: 2px dashed #ff3860;
      border-radius: 2px;
    }
  }

  &__legend-hint {
    margin-top: $spacing-sm;
    padding-top: $spacing-sm;
    border-top: 1px solid $border-color;
    font-size: 10px;
    color: $text-disabled;
    font-family: $font-mono;
    line-height: 1.4;
  }
}
</style>
