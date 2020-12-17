import { ExplorerNode, ExplorerNodeStatus } from "../../../core";
import * as WsUtils from "../utils";

/** 工作区节点基类 */
export abstract class WsBaseNode extends ExplorerNode {
  // 获取图标路径（一般在设置状态时调用）
  getIconPath(status?: ExplorerNodeStatus): string {
    if (this._noIcon === true) {
      return undefined;
    }
    return WsUtils.getNodeIconPath(this.type, status);
  }
}
