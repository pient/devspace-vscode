/**
 * 与vscode之间传输消息类型
 */
// 允许接收的消息命令，初始化时为initialize
type ReceivedMessageCommands = 'initialize' | 'view' | 'data'

// 允许发送的消息命令
type PostedMessageCommands = 'loaded' | 'initialized'

interface ViewMessage {
  command: PostedMessageCommands | ReceivedMessageCommands
  viewType?: string
  data?: unknown
  [prop: string]: unknown
}

interface PostedViewMessage extends ViewMessage {
  command: PostedMessageCommands
}

interface ReceivedViewMessage extends ViewMessage {
  command: ReceivedMessageCommands
}
