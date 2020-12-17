import _console from './console'

const _uni: Uni = {
  envName: 'web',
  console: _console,
  postMessage,
  openLink
}

export default _uni

/** 发送消息 */
function postMessage(message: any) {
  if (message && typeof message === 'object') {
    message.source = 'web'
  }

  window.postMessage(message, '*')
}

/** 打开链接 */
function openLink(url: string) {
  if (window.vsCodeDebugger === true) {
    const data = {
      command: 'link',
      url
    }
    postMessage(data)
  } else {
    window.open(url, '_blank')
  }
}
