import * as vscode from "vscode";
import * as vscodeUtil from "./vscodeUtil";
import { VscodeEntity } from "./vscodeEntity";
import BaseCommand from "./baseCommand";
import { ExplorerProvider } from "./explorerProvider";

export default abstract class BaseModule extends VscodeEntity {
  protected _provider: ExplorerProvider;
  protected _terminal: vscode.Terminal;

  // 获取当前对应的终端（命令行）
  get terminal() {
    if (!this._terminal) {
      this._terminal = vscode.window.createTerminal();
    }

    return this._terminal;
  }

  // 注册命令
  registerCommands(commands: BaseCommand[], context?: any) {
    // 注册命令
    commands.forEach((item) => {
      this.registerCommand(item, context);
    });
  }

  // 注册命令
  registerCommand(command: BaseCommand, context?: any) {
    context = context || this;
    vscodeUtil
      .context()
      .subscriptions.push(vscode.commands.registerCommand(command.name, command.method.bind(context)));
  }

  // 注册命令
  registerProviderCommand(name: string, method: (...args: any[]) => any) {
    this.registerCommandMethod(name, method, this._provider);
  }

  // 注册命令
  registerCommandMethod(name: string, method: (...args: any[]) => any, context?: any) {
    context = context || this;
    vscodeUtil.context().subscriptions.push(vscode.commands.registerCommand(name, method.bind(context)));
  }

  dispose() {
    if (this._provider) {
      this._provider = undefined;
    }

    if (this._terminal) {
      this._terminal.dispose();
      this._terminal = undefined;
    }
  }
}
