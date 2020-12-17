import { Constants, ExplorerNode } from "../../../core";
import { ApiNodeData } from "../types";
import { ApiCategoryNode, ApiDocNode, ApiNode, ApiProjectNode } from "../nodes";

import WsBaseCommand from "./base";

/**
 * 查询Api文档
 */
export default class extends WsBaseCommand {
  get name(): string {
    return Constants.cmdWorkspaceApiDocSearch;
  }

  async method(treeNode: ApiDocNode | ApiProjectNode | ApiCategoryNode): Promise<ExplorerNode | undefined> {
    await this._provider.getChildren(treeNode);

    if (!treeNode.isLoaded) {
      return;
    }

    let apisData: ApiNodeData[] = [];

    if (treeNode instanceof ApiDocNode) {
      apisData = treeNode.apiProjectNode.apisData;
    } else if (treeNode instanceof ApiProjectNode) {
      apisData = treeNode.apisData;
    } else if (treeNode instanceof ApiCategoryNode) {
      apisData = treeNode.getApisData();
    }

    let nodes: any[] = apisData.map((api) => {
      return {
        _id: api._id,
        title: `[${api.title}] ${api.path}`,
      };
    });

    let pick = await this._provider.showPickNodes(nodes);

    if (!pick) {
      return;
    }

    let node = await this._provider.findNode((node: ApiNode) => {
      return node instanceof ApiNode && node.data && node.data._id === pick._id;
    }, treeNode.children);

    if (!node) {
      return;
    }

    // 选中目标节点
    await this._explorerView.reveal(node, { select: true });
  }
}
