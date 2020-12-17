/** vscode相关类型 */
declare function acquireVsCodeApi(): VscodeApi

interface VscodeApi {
  postMessage(message: any): void
}
