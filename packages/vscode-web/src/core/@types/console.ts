/** 日志 */
const _console: UniConsole = {
  log(...args: unknown[]) {
    _consoleLog('log', ...args)
  },

  // 输出调试信息
  debug(...args: unknown[]) {
    _consoleLog('debug', ...args)
  },

  // 输出调试信息
  error(...args: unknown[]) {
    _consoleLog('error', ...args)
  }
}

export default _console

/** 输入日志 */
function _consoleLog(type: string, ...args: unknown[]) {
  const debugConsole = document.getElementById('debugConsole')

  if (debugConsole) {
    const text = args.map((item) => {
      return JSON.stringify(item, undefined, 2)
    })

    text.unshift(`${type} info: ---------------------->`)
    debugConsole.innerHTML = text.join('<br />')
  }
}
