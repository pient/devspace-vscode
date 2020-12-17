import * as pathUtil from "path";
import * as vscode from "vscode";
import Constants = require("../constants");

let _initialized = false;
let _context: vscode.ExtensionContext;

/** 初始化实体方法, 只能初始化一次，并且不许提供context */
export function _initialize(context: vscode.ExtensionContext) {
  if (_initialized || !context) {
    return;
  }

  _context = context;
  _initialized = true;
}

// package.json信息
export interface IPackageInfo {
  name: string;
  version: string;
}

// 获取当前当前扩展package.json文件信息
export function getPackageInfo(context: vscode.ExtensionContext): IPackageInfo {
  let extensionPackage = require(context.asAbsolutePath("./package.json"));
  if (extensionPackage) {
    return {
      name: extensionPackage.name,
      version: extensionPackage.version,
    };
  }
}

// 获取上下文
export function context() {
  return _context;
}

// 获取扩展Uri
export function extensionUri() {
  return _context.extensionUri;
}

// 获取模块 icon路径
export function getResourcesPath(path: string): string {
  return pathUtil.join(_context.extensionPath, "resources", path);
}

// 获取模块 icon路径
export function getModuleResourcesPath(module: string, path: string): string {
  let subPath = pathUtil.join("modules", module, path);
  return getResourcesPath(subPath);
}

// 获取模块 icon路径
export function getModuleIconPath(module: string, folder: string, name: string): string {
  let subPath = pathUtil.join("icons", folder, `${name}.svg`);
  return getModuleResourcesPath(module, subPath);
}

// 获取节点 icon路径
export function getNodeIconPath(module: string, name: string): string {
  return getModuleIconPath(module, "nodes", name);
}

/** 获取扩展配置 */
export function getConfiguration(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration(Constants.extensionConfigSectionName);
}

// 获取当前激活文档
export function getActiveTextEditor(): vscode.TextEditor {
  let editor = undefined;
  if (vscode.window && vscode.window.activeTextEditor) {
    editor = vscode.window.activeTextEditor;
  }
  return editor;
}

// 获取当前激活文档的url，如果没有打开文档，则返回空字符串
export function getActiveTextEditorUri(): string {
  if (
    typeof vscode.window.activeTextEditor !== "undefined" &&
    typeof vscode.window.activeTextEditor.document !== "undefined"
  ) {
    return vscode.window.activeTextEditor.document.uri.toString(true);
  }
  return "";
}

// 输出消息到"zf"输出
export function logToOutputChannel(msg: any): void {
  let outputChannel = vscode.window.createOutputChannel(Constants.outputChannelName);
  outputChannel.show();
  if (msg instanceof Array) {
    msg.forEach((element) => {
      outputChannel.appendLine(element.toString());
    });
  } else {
    outputChannel.appendLine(msg.toString());
  }
}

// 展示调试信息
export function logDebug(msg: any): void {
  let config = vscode.workspace.getConfiguration(Constants.extensionConfigSectionName);
  let logDebugInfo = config.get(Constants.cfgLogDebugInfo);
  if (logDebugInfo === true) {
    let currentTime = new Date().toLocaleTimeString();

    let msgStr = msg;

    if (msg && typeof msg === "object") {
      try {
        msgStr = JSON.stringify(msg);
      } catch {}
    }

    let outputMsg = "[" + currentTime + "]: " + (msgStr ? msgStr.toString() : "");
    console.log(outputMsg);
  }
}

// 展示消息
export function showInformationMessage(msg: string): void {
  vscode.window.showInformationMessage(Constants.extensionName + ": " + msg);
}

// 展示警告
export function showWarningMessage(msg: string): void {
  vscode.window.showWarningMessage(Constants.extensionName + ": " + msg);
}

// 展示错误
export function showErrorMessage(msg: string): void {
  vscode.window.showErrorMessage(Constants.extensionName + ": " + msg);
}
