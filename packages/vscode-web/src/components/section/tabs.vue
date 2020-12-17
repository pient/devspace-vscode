<template>
  <a-tabs
    :value="tabName"
    class="c-section-tabs"
    :class="{ center, 'full-page': fullPage }"
    v-bind="$attrs"
    @tab-click="tabClickEvent"
  >
    <a-tab-pane
      v-for="item in tabItems"
      :key="item.name"
      :label="tabLabelText(item)"
      :name="item.name"
      :disabled="item.disabled"
    >
      <slot v-bind="{ item }" />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    tabName: { type: String, default: '' },
    // name, label, tag
    tabItems: { type: Array, default: () => [] },
    // tab是否居中
    center: { type: Boolean, default: false }
  },

  model: {
    prop: 'tabName',
    value: 'input'
  },

  data() {
    return {}
  },

  methods: {
    // 获取tab Label 文字
    tabLabelText(item: any) {
      return item.tag ? `${item.label}(${item.tag})` : item.label
    },

    tabClickEvent(tab: any) {
      this.$emit('input', tab.name, this.tabName)
    }
  }
})
</script>

<style lang="less" scoped>
.c-section-tabs {
  &.center {
    & > ::v-deep(.ant-tabs-bar) {
      .ant-tabs-nav-scroll {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
