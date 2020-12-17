<template>
  <div>
    <div>环境信息：</div>
    <div>Env Name: {{ envName }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import core from '@/core'

export default defineComponent({
  data() {
    return {
      envName: core.envName
    }
  }
})
</script>

<style lang="less" scoped></style>
