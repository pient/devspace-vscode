import { Constants, ExplorerNode } from "../../../core";

import WsBaseCommand from "./base";

/** 刷新工作区命令 */
export default class extends WsBaseCommand {
  get name(): string {
    return Constants.cmdWorkspaceApiDocRefresh;
  }

  async method(treeNode: ExplorerNode) {
    await this._provider.reload(treeNode);
    this.resetViewAndContext();
  }
}
