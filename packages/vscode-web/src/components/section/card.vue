<template>
  <a-card class="c-secion-card" :class="{ 'no-padding': noPadding }">
    <div
      class="c-secion-card__wrap"
      :class="{
        'no-tab-pane': noTabPane,
        'is-footer': isFooter,
        'is-header': isHeader
      }"
    >
      <div v-if="isHeader" class="section-header">
        <slot name="header">
          <div class="title">
            <slot name="title">{{ title }}</slot>
          </div>
          <div class="actions">
            <slot name="actions" />
          </div>
        </slot>
      </div>
      <template v-if="isTab">
        <section-tabs
          v-model="tabNameSync"
          :tab-items="tabItems"
          :center="tabCenter"
          :before-leave="beforeTabLeaveFn"
        >
          <template #default="{ item }">
            <slot v-bind="{ item }" name="tab-pane" />
          </template>
        </section-tabs>
      </template>

      <div
        v-if="isBody"
        class="section-body"
        :class="{ 'no-scroll': noScroll }"
        :style="{ 'min-height': minBodyHeight, height: bodyHeight }"
      >
        <slot />
      </div>
      <div v-if="isFooter" class="section-footer">
        <slot name="footer" />
      </div>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import SectionTabs from './tabs.vue'

export default defineComponent({
  components: {
    SectionTabs
  },

  props: {
    // section标题
    title: { type: String, default: '' },
    // tabName
    tabName: { type: String, default: '' },
    // name, label, tag
    tabItems: { type: Array, default: () => [] },
    // body高度 (no-full-height时生效)
    bodyHeight: { type: String, default: '' },
    // 最小body高度 (no-full-height时生效)
    minBodyHeight: { type: String, default: '' },
    // 高度100%生效，是否滚动
    noScroll: { type: Boolean, default: false },
    // 是否有padding
    noPadding: { type: Boolean, default: false },
    // 不显示tab, 当提供了tab-items时生效
    hideTabs: { type: Boolean, default: false },
    // 不显示header, 当提供了tab-items时生效
    hideHead: { type: Boolean, default: true },
    // 不显示tabPane, 当提供了tab-items时生效
    noTabPane: { type: Boolean, default: false },
    // 不显示tabLabel位置是否居中, 当提供了tab-items时生效
    tabCenter: { type: Boolean, default: false }
  },

  data() {
    return {
      tabNameSync: this.tabName
    }
  },

  computed: {
    isTab(): boolean {
      return !!(this.tabItems && this.tabItems.length && !this.hideTabs)
    },

    // 是否存在header
    isHeader(): boolean {
      return !!this.title || !!this.$slots.header || !!this.$slots['op-btn']
    },

    // 是否存在body
    isBody(): boolean {
      return !!this.$slots.default
    },

    // 是否存在footer
    isFooter(): boolean {
      return !!this.$slots.footer
    },

    // tab index
    tabIndex(): number {
      const tabIndex = this.getTabIndex()
      return tabIndex
    }
  },

  watch: {
    tabNameSync() {
      this.$emit('update:tabName', this.tabNameSync)
    }
  },

  methods: {
    // tab选择事件
    async selectTab(tabName: string, oldTabName: string) {
      this.tabNameSync = tabName

      this.$nextTick(() => {
        this.$emit('tab-select', tabName, oldTabName)
      })
    },

    // 上一个Tab
    goPrevTab() {
      this.gotoTab(-1)
    },

    // 下一个Tab
    goNextTab() {
      this.gotoTab(1)
    },

    // 跳转到指定tab
    async gotoTab(tab: number | string) {
      let tabName: string = this.tabNameSync
      if (typeof tab === 'string') {
        tabName = tab
      } else {
        const tabIndex = this.tabIndex
        if (tabIndex < 0) return

        const targetTab: any = this.tabItems[tabIndex + tab]
        if (!targetTab) return

        tabName = targetTab.name
      }

      if (tabName === this.tabNameSync) {
        return
      }

      this.selectTab(tabName, this.tabNameSync)
    },

    /** 是否当前tab为最后一个tab */
    isLastTab(tabName?: string) {
      const tabIndex = this.getTabIndex(tabName)
      return this.tabItems.length - 1 === tabIndex
    },

    getTabIndex(tabName?: string) {
      tabName = tabName || this.tabNameSync
      const tabIndex = (this.tabItems || []).findIndex((item: any) => item.name === tabName)
      return tabIndex
    }
  }
})
</script>

<style lang="less" scoped>
.c-secion-card {
  box-sizing: border-box;

  .section-header {
    border-bottom: 1px solid #e2e2e2;
    display: flex;
    line-height: 30px;

    & > .title {
      font-weight: bold;
      font-size: 18px;
      flex: 1;
    }
  }

  .section-footer {
    text-align: center;
  }

  &__wrap {
    box-sizing: border-box;
  }
}

.c-secion-card.no-padding {
  box-shadow: none;
  border: none;

  & > ::v-deep(.ant-card-body) {
    padding: 0;
  }
}

.c-secion-card {
  & > ::v-deep(.ant-card-body > .c-secion-card__wrap) {
    .section-body-content {
      padding: 8px 0;

      & > .subsection {
        padding-bottom: 8px;
        margin-bottom: 8px;

        &.border-bottom {
          border-bottom: 1px solid #e2e2e2;
        }

        & > .title {
          font-size: 16px;
          clear: both;
          font-weight: 400;
          margin-top: 10px;
          margin-bottom: 5px;
          border-left: 3px solid #2395f1;
          padding-left: 8px;
        }
      }
    }

    &.no-tab-pane {
      & > .c-section-tabs {
        height: auto !important;

        & > .ant-tabs-content {
          display: none;
        }
      }
    }
  }
}
</style>
