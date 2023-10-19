<template>
  <div class="example-showcase">
    <ClientOnly>
      <component :is="demo" v-if="demo" v-bind="$attrs" />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  file: {
    type: String,
    required: true,
  },
  demo: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.example-showcase {
  padding: 1.5rem;
  margin: 0.5px;
  background-color: #000000;
}
</style>
