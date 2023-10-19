<template>
  <i :class="ns.b()" :style="style" v-bind="$attrs">
    <slot />
  </i>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@h-material/hooks'
import { addUnit, isUndefined } from '@h-material/utils'
import { iconProps } from './icon'
import type { CSSProperties } from 'vue'
defineOptions({
  name: 'HIcon',
  inheritAttrs: false,
})

const props = defineProps(iconProps)
const ns = useNamespace('icon')

const style = computed<CSSProperties>(() => {
  const { size, color } = props
  if (!size && !color) return {}

  return {
    fontSize: isUndefined(size) ? undefined : addUnit(size),
    '--color': color,
  }
})

// export default defineComponent({
//   name: 'HIcon',
//   props: iconProps,
//   setup(props) {
//     const style = computed(() => {
//       const { size, color } = props
//       if (!size && !color) return {}
//       return {
//         ...(props.size ? { 'font-size': `${props.size}px` } : {}),
//         ...(props.color ? { color: props.color } : {}),
//       }
//     })
//     return { style }
//   },
// })
</script>
