import { ref } from 'vue'

export const useSceenShot = () => {
  // 截屏容器宽高
  const screenShotWidth = ref<number>(0)
  const screenShotHeight = ref<number>(0)

  // 获取截图容器宽高
  const getScreenShotWidth = () => {
    return screenShotWidth
  }

  const getScreenShotHeight = () => {
    return screenShotHeight
  }

  return {
    getScreenShotWidth,
    getScreenShotHeight,
  }
}
