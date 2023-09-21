<template>
  <teleport to="body">
    <div v-show="isPanelShow" class="screen-shot-panel">
      <!--截图区域-->
      <canvas id="screenShotContainer" ref="screenShotContainer" />
      <!-- 工具栏 -->
      <div
        v-show="toolbarStatus"
        id="toolbar"
        ref="toolbarContainer"
        :style="{ left: toolLeft + 'px', top: toolTop + 'px' }"
      >
        <!-- 笔刷 -->
        <div class="toolbar-item brush" @click="handleToolbarClick('brush')" />
        <!-- 退出截图 -->
        <div class="toolbar-item close" @click="handleToolbarClick('close')" />
        <!-- 保存到剪切板 -->
        <div
          class="toolbar-item confirm"
          @click="handleToolbarClick('confirm')"
        />
        <!-- 下载图片 -->
        <div class="toolbar-item save" @click="handleToolbarClick('save')" />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import html2canvas from 'html2canvas'
import { useBursh } from './hooks/useBrush'
import { CTX_DEFAULT_ATTRIBUTES } from './constants'

import type { FourCornersPositon, PositionObj } from './types'

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])

let ctx: CanvasRenderingContext2D | null = null

// 画笔相关
const { originalPoint, setBrushStatus, getBrushStatus } = useBursh(ctx)

// 控制截图组件显示隐藏
const isPanelShow = ref(props.modelValue)
watch(
  () => props.modelValue,
  (val) => {
    isPanelShow.value = val
    if (!val) {
      clearCanvas()
    } else {
      init()
    }
  }
)

// 整体的canvas容器
const screenShotContainer = ref<HTMLCanvasElement | null>(null)
// 当前页面html转成的canvas容器
const htmlCanvasContainer = ref<HTMLCanvasElement | null>(null)
// 鼠标起始点位置信息
let mousePos: [number, number] = [0, 0]
// 工具栏是否显示
const toolbarStatus = ref<boolean>(false)
// toolbar容器
const toolbarContainer = ref<HTMLElement | null>(null)
// 裁剪框是否绘制完成
const isScreenShotPainted = ref<boolean>(false)

const toolLeft = ref<number>(0)
const toolTop = ref<number>(0)
// 用于产生图片的容器
const htmlImage = new Image()

// 裁剪区域的位置信息
let shotRectanglePos: PositionObj = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}
// 初始化canvas对象上下文
const initCtx = () => {
  if (!ctx) return
  ctx.lineWidth = CTX_DEFAULT_ATTRIBUTES.LINEWIDTH
  ctx.lineCap = CTX_DEFAULT_ATTRIBUTES.LINECAP
  ctx.strokeStyle = CTX_DEFAULT_ATTRIBUTES.STROKESTYLE
}
// 重置canvas对象上下文
const resetCtx = () => {
  if (!ctx) return
  ctx.fillStyle = CTX_DEFAULT_ATTRIBUTES.FILLSTYLE
}
// 退出时销毁画布所有的东西
const clearCanvas = () => {
  if (!ctx) return
  // 清除全部画布
  ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight)
  // 隐藏toolbar
  toolbarStatus.value = false
  // 设置截取框状态为false
  isScreenShotPainted.value = false
  // 恢复画笔状态
  setBrushStatus(false)
}

// 生成截图完整的画布
const generateCanvas = () => {
  if (screenShotContainer.value) {
    // 获取画布的context对象
    ctx = screenShotContainer.value.getContext('2d', {
      willReadFrequently: true,
    })
    const { innerWidth: width, innerHeight: height } = window
    screenShotContainer.value.width = width
    screenShotContainer.value.height = height
    // 将当前页面装换成的canvas数据绘制到整体的canvas上

    if (htmlCanvasContainer.value) {
      // 拿到当前页面html转换成canvas的图片 dataurl
      const dataURL = htmlCanvasContainer.value.toDataURL('png')
      htmlImage.src = dataURL

      htmlImage.onload = function () {
        ctx?.drawImage(htmlImage, 0, 0, width, height)
        drawMask(0, 0, width, height)
        initCtx()
      }
    }
  }
}

// 处理工具栏上的点击
const handleToolbarClick = (type: string) => {
  if (type === 'close') {
    // 退出截图
    emits('update:modelValue', false)
  } else if (type === 'confirm') {
    // 保存剪切板
    // 将裁剪范围内的canvas画布转换成base64图片并且保存到剪切板
    const pos = Object.values(shotRectanglePos)
    saveCanvasToImage(...(pos as [number, number, number, number]), true)
    emits('update:modelValue', false)
  } else if (type === 'save') {
    // 下载
    // 将裁剪范围内的canvas画布转换成base64图片并且下载
    const pos = Object.values(shotRectanglePos)
    saveCanvasToImage(...(pos as [number, number, number, number]), false)
    emits('update:modelValue', false)
  } else if (type === 'brush') {
    setBrushStatus(true)
  }
}
// 判断坐标是否在截图框内
const judgeIsInScreenShot = (x: number, y: number) => {
  const {
    x: rectX,
    y: rectY,
    width: rectWidth,
    height: rectHeight,
  } = shotRectanglePos
  // 截图框矩形四个角的坐标

  const pos: FourCornersPositon = {
    startX: rectX,
    startY: rectY,
    endX: rectX + rectWidth,
    endY: rectY + rectHeight,
  }
  if (rectWidth < 0) {
    pos.startX += rectWidth
    pos.endX = pos.startX - rectWidth
  }
  if (rectHeight < 0) {
    pos.startY += rectHeight
    pos.endY = pos.endY - rectHeight
  }
  if (x < pos.startX || x > pos.endX) return false
  if (y < pos.startY || y > pos.endY) return false
  return true
}

// 画线
const drawLine = (x: number, y: number) => {
  if (!ctx) return
  ctx.beginPath()
  ctx.moveTo(originalPoint.value[0], originalPoint.value[1])
  ctx.lineTo(x, y)
  ctx.stroke()
  originalPoint.value = [x, y]
}
// 画点
const drawPoint = (x: number, y: number) => {
  if (!ctx) return
  originalPoint.value = [x, y]
  ctx.globalCompositeOperation = 'source-atop'
  ctx.beginPath()
  ctx.arc(x, y, ctx.lineWidth / 2, 0, 2 * Math.PI, false)
  ctx.fill()
}

// 绘制工具栏toolbar
const generateToolbar = () => {
  if (toolbarStatus.value) return
  // 显示toolbar
  toolbarStatus.value = true
  // 计算toolbar 的位置
  const { width: rectWidth, height: rectHeight } = shotRectanglePos
  // 当截图框宽度高度小于0时候 需要重置鼠标初次点击坐标为左上角坐标
  if (rectWidth < 0) {
    mousePos[0] += rectWidth
  }
  if (rectHeight < 0) {
    mousePos[1] += rectHeight
  }

  nextTick(() => {
    const { clientWidth: toolbarW, clientHeight: toolbarH } =
      toolbarContainer.value!
    const toolbarX = mousePos[0] + Math.abs(rectWidth) / 2
    let toolbarY

    // toolbar默认显示在截图框下方 如果下方的位置超出屏幕范围 则显示到截图框上方
    const distanceBottom = mousePos[1] + Math.abs(rectHeight) + 20 + toolbarH
    if (distanceBottom > window.innerHeight) {
      toolbarY = mousePos[1] - 10 - toolbarH
    } else {
      toolbarY = mousePos[1] + Math.abs(rectHeight) + 10
    }
    toolLeft.value = toolbarX - toolbarW / 2
    toolTop.value = toolbarY
  })
}

// 绘制蒙层
const drawMask = (x: number, y: number, width: number, height: number) => {
  if (!ctx) return
  ctx.fillStyle = `rgba(0,0,0,0.5)`
  ctx.fillRect(0, 0, width, height)
}

// 绘制裁剪截图框
const drawScreenShot = (
  canvasWidth: number,
  canvasHeight: number,
  rectWidth: number,
  rectHeight: number
) => {
  if (!ctx) return
  ctx.globalCompositeOperation = 'destination-out'
  // ctx.fillStyle = '#eee'
  // 清除画布
  ctx.fillRect(...mousePos, rectWidth, rectHeight)
  ctx.globalCompositeOperation = 'destination-over'
  // 每次重新绘制裁剪框后需要将原始背景图片画上
  ctx.drawImage(htmlImage, 0, 0, canvasWidth, canvasHeight)
}
// 鼠标按下事件
const handleCanvasMouseDown = (e: MouseEvent) => {
  if (!judgeIsInScreenShot(e.offsetX, e.offsetY) && !getBrushStatus()) {
    isScreenShotPainted.value = false
  }
  if (isScreenShotPainted.value) {
    // TODO 裁剪框已经绘制完成了
    // 画笔模式打开
    if (getBrushStatus()) {
      // 判断鼠标点击的位置是否在截图框内

      if (!judgeIsInScreenShot(e.offsetX, e.offsetY)) return
      // 画笔模式重置ctx属性
      resetCtx()
      drawPoint(e.offsetX, e.offsetY)
    }
  } else {
    // 设置鼠标点击的初始位置
    mousePos = [e.offsetX, e.offsetY]
    // 鼠标按下之后 将toolbar隐藏
    toolbarStatus.value = false
  }

  // 绑定鼠标移动抬起事件
  screenShotContainer.value?.addEventListener(
    'mousemove',
    handleCanvasMouseMove,
    false
  )
  screenShotContainer.value?.addEventListener(
    'mouseup',
    handleCanvasMouseUp,
    false
  )
}
// 鼠标移动事件
const handleCanvasMouseMove = (e: MouseEvent) => {
  if (isScreenShotPainted.value) {
    // TODO 裁剪框已经绘制完成了
    // 画笔模式打开
    if (getBrushStatus()) {
      if (!judgeIsInScreenShot(e.offsetX, e.offsetY)) return
      drawLine(e.offsetX, e.offsetY)
    }
  } else {
    const endX = e.offsetX,
      endY = e.offsetY
    const [startX, startY] = mousePos
    const rectWidth = endX - startX
    const rectHeight = endY - startY

    // 当鼠标移动时 保存截取的图片位置信息与大小
    const pos: PositionObj = {
      x: startX,
      y: startY,
      width: rectWidth,
      height: rectHeight,
    }

    shotRectanglePos = { ...shotRectanglePos, ...pos }
    if (!ctx) return
    const { width, height } = screenShotContainer.value!
    // 清除canvans所有的内容
    ctx.clearRect(0, 0, width, height)
    drawMask(0, 0, width, height)
    drawScreenShot(width, height, rectWidth, rectHeight)
  }
}
// 鼠标抬起事件
const handleCanvasMouseUp = (e: MouseEvent) => {
  const can = screenShotContainer.value!
  // 第一次鼠标抬起 设置裁剪框绘制完成
  isScreenShotPainted.value = true
  // 当鼠标抬起显示toolbar
  generateToolbar()

  can.removeEventListener('mousemove', handleCanvasMouseMove, false)
  can.removeEventListener('mouseup', handleCanvasMouseUp, false)
}

// 获取canvas上下文对象，对高分屏进行修复
const getCanvas2dCtx = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) => {
  // 获取设备像素比
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const ctx = canvas.getContext('2d')
  // 对画布进行缩放处理
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
  return ctx
}

// 保存图片
const saveCanvasToImage = (
  startX: number,
  startY: number,
  width: number,
  height: number,
  keepClipboard: boolean // 是否保存到剪切板 false 直接下载图片
) => {
  // 获取设备像素比
  const dpr = window.devicePixelRatio || 1
  // 获取裁剪框区域图片信息
  // 获取裁剪框区域图片信息
  const data = ctx!.getImageData(
    startX * dpr,
    startY * dpr,
    width * dpr,
    height * dpr
  )
  // 创建canvas标签，用于存放裁剪区域的图片
  const canvas = document.createElement('canvas')
  // 获取裁剪框区域画布
  const shotCtx = getCanvas2dCtx(canvas, width, height)
  if (!shotCtx) return
  // 将图片放进裁剪框内
  shotCtx.putImageData(data, 0, 0)
  if (keepClipboard) {
    // 将图片自动添加至剪贴板中
    canvas?.toBlob(
      (blob) => {
        if (blob == null) return
        const Clipboard = window.ClipboardItem
        // 浏览器不支持Clipboard
        if (Clipboard == null) return canvas.toDataURL('png')
        const clipboardItem = new Clipboard({
          [blob.type]: blob,
        })
        navigator.clipboard?.write([clipboardItem]).then(() => {
          return '写入成功'
        })
      },
      'image/png',
      0.75
    )
  } else {
    const a = document.createElement('a')
    // 获取图片
    a.href = canvas.toDataURL('png')
    // 下载图片
    a.download = `${Date.now()}.png`
    a.click()
    a.remove()
  }
  canvas.remove()
}
// html转canvas
const htmlToCanvas = () => {
  if (!screenShotContainer.value) return
  // 获取视图大小
  const viewSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  const canvasDemo = document.createElement('canvas')
  canvasDemo.width = viewSize.width
  canvasDemo.height = viewSize.height
  html2canvas(document.body, {
    useCORS: true,
    proxy: undefined,
    canvas: canvasDemo,
  }).then((canvas) => {
    // 装载截图的dom为null则退出
    if (!screenShotContainer.value) return
    htmlCanvasContainer.value = canvas
    generateCanvas()
  })
}
// 绑定监听事件
const bindEvent = () => {
  screenShotContainer.value?.addEventListener(
    'mousedown',
    handleCanvasMouseDown,
    false
  )
}

const init = () => {
  htmlToCanvas()
  bindEvent()
}

// onMounted(() => {
//   init()
// })
</script>

<style scoped lang="scss" src="../style/screen-shot..scss"></style>
