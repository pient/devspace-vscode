import { vscode, Constants, vscodeUtil } from "../../../core";
import { ApiNode } from "../nodes";

import WsBaseCommand from "./base";

/**
 * 设置apiTag
 */
export default class extends WsBaseCommand {
  get name() {
    return Constants.cmdWorkspaceApiDocSetTag;
  }

  async method(treeNode: ApiNode) {
    let apiTags = treeNode.apiProjectService.apiDocConfig.apiTags;

    if (!apiTags || !apiTags.length) {
      vscodeUtil.showWarningMessage(`暂无可用页面类型，请在"${Constants.zfConfigFile}"文件中进行设置`);
      return;
    }

    let tagName = await vscode.window.showQuickPick(apiTags);

    if (!tagName) {
      return;
    }

    // 设置tag
    await treeNode.setTag(tagName);

    this._provider.refresh(treeNode);
  }
}
