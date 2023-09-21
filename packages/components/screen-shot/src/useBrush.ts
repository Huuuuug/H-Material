import { ref } from 'vue'

export const useBursh = (ctx: any) => {
  // 画笔状态 开启或者关闭
  const brushStatus = ref(false)
  // 线段起始点
  const originalPoint = ref<[number, number]>([0, 0])

  const getBrushStatus = () => brushStatus.value
  // 修改画笔状态
  const setBrushStatus = (status: boolean) => {
    brushStatus.value = status
  }
  return {
    originalPoint,
    setBrushStatus,
    getBrushStatus,
  }
}
