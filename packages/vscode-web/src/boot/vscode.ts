import { App } from 'vue'
import core from '../core'

import store from '@/store'

let _appInitialized = false
let _appInitializing = false

// 加载时首先发送loaded消息
core.postEventMessage('loaded')

export default function connectVscode(app: App<Element>) {
  // 获取消息
  window.addEventListener('message', (event) => {
    const message = event.data

    switch (message.command) {
      case 'initialize':
        initialApp(message)
        break
      case 'view':
        dispatchViewMessage(message)
        break
      case 'data':
        dispatchDataMessage(message)
        break
    }
  })

  // 初始化应用，一般只执行一次
  function initialApp(message: ReceivedViewMessage) {
    if (_appInitializing || _appInitialized) return
    _appInitializing = true

    app.mount('#devspaceApp')

    _appInitialized = true
    _appInitializing = false

    // 发送初始化成功消息
    core.postEventMessage('initialized')

    dispatchViewMessage(message)
  }

  // 更新视图
  function dispatchViewMessage(message: ReceivedViewMessage) {
    if (!_appInitialized) {
      initialApp(message)
    } else if (message.viewType) {
      store.dispatch('app/loadView', message)
    }
  }

  // 更新数据
  function dispatchDataMessage(message: ReceivedViewMessage) {
    core.console.log(message)
  }

  return {
    dispatchViewMessage,
    dispatchDataMessage
  }
}
