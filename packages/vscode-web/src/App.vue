<template>
  <div id="app">
    <a-layout class="fh">
      <a-layout-sider
        :trigger="null"
        :collapsed="collapsed"
        collapsible
        :collapsedWidth="0"
        :width="500"
        theme="light"
      >
        <debugger v-if="!isVsCodeEnv" v-model:collapsed="collapsed" />
      </a-layout-sider>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import core from '@/core'

import router from './router'
import Debugger from '@/components/debugger'

export default {
  components: {
    Debugger
  },

  data() {
    return {
      collapsed: true
    }
  },

  computed: {
    ...mapGetters(['viewType', 'viewData']),

    isVsCodeEnv() {
      return core.isVsCodeEnv
    }
  },

  watch: {
    viewType(cur: string, old: string) {
      if (cur === old) return

      router.push({
        name: cur
      })
    }
  }
}
</script>

<style lang="less">
@import './styles/app.less';
@import './styles/ant.less';
</style>

<style lang="less" scoped>
#app {
  height: 100vh;
}
</style>
