import * as vscode from "vscode";
import { logDebug } from "./vscodeUtil";

export interface IVscodeEntityConstructorOptions {
  name?: string;
  [prop: string]: any;
}

export abstract class VscodeEntity implements vscode.Disposable {
  protected _name: string | undefined = undefined;
  protected _initialized: boolean = false;

  /**
   * 主控制器构造函数
   * @constructor
   */
  constructor(options?: IVscodeEntityConstructorOptions) {
    if (options) {
      this._name = options.name || "";
    }
  }

  dispose() {}

  /**
   * 激活扩展
   */
  async activate(): Promise<boolean> {
    if (this._initialized) {
      return;
    }

    // 初始化项目View
    let initialized = await this.initialize();
    this._initialized = initialized;

    logDebug(`${this._name} activated`);

    return true;
  }

  /**
   * 失活扩展
   */
  async deactivate(): Promise<void> {
    logDebug(`${this._name} de-activated`);
  }

  /**
   * 是否扩展已被初始化
   */
  public isInitialized(): boolean {
    return this._initialized;
  }

  /**
   * 初始化扩展
   */
  protected async initialize(): Promise<boolean> {
    return true;
  }
}
