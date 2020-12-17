<template>
  <div
    class="page-section"
    :class="{
      'list-section': listSection,
      border: border,
      fixed: fixed,
      'no-padding': noPadding,
      'no-padding-top': noPaddingTop,
      'no-head': !showHead,
      transparent: transparent,
      flex: flex
    }"
  >
    <div v-if="showHead" class="page-section__head">
      <div class="header">
        <div v-if="showTitle" class="title">{{ title }}</div>
        <slot name="header"></slot>
      </div>
      <div v-if="showExtra" class="extra">
        <slot name="extra" />
      </div>
    </div>

    <div v-if="showBody" class="page-section__body" :style="bodyStyle">
      <slot></slot>
    </div>

    <div v-if="showFooter" class="page-section__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PageSection',

  props: {
    border: Boolean,
    fixed: Boolean, // 高度、宽度确定
    listSection: Boolean,
    noPadding: Boolean,
    noPaddingTop: Boolean,
    transparent: Boolean,
    flex: Boolean,
    title: String,
    headerHeight: { type: String, default: '45px' },
    footerHeight: { type: String, default: '55px' }
  },

  computed: {
    showExtra(): boolean {
      return this.$slots.extra !== undefined
    },

    showHeader(): boolean {
      return this.$slots.header !== undefined
    },

    showFooter(): boolean {
      return this.$slots.footer !== undefined
    },

    showTitle(): boolean {
      if (this.showHeader) {
        return false
      }

      return !!this.title || this.$slots.title !== undefined
    },

    showHead(): boolean {
      return this.showExtra || this.showTitle || this.showHeader
    },

    showBody(): boolean {
      return this.$slots.default !== undefined
    },

    bodyStyle(): string | undefined {
      if (!this.fixed) return
      return `padding-top: ${this.headerHeight}; padding-bottom: ${this.footerHeight};`
    }
  },

  data() {
    return {}
  },

  methods: {}
}
</script>

<style lang="less">
.page-section {
  position: relative;
  padding: 10px 20px;
  background: @panel-color;
  border-radius: @border-radius;
  box-shadow: 0 0 3px 0 @border-color;
  margin-bottom: 10px;

  &__head {
    display: flex;
    padding: 10px 0;

    & > .header {
      flex: 1;

      & > .title {
        font-size: 14px;
        font-weight: bold;
        padding: 0 5px;
      }
    }
  }

  &__body {
    overflow: scroll;
    padding: 10px 0;
    width: 100%;
    display: flex;
  }

  &__footer {
    padding: 10px 0;
  }

  &.no-head {
    .page-section {
      &__body {
        padding-top: 0;
      }
    }
  }

  &.no__padding {
    padding: 0;

    &-top {
      padding-top: 0;
    }
  }

  &.transparent {
    background: transparent;
    box-shadow: none;
  }

  &.border {
    .page-section {
      &-head {
        border-bottom: 1px solid @border-color;
      }

      &__footer {
        border-top: 1px solid @border-color;
      }
    }
  }

  &.fixed {
    .page-section {
      &__footer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
      }
    }
  }

  &.list-section {
    @listHeaderHeight: 45px;
    @listFooterHeight: 55px;

    padding: 0;
    margin-bottom: 0;
    padding-bottom: 10px;
    position: relative;

    .list-header {
      display: flex;
      padding: 8px 12px;

      .list-search {
        max-width: 180px;
      }

      & > .body {
        flex: 1;
      }

      & > .tail {
        padding-left: 10px;
      }
    }

    .list-footer {
      padding: 16px;
      border-top: 1px solid @light-border-color;
    }

    &.fixed {
      height: 100%;
      padding-bottom: 0px;

      .page-section-body {
        height: 100%;
        padding: 0;
      }

      .list-header {
        position: absolute;
        top: 0;
        left: 0;
        height: @listHeaderHeight;
        overflow-x: scroll;
        width: 100%;
      }

      .list-body {
        overflow-y: scroll;
        height: 100%;
        width: 100%;
      }

      .list-table {
        height: 100%;

        .ivu-table-header {
          position: relative;
          padding-top: 30px;

          & > table {
            position: absolute;
            z-index: 100;
            top: 0;
            left: 0;
          }
        }

        .ivu-table-body {
          height: calc(100% - 30px + 1px);
          overflow: scroll;
        }
      }

      .list-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: @listFooterHeight;
      }
    }
  }
}

@media screen and (max-width: @screen-size-xs) {
  .page-section.list-section {
    .list-header {
      .list-search {
        width: 120px;
      }
    }
  }
}
</style>
