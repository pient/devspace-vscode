<template>
  <div class="c-debugger-apidoc fh">
    <api-list />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ApiList from './children/apiList.vue'

export default defineComponent({
  components: { ApiList },
  methods: {
    clickEvent(op: string) {
      switch (op) {
        case 'yapi':
          this.openYapi()
          break
      }
    },

    openYapi() {}
  }
})
</script>
