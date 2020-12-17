declare const console: UniConsole

/** 日志 */
const _console: UniConsole = {
  log(...args: unknown[]) {
    consoleLog('log', ...args)
  },

  // 输出调试信息
  debug(...args: unknown[]) {
    consoleLog('debug', ...args)
  },

  // 输出调试信息
  error(...args: unknown[]) {
    consoleLog('error', ...args)
  }
}

export default _console

/** 输入日志 */
function consoleLog(type: ConsoleLogType, ...args: unknown[]) {
  console[type](...args)
}
