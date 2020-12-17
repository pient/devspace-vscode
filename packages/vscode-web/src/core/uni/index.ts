/**
 * 统一平台接口，可更具不同的平台使用通用的接口
 */

// 根据不同的平台导入不同版本的uni
import vscodeUni from './vscode'
import webUni from './web'

let uni: Uni

if (vscodeUni.isVsCodeEnv) {
  uni = vscodeUni
} else {
  uni = webUni
}

export default uni
