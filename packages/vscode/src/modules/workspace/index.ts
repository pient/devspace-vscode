import { vscode, Constants, vscodeUtil, BaseModule, ExplorerNode } from "../../core";

import WorkspaceProvider from "./provider";
import commands from "./commands";

export default class WorkspaceModule extends BaseModule {
  protected _provider: WorkspaceProvider;
  protected _explorerView: vscode.TreeView<any>;

  // 初始化
  protected async initialize(): Promise<boolean> {
    const context = vscodeUtil.context();

    // 初始化工作区视图
    this._provider = new WorkspaceProvider();
    this._explorerView = vscode.window.createTreeView(Constants.viewWorkspaceExplorer, {
      treeDataProvider: this._provider,
      canSelectMany: false,
    });
    context.subscriptions.push(this._explorerView);

    // 选择时设置当前节点
    context.subscriptions.push(this._explorerView.onDidChangeSelection(this.onDidChangeSelection.bind(this)));

    // 配置修改事件
    vscode.workspace.onDidChangeConfiguration((e) => this.onDidChangeConfiguration(e));

    // 注册命令
    this.registerCommands(commands);

    this.resetViewAndContext();
    return true;
  }

  // 选择发生变化时
  private onDidChangeSelection(e: vscode.TreeViewSelectionChangeEvent<ExplorerNode>) {
    const selections: ExplorerNode[] = e.selection;
    if (selections && selections.length > 0) {
      this._provider.currentNode = selections[0];
    }
  }

  // 配置改变时
  private onDidChangeConfiguration(e: vscode.ConfigurationChangeEvent) {
    if (
      e.affectsConfiguration(Constants.cfgWorkspaceHideWhenEmpty) ||
      e.affectsConfiguration(Constants.cfgWorkspaceShowInExplorer)
    ) {
      this.resetViewAndContext();
    }
  }

  // 重设视图和上下文
  resetViewAndContext() {
    const cfg = vscode.workspace.getConfiguration();

    // 是否在explorer中显示扩展
    let cfgHideWhenEmpty = cfg.get(Constants.cfgWorkspaceHideWhenEmpty);
    let ctxShowInExplorer = cfg.get(Constants.cfgWorkspaceShowInExplorer);
    if (cfgHideWhenEmpty && this._provider && this._provider.isEmpty()) {
      ctxShowInExplorer = false;
    }
    vscode.commands.executeCommand("setContext", Constants.ctxWorkspaceShowInExplorer, ctxShowInExplorer);
  }

  dispose() {
    super.dispose();

    if (this._explorerView) {
      this._explorerView.dispose();
      this._explorerView = undefined;
    }
  }
}
