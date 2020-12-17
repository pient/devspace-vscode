import _console from './console'

const isVsCodeEnv = typeof acquireVsCodeApi === 'function'

const vscode = isVsCodeEnv ? acquireVsCodeApi() : undefined

const _uni: Uni = {
  isVsCodeEnv,
  envName: 'vscode',
  console: _console,
  postMessage,
  openLink
}

export default _uni

/** 发送消息 */
function postMessage(message: unknown) {
  vscode?.postMessage(message)
}

/** 打开链接 */
function openLink(url: string) {
  vscode?.postMessage({
    command: 'link',
    data: { url }
  })
}
