import { vscode, Constants, vscodeUtil, BaseModule } from "../../core";

/**
 * 主控制器
 */
export default class MainModule extends BaseModule {
  /**
   * 初始化扩展
   */
  protected async initialize(): Promise<boolean> {
    // 打印插件信息
    this.registerCommandMethod(Constants.cmdGeneralWelcome, this.printInfo);

    // 处理VS Code命令
    vscode.workspace.onDidCloseTextDocument(async (params) => await this.onDidCloseTextDocument(params));
    vscode.workspace.onDidOpenTextDocument((params) => this.onDidOpenTextDocument(params));
    vscode.workspace.onDidSaveTextDocument((params) => this.onDidSaveTextDocument(params));
    vscode.workspace.onDidChangeConfiguration((params) => this.onDidChangeConfiguration(params));

    return true;
  }

  /**
   * 用户设置修改后触发
   * @param ConfigurationChangeEvent 用户设置修改后触发事件
   */
  async onDidChangeConfiguration(e: vscode.ConfigurationChangeEvent): Promise<void> {}

  /**
   * 文档打开时触发
   */
  onDidOpenTextDocument(doc: vscode.TextDocument): void {}

  /**
   * 保存文档时触发
   * @param doc 被保存的文档
   */
  onDidSaveTextDocument(doc: vscode.TextDocument): void {}

  /**
   * 文档关闭时触发
   * @param doc The document that was closed
   */
  async onDidCloseTextDocument(doc: vscode.TextDocument): Promise<void> {}

  /** 打印插件相关信息 */
  printInfo() {
    vscodeUtil.showInformationMessage("欢迎使用开发空间VS Code开发插件。");

    console.log(`globalStoragePath: ${vscodeUtil.context().globalStoragePath}`);
  }
}
