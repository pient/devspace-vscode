import * as vscode from "vscode";

import * as fsUtil from "fs-extra";
import * as vscodeUtil from "./vscodeUtil";
import utils from "./utils";

// 允许传递的消息命令，初始化时为initialize
export type PostedMessageCommands = "view" | "data";

// 允许接收的消息命令
export type ReceivedMessageCommands = "loaded" | "initialized" | "link";

export interface ViewMessage {
  command: PostedMessageCommands | ReceivedMessageCommands;
  viewType?: string;
  data?: any;
  [prop: string]: any;
}

export interface PostedViewMessage extends ViewMessage {
  command: PostedMessageCommands;
}

export interface ReceivedViewMessage extends ViewMessage {
  command: ReceivedMessageCommands;
}

export interface ShowPanelOptions {
  viewType: string;
  title: string;
  data?: any;
  isNew?: boolean;
}

// TODO: 可以动态判断是否调试状态
let isDebug = true;
const htmlMediaPath = isDebug ? "media/debug" : "media/html";

export class ViewPanel {
  protected static readonly _currentPanels: { [key: string]: ViewPanel } = {};
  protected static readonly _panels: ViewPanel[] = [];
  protected static _viewTemplateStr: string;

  protected readonly _id: string;
  protected readonly _viewType: string; // webview释放后将无法获取viewType，在这里将其保存
  protected readonly _viewPanel: vscode.WebviewPanel;
  protected readonly _disposables: vscode.Disposable[] = [];
  protected _loaded = false; // webview是否已加载
  protected _initialized = false; // webview是否已初始化（web组件已初始化完成）
  protected _cachedViewData = undefined; // 在webview还未初始化时，postViewMessaege的是护具会缓存在这里

  // 显示视图面板
  public static async showPanel(options: ShowPanelOptions) {
    let panel = ViewPanel.getCurrentViewPanel(options.viewType);

    if (options.isNew === true || !panel) {
      panel = await ViewPanel.createViewPanel(options.title, options.viewType, options.data);
    } else {
      panel.viewPanel.reveal();
      panel.updateView(options.title, options.data);
    }
  }

  // 获取html模版
  protected static get viewTemplateStr() {
    if (!isDebug && ViewPanel._viewTemplateStr) {
      return ViewPanel._viewTemplateStr;
    }

    let indexPath = vscodeUtil.context().asAbsolutePath(`${htmlMediaPath}/index.html`);
    let templateStr = fsUtil.readFileSync(indexPath).toString();

    ViewPanel._viewTemplateStr = templateStr;

    return ViewPanel._viewTemplateStr;
  }

  // 获取内部id，此id会作为panels的主键
  protected static innerId(viewType: string) {
    let guid = utils.generateGuid();
    return `${viewType}_${guid}`;
  }

  // 获取viewPanel
  protected static getViewPanel(id: string): ViewPanel {
    return ViewPanel._panels.find((item) => {
      return item._id === id;
    });
  }

  // 从缓存panel中移除指定panel
  protected static removeViewPanel(id: string) {
    let index = ViewPanel._panels.findIndex((item) => {
      return item._id === id;
    });

    if (index < 0) {
      return;
    }

    let panel = ViewPanel._panels[index];

    // 从当前对列中移除panel
    let currentPanel = ViewPanel.getCurrentViewPanel(panel.viewType);

    if (currentPanel && currentPanel._id === id) {
      ViewPanel._currentPanels[panel.viewType] = undefined;
      delete ViewPanel._currentPanels[panel.viewType];
    }

    // 从缓存panel中移除panel
    ViewPanel._panels.slice(index, 1);
  }

  // 获取当前viewPanel
  protected static getCurrentViewPanel(viewType: string): ViewPanel {
    return ViewPanel._currentPanels[viewType];
  }

  // 创建viewPanel
  protected static async createViewPanel(title: string, viewType: string, data?: any): Promise<ViewPanel> {
    const extensionUri = vscodeUtil.extensionUri();

    let viewPanel = vscode.window.createWebviewPanel(viewType, title, vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media"), vscode.Uri.joinPath(extensionUri, "resources")],
    });

    let panel = new ViewPanel(viewPanel);
    ViewPanel._panels.push(panel);

    panel.viewPanel.webview.html = await panel.getHtmlForWebview();

    panel.postViewMessage(data);

    return panel;
  }

  protected constructor(viewPanel: vscode.WebviewPanel) {
    this._id = ViewPanel.innerId(viewPanel.viewType);
    this._viewType = viewPanel.viewType;
    this._viewPanel = viewPanel;

    // 状态变化时触发
    this._viewPanel.onDidChangeViewState(this.onViewStateChanged.bind(this), null, this._disposables);

    // 接收webview消息
    this._viewPanel.webview.onDidReceiveMessage(this.onReceivedMessage.bind(this), null, this._disposables);

    // 关闭时触发
    this._viewPanel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  // 获取视图
  get viewPanel() {
    return this._viewPanel;
  }

  // 获取视图类型
  get viewType() {
    return this._viewType;
  }

  // 发送视图消息
  public async postViewMessage(data: any) {
    if (!this._loaded) {
      this._cachedViewData = data;
    }

    await this.postMessage({
      command: "view",
      viewType: this.viewType,
      data,
    });
  }

  // 发送数据消息
  public async postDataMessage(data: any) {
    await this.postMessage({
      command: "data",
      data,
    });
  }

  // 发送消息
  public async postMessage(message: PostedViewMessage) {
    message.viewType = this.viewType;
    await this._viewPanel.webview.postMessage(message);
  }

  // 接收消息
  protected onReceivedMessage(message: ReceivedViewMessage) {
    switch (message.command) {
      case "loaded":
        this._loaded = true;
        break;
      case "link":
        utils.openLink(message.data && message.data.url);
        break;
      case "initialized":
        this._initialized = true;
        if (this._cachedViewData) {
          this.postViewMessage(this._cachedViewData);
          this._cachedViewData = undefined;
        }
        break;
    }
  }

  // view state变化（隐藏、显示、移动等）
  protected onViewStateChanged(e) {
    // 如果可见则设为当前panel
    if (this.viewPanel.visible) {
      ViewPanel._currentPanels[this.viewType] = this;
    }
  }

  // 获取当前viewColumn
  protected getWebviewUri(...args: string[]) {
    const webview = this._viewPanel.webview;
    const extensionUri = vscodeUtil.extensionUri();

    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...args));
  }

  // 更新视图
  protected async updateView(title: string, data?: any) {
    this._viewPanel.title = title;
    await this.postViewMessage(data);
  }

  // 获取view html
  protected async getHtmlForWebview(): Promise<string> {
    let templateStr = ViewPanel.viewTemplateStr;

    let assetsUri = this.getWebviewUri(`${htmlMediaPath}/_assets`);

    let indexHtml = templateStr.replace(/="\/_assets\//g, `="${assetsUri}/`);

    return indexHtml;
  }

  // 发送初始化消息
  protected async postInitialMessage(data?: any) {
    await this._viewPanel.webview.postMessage({
      command: "initialize",
      viewType: this.viewType,
      data,
    });
  }

  // 释放当前panel
  protected dispose() {
    ViewPanel.removeViewPanel(this._id);

    this._viewPanel.dispose();

    while (this._disposables.length) {
      const _disposable = this._disposables.pop();
      if (_disposable) {
        _disposable.dispose();
      }
    }
  }
}
