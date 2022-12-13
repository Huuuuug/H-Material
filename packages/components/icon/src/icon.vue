<template>
  <i class="h-icon" :style="style">
    <slot></slot>
  </i>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { iconProps } from "./icon";

export default defineComponent({
  name: "HIcon",
  props: iconProps,
  setup(props) {
    const style = computed(() => {
      const { size, color } = props;
      if (!size && !color) return {};
      return {
        ...(props.size ? { "font-size": props.size + "px" } : {}),
        ...(props.color ? { color: props.color } : {}),
      };
    });
    return { style };
  },
});
</script>
