import { createApp } from 'vue'
import core from '../core'

import App from '../App.vue'
import router from '../router'
import store from '../store'

import registerComponents from './components'
import connectVscode from './vscode'

const app = createApp(App)

app.config.globalProperties.$core = core
app.config.globalProperties.$store = store

app.use(router)

// 注册通用组件
registerComponents(app)

// 连接vscode
const vscodeConnect = connectVscode(app)

// 如果不是vsCodeEnv环境，则跳转到Home节点
if (!core.isVsCodeEnv) {
  window.vscodeDebugger = window.location.search.indexOf('vscodeDebugger=1') >= 0

  vscodeConnect.dispatchViewMessage({
    command: 'view',
    viewType: 'home'
  })
}
