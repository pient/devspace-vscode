import { Constants, utils } from "../../../core";

import { ApiDocBaseNode } from "../nodes";
import WsBaseCommand from "./base";

/** api链接跳转 */
export default class extends WsBaseCommand {
  get name(): string {
    return Constants.cmdWorkspaceApiDocLink;
  }

  async method(treeNode: ApiDocBaseNode) {
    // 没有加载则先加载
    await this._provider.getChildren(treeNode);

    if (!treeNode.isLoaded) {
      return;
    }

    // 跳转
    await utils.openLink(treeNode.link);
  }
}
