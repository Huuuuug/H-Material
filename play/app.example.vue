<template>
  <div class="playground">
    <h-button type="default">Default</h-button>
    <h-button type="primary">Primary</h-button>
    <h-button type="success">Success</h-button>
    <h-button type="warning">Warning</h-button>
    <h-button type="danger">Danger</h-button>
    <h-button type="info">Info</h-button>
  </div>
</template>
<script lang="ts" setup>
import { HButton } from '@h-material/components'
</script>

<style lang="scss">
html,
body {
  margin: 0;
  pad: 0;
}
.playground {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
