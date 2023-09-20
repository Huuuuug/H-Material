<template>
  <teleport to="body">
    <div class="screen-shot-panel">
      <!--截图区域-->
      <canvas
        id="screenShotContainer"
        ref="screenShotContainer"
        :width="screenShotWidth"
        :height="screenShotHeight"
      />
      <!-- 工具栏 -->
      <div
        v-show="toolbarStatus"
        id="toolbar"
        ref="toolbarContainer"
        :style="{ left: toolLeft + 'px', top: toolTop + 'px' }"
      >
        <div class="toolbar-item close" />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import html2canvas from 'html2canvas'
import { useSceenShot } from './useScreenShot'

const { getScreenShotWidth, getScreenShotHeight } = useSceenShot()

const screenShotWidth = getScreenShotWidth()
const screenShotHeight = getScreenShotHeight()
// 整体的canvas容器
const screenShotContainer = ref<HTMLCanvasElement | null>(null)
// 当前页面html转成的canvas容器
const htmlCanvasContainer = ref<HTMLCanvasElement | null>(null)

let mousePos: [number, number] = [0, 0]
// 工具栏是否显示
const toolbarStatus = ref<boolean>(false)

const toolLeft = ref<number>(0)
const toolTop = ref<number>(0)

const htmlImage = new Image()

type PositionObj = {
  x: number
  y: number
  width: number
  height: number
}
let shotRectanglePos: PositionObj = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}

let ctx: CanvasRenderingContext2D | null = null

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
        // const { width, height } = htmlImage
        ctx?.drawImage(htmlImage, 0, 0, width, height)
        drawMask(0, 0, width, height)
      }
    }
  }
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
  ctx.fillStyle = '#000'
  ctx.fillRect(...mousePos, rectWidth, rectHeight)
  ctx.globalCompositeOperation = 'destination-over'
  // 每次重新绘制裁剪框后需要将原始背景图片画上
  ctx.drawImage(htmlImage, 0, 0, canvasWidth, canvasHeight)

  // 当鼠标抬起绘制完毕裁剪框时 生成toolbar
  // if()
  // toolbarStatus.value = true
  // toolLeft.value = 200
  // toolTop.value = 200
}
// 鼠标按下事件
const handleCanvasMouseDown = (e: MouseEvent) => {
  // 设置鼠标点击的初始位置
  mousePos = [e.offsetX, e.offsetY]
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

  if (ctx) {
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
  // save test
  const pos = Object.values(shotRectanglePos)
  saveCanvasToImage(...(pos as [number, number, number, number]))

  can.removeEventListener('mousemove', handleCanvasMouseMove, false)
  can.removeEventListener('mouseup', handleCanvasMouseUp, false)
}
// 保存图片
const saveCanvasToImage = (
  startX: number,
  startY: number,
  width: number,
  height: number
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
  canvas.width = width
  canvas.height = height
  // 获取裁剪框区域画布
  const shotCtx = canvas.getContext('2d')
  if (shotCtx) {
    // 将图片放进裁剪框内
    shotCtx.putImageData(data, 0, 0)
    const a = document.createElement('a')
    // 获取图片
    a.href = canvas.toDataURL('png')
    // 下载图片
    a.download = `${Date.now()}.png`
    // a.click()
    a.remove()
    canvas.remove()
  }
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

onMounted(() => {
  init()
})
</script>

<style scoped lang="scss" src="../style/screen-shot..scss"></style>
