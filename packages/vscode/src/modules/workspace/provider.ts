import { vscode, utils, Constants, vscodeUtil, ExplorerProvider, ExplorerNode, ExplorerStatusNode } from "../../core";

import { ProjectConfig, LinkPickData, PickData } from "./types";
import { ProjectNode, ApiDocBaseNode } from "./nodes";
import WorkspaceConfigurer from "./configurer";

/** 工作区Provider */
export default class WorkspaceProvider extends ExplorerProvider {
  private forceReload = true; // 强制重新加载标志

  constructor() {
    super();
  }

  /** 获取children节点 */
  async getChildren(treeNode?: ExplorerNode): Promise<vscode.TreeItem[]> {
    if (!treeNode) {
      await this.loadRoot();
      return this.nodes;
    }

    if (treeNode.isInitial) {
      await this.loadChildren(treeNode);
    }

    if (treeNode.isLoaded) {
      return treeNode.children;
    }

    if (treeNode.isFailed) {
      vscodeUtil.showErrorMessage("加载数据错误，请重试。");
    }

    return [treeNode.statusNode];
  }

  /** 重新加载配置及节点 */
  async reload(treeNode?: ExplorerNode | ExplorerStatusNode): Promise<void> {
    let targetNode = treeNode;

    if (!targetNode) {
      this.forceReload = true; // 设置强制重新加载
      await this.loadRoot();
    } else {
      targetNode = treeNode instanceof ExplorerNode ? treeNode : treeNode.parent;
      await targetNode.reload();
    }

    this.refresh(targetNode, true);
  }

  /** 根据配置文件加载节点 */
  async loadRoot(): Promise<void> {
    await WorkspaceConfigurer.load(this.forceReload);
    this.forceReload = false; // 恢复强制重新加载

    let configs = WorkspaceConfigurer.getConfigs();

    if (!configs || !configs.length) {
      return;
    }

    // 如果只有一个根节点，则直接加载根节点的子节点
    if (configs.length === 1) {
      let projectNode = this.createNodeByConfig(configs[0]);
      await projectNode.loadChildren(this.forceReload);
      this.nodes = projectNode.children;

      return;
    }

    let nodes = configs.map((cfg: ProjectConfig) => {
      return this.createNodeByConfig(cfg);
    });

    this.nodes = nodes;
  }

  /** 加载子节点 */
  async loadChildren(node: ExplorerNode): Promise<void> {
    await vscode.window.withProgress(
      {
        location: { viewId: Constants.viewWorkspaceExplorer },
      },
      async () => {
        await node
          .loadChildren()
          .then(() => {
            this.refresh(node);
          })
          .catch((err) => {
            vscodeUtil.showErrorMessage(err.message || "加载错误。");
            vscodeUtil.logDebug(err);
          });
      }
    );
  }

  /** 根据配置文件创建节点 */
  createNodeByConfig(cfg: ProjectConfig): ProjectNode {
    return new ProjectNode(cfg);
  }

  /** 显示查询链接 */
  async showPickLinks(links: LinkPickData[]): Promise<PickData | undefined> {
    links.forEach((item) => {
      item.title = item.title || (item.label ? `[${item.label}] ${item.url}` : item.url);
    });

    let link = await this.showPickNodes(links);
    return link;
  }

  /** 显示查询链接 */
  async showPickNodes(data: PickData[]): Promise<PickData | undefined> {
    let dataMap = data.reduce((map, item) => {
      map[item.title] = item;
      return map;
    }, {});

    let dataTitles = Object.keys(dataMap);
    let dataTitle = await vscode.window.showQuickPick(dataTitles);

    let dataItem = dataMap[dataTitle];
    return dataItem;
  }
}
