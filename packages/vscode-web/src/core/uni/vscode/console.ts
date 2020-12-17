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

let _debugConsole: any = undefined

/** 输入日志 */
function _consoleLog(type: string, ...args: unknown[]) {
  if (!_debugConsole) {
    _debugConsole = document.getElementById('debugConsole')
  }

  if (_debugConsole) {
    const text = args.map((item) => {
      return JSON.stringify(item, undefined, 2)
    })

    text.unshift(`${type} info: ---------------------->`)
    const textStr = text.join('<br />')
    const textNode = document.createTextNode(textStr)
    _debugConsole.appendChild(textNode)
  }
}
