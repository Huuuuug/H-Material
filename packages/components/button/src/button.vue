<template>
  <button class="h-button" :class="styleClass">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { buttonProps } from './button'
defineOptions({
  name: 'HButton',
})

const props = defineProps(buttonProps)

const styleClass = computed(() => `h-button--${props.type}`)
</script>
