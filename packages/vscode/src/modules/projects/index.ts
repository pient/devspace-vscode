import { vscode, Constants, vscodeUtil, BaseModule, ExplorerNode } from "../../core";

import ProjectsProvider from "./provider";

export default class ProjectsModule extends BaseModule {
  private _explorerProvider: ProjectsProvider;

  protected async initialize(): Promise<boolean> {
    const thiz = this;
    const context = vscodeUtil.context();

    this._explorerProvider = new ProjectsProvider();
    const explorer = vscode.window.createTreeView("projectsExplorer", {
      treeDataProvider: this._explorerProvider,
      canSelectMany: false,
    });

    context.subscriptions.push(explorer);

    // 选择时设置当前节点
    context.subscriptions.push(
      explorer.onDidChangeSelection((e: vscode.TreeViewSelectionChangeEvent<ExplorerNode>) => {
        const selections: ExplorerNode[] = e.selection;
        if (selections && selections.length > 0) {
          thiz._explorerProvider.currentNode = selections[0];
        }
      })
    );

    // 打开项目配置
    context.subscriptions.push(
      vscode.commands.registerCommand(Constants.cmdProjectsOpenConfig, async () => {
        vscodeUtil.showInformationMessage("打开项目配置！");
      })
    );

    // 刷新项目配置
    context.subscriptions.push(
      vscode.commands.registerCommand(Constants.cmdProjectsRefreshConfig, async () => {
        vscodeUtil.showInformationMessage("刷新项目配置！");
      })
    );

    // 新增项目组
    context.subscriptions.push(
      vscode.commands.registerCommand(Constants.cmdProjectsAddGroup, async () => {
        vscodeUtil.showInformationMessage("新增项目组！");
      })
    );

    // 移除项目节点
    context.subscriptions.push(
      vscode.commands.registerCommand(Constants.cmdProjectsRemoveNode, async (treeNodeInfo: ExplorerNode) => {
        await this._explorerProvider.remove(treeNodeInfo);
        return this._explorerProvider.refresh(undefined);
      })
    );

    // 刷新项目节点
    context.subscriptions.push(
      vscode.commands.registerCommand(Constants.cmdProjectsRefreshNode, async (treeNodeInfo: ExplorerNode) => {
        await this._explorerProvider.refresh(treeNodeInfo);
      })
    );

    return true;
  }
}
