import { vscode, Constants, vscodeUtil, VscodeEntity } from "./core";

const moduleKeys = ["main", "workspace", "projects"];

const _modules: { [key: string]: VscodeEntity } = {};
const _services: { [key: string]: VscodeEntity } = {};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<boolean> {
  // 尽量在初始化最开始时执行，以保证在接下来可以正常调用
  vscodeUtil._initialize(context);

  // 首先判断workspace是否初始隐藏
  const cfg = vscode.workspace.getConfiguration();
  const cfgWorkspaceHideWhenEmpty = cfg.get(Constants.cfgWorkspaceHideWhenEmpty);
  if (!cfgWorkspaceHideWhenEmpty) {
    vscode.commands.executeCommand("setContext", Constants.ctxWorkspaceShowInExplorer, true);
  }

  // 注册Modules
  for (let key of moduleKeys) {
    const T = require(`./modules/${key}`).default;
    const _module = new T({ name: `${key} module`, context });
    context.subscriptions.push(_module); // 所有Disposable对象都要加入 subscriptions
    await _module.activate();

    _modules[key] = _module;
  }

  vscodeUtil.logDebug("“开发空间”扩展已被激活！");

  return true;
}

// this method is called when your extension is deactivated
export async function deactivate(): Promise<void> {
  // 释放Modules
  for (let item of Object.values(_modules)) {
    if (item) {
      await item.deactivate();
      item.dispose();
    }
  }

  // 释放Services
  for (let item of Object.values(_services)) {
    if (item) {
      await item.deactivate();
      item.dispose();
    }
  }

  vscodeUtil.logDebug("“开发空间”扩展已释放！");
}
