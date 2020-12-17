import { Constants } from "../../../core";
import WsBaseCommand from "./base";

import { ApiNode } from "../nodes";
import ApiViewPanel from "../views/apiViewPanel";

/**
 * 显示Api视图
 */
export default class extends WsBaseCommand {
  get name() {
    return Constants.cmdWorkspaceApiDocView;
  }

  async method(treeNode: ApiNode) {
    ApiViewPanel.show(this._provider, treeNode);
  }
}
