<template>
  <div class="c-debugger fh">
    <toolbar v-model:collapsed="collapsedSync" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Toolbar from './toolbar/index.vue'

export default defineComponent({
  components: {
    Toolbar
  },

  props: {
    // 是否收起debugger
    collapsed: { type: Boolean, default: true }
  },

  data() {
    return {
      collapsedSync: this.collapsed
    }
  },

  watch: {
    collapsed() {
      this.collapsedSync = this.collapsed
    },

    collapsedSync() {
      this.$emit('update:collapsed', this.collapsedSync)
    }
  }
})
</script>

<style lang="less" scoped>
.c-debugger {
  width: 100%;
}
</style>
