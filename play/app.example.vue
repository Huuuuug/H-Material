<template>
  <div class="playground">
    <h-button type="default">Default</h-button>
    <h-button type="primary">Primary</h-button>
    <h-button type="success">Success</h-button>
    <h-button type="warning">Warning</h-button>
    <h-button type="danger">Danger</h-button>
    <h-divider content-position="right" border-style="dashed"
      >kahsdkahdkah</h-divider
    >
    <h-button class="btn" type="info" @click="changeStatus(true)"
      >Info</h-button
    >
    <h-icon>
      <Edit />
    </h-icon>
    <h-icon size="30">
      <Plus />
    </h-icon>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { HButton, HDivider, HIcon } from '@h-material/components'
import { Edit, Plus } from '@element-plus/icons-vue'

const isShow = ref(false)

const changeStatus = (status: boolean) => {
  isShow.value = status
}
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
  display: flex;
  flex-direction: column;
  /* background-color: black; */

  img {
    width: 1500px;
    height: 500px;
    margin-top: 20px;
  }
}
</style>
