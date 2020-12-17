/** 统一平台类型 */
type ConsoleLogType = 'log' | 'debug' | 'error'

interface Uni {
  isVsCodeEnv?: boolean // 是否vscode运行环境
  envName?: string // 当前允许环境名称
  console: UniConsole
  postMessage(message: unknown): void
  openLink(url: string): void
}

interface UniConsole {
  log: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}
