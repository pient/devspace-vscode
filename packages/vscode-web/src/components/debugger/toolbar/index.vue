<template>
  <div class="c-debugger-toolbar fh">
    <div class="toolbar-pin">
      <a-button
        class="pin-button"
        :class="{ pined: !collapsedSync }"
        size="small"
        @click="collapsedEvent"
      >
        <template v-slot:icon><PushpinOutlined /></template>
      </a-button>
    </div>
    <a-tabs v-show="!collapsedSync" class="toolbar-tabs fh" size="small" tab-position="top">
      <a-tab-pane key="console" tab="Console">
        <console />
      </a-tab-pane>
      <a-tab-pane key="apidoc" tab="YApi">
        <api-doc />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PushpinOutlined } from '@ant-design/icons-vue'
import Console from '../console/index.vue'
import ApiDoc from '../apidoc/index.vue'

export default defineComponent({
  components: {
    PushpinOutlined,
    Console,
    ApiDoc
  },

  props: {
    // 是否收起toolbar
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
  },

  methods: {
    collapsedEvent() {
      this.collapsedSync = !this.collapsedSync
    }
  }
})
</script>

<style lang="less" scoped>
.toolbar-pin {
  line-height: 28px;
  position: absolute;
  z-index: 9999;
  right: 0;
  top: 0;
  padding: 0 1px;

  .pin-button {
    opacity: 0.7;
    position: absolute;

    &.pined {
      opacity: 1;
      position: relative;

      ::v-deep(.anticon) {
        transform: rotate(-45deg);
      }
    }
  }
}

.ant-tabs.toolbar-tabs {
  & > ::v-deep(.ant-tabs-bar) {
    margin: 0;

    .ant-tabs-tab {
      padding: 5px;
      font-size: 12px;
      margin: 0 10px 0 0;
    }
  }

  & > ::v-deep(.ant-tabs-content) {
    height: calc(100% - 30px);

    & > .ant-tabs-tabpane {
      padding: 5px;
    }
  }
}
</style>
