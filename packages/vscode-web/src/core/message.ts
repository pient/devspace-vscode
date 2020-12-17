import uni from './uni'

// 发送事件消息
export function postEventMessage(command: PostedMessageCommands, data?: unknown) {
  postMessage({
    command,
    data
  })
}

// 发送视图消息
export function postViewMessage(viewType: string, command: PostedMessageCommands, data?: unknown) {
  postMessage({
    command,
    viewType,
    data
  })
}

// 发送消息（给vscode）
export function postMessage(message: PostedViewMessage) {
  uni.console.debug('postMessage', message)
  uni.postMessage(message)
}
