import { vscode, vscodeUtil } from ".";
import { Uri, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { getNodeIconPath } from "./vscodeUtil";

const coreModuleName = "core";

export interface ExplorerNodeConstructorOptions {
  leaf?: boolean;
  data?: any;
  type?: string;
  contextValue?: string;
  noIcon?: boolean;
  iconPath?: string | Uri | { light: string | Uri; dark: string | Uri } | ThemeIcon;
  collapsibleState?: TreeItemCollapsibleState;
  changeContextValueWithStaus?: boolean;
  parent?: ExplorerNode | undefined;
  children?: ExplorerNode[] | undefined;
}

export enum ExplorerNodeStatus {
  initial = 0,
  loading = 1,
  loaded = 2,
  failed = 4,
}

export abstract class NodeItem extends TreeItem {}

// 状态节点
export class ExplorerStatusNode extends NodeItem {
  protected _status: ExplorerNodeStatus = ExplorerNodeStatus.initial;
  protected _parent: ExplorerNode;

  protected statusLabels: { [prop in ExplorerNodeStatus]: string } = {
    [ExplorerNodeStatus.initial]: "未加载",
    [ExplorerNodeStatus.loading]: "加载中",
    [ExplorerNodeStatus.loaded]: "已加载",
    [ExplorerNodeStatus.failed]: "加载失败",
  };

  constructor(status: ExplorerNodeStatus, parent: ExplorerNode) {
    super("");

    this._parent = parent;
    this.status = status;
  }

  get parent() {
    return this._parent;
  }

  // 获取当前状态
  get status() {
    return this._status;
  }

  // 设置节点状态
  set status(status: ExplorerNodeStatus) {
    this._status = status;
    this.label = this.statusLabels[status];
    this.contextValue = `status-${status}`;
    this.iconPath = vscodeUtil.getNodeIconPath(coreModuleName, this.contextValue);
  }
}

// 数据项
export class ExplorerNode extends NodeItem {
  readonly type: string; // 节点类型
  readonly leaf: boolean; // 是否叶节点

  protected _noIcon: boolean; // 是否显示icon
  protected _changeContextValueWithStaus: boolean; // 是否根据status改变contextValue
  protected _parent: ExplorerNode | undefined; // 父节点

  children: ExplorerNode[]; // 子节点
  statusNode: ExplorerStatusNode; // 状态节点

  constructor(label: string, options?: ExplorerNodeConstructorOptions) {
    super(label, options && options.children ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None);

    if (options) {
      this.type = options.type;
      this.leaf = options.leaf === true;
      this.children = options.children || [];

      if (options.parent) {
        this._parent = options.parent;
      }

      if (options.collapsibleState) {
        this.collapsibleState = options.collapsibleState;
      }

      this._noIcon = options.noIcon === true;

      this._changeContextValueWithStaus = options.changeContextValueWithStaus === true;

      if (options.contextValue) {
        this.contextValue = options.contextValue;
      }

      this.statusNode = new ExplorerStatusNode(ExplorerNodeStatus.initial, this);

      if (options.iconPath) {
        this.iconPath = options.iconPath;
      }
    }

    if (!this.leaf) {
      this.collapsibleState = this.collapsibleState || TreeItemCollapsibleState.Collapsed;
    }

    if (!this.contextValue && this.type) {
      this.contextValue = String(this.type);
    }

    if (!this.iconPath) {
      this.iconPath = this.getIconPath();
    }
  }

  get parent() {
    return this._parent;
  }

  set parent(parent: ExplorerNode) {
    this._parent = parent;
  }

  // 获取当前存储数据
  get data() {
    return {};
  }

  // 获取节点状态
  get status() {
    return this.statusNode.status;
  }

  // 未加载
  get isInitial() {
    return this.statusNode.status === ExplorerNodeStatus.initial;
  }

  // 当前节点是否加载中
  get isLoading() {
    return this.statusNode.status === ExplorerNodeStatus.loading;
  }

  // 当前节点是否已加载
  get isLoaded() {
    return this.statusNode.status === ExplorerNodeStatus.loaded;
  }

  // 加载失败
  get isFailed() {
    return this.statusNode.status === ExplorerNodeStatus.failed;
  }

  // 设置当前节点状态
  setStatus(status: ExplorerNodeStatus) {
    this.statusNode.status = status;
    if (this._changeContextValueWithStaus) {
      this.contextValue = `${this.type}-${status}`;
      this.iconPath = this.getIconPath(status);
    }
  }

  // 获取图标路径（一般在设置状态时调用）
  getIconPath(status?: ExplorerNodeStatus): string | Uri {
    return undefined;
  }

  // 加载子节点
  async loadChildren(force?: boolean): Promise<boolean> {
    // 叶节点不参与加载
    if (this.leaf) {
      return false;
    }

    // 已加载并非强制加载则不进行加载
    if (force !== true && this.isLoaded) {
      return false;
    }

    // 正在加载中
    if (this.isLoading) {
      return false;
    }

    this.setStatus(ExplorerNodeStatus.loading);

    await this.load()
      .then((res) => {
        this.children = res;
        this.setStatus(ExplorerNodeStatus.loaded);
      })
      .catch(() => {
        this.children = [];
        this.setStatus(ExplorerNodeStatus.failed);
      });

    for (let item of this.children) {
      item.parent = this;
    }

    return true;
  }

  // 重新加载节点
  async reload(): Promise<void> {
    await this.loadChildren(true);
  }

  // 执行加载子节点
  protected async load(): Promise<ExplorerNode[]> {
    return [];
  }
}

// 工作区数据提供
export class ExplorerProvider implements vscode.TreeDataProvider<any> {
  protected _currentNode: ExplorerNode;

  protected _onDidChangeTreeData: vscode.EventEmitter<any | undefined> = new vscode.EventEmitter<any | undefined>();
  readonly onDidChangeTreeData: vscode.Event<any | undefined> = this._onDidChangeTreeData.event;

  nodes: ExplorerNode[];

  constructor() {
    this.nodes = [];
  }

  getTreeItem(node: ExplorerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return node;
  }

  /** 获取父节点 */
  getParent(element?: ExplorerNode): ExplorerNode {
    return element && element.parent;
  }

  async getChildren(element?: ExplorerNode): Promise<vscode.TreeItem[]> {
    if (!element) {
      return this.nodes;
    }

    if (element.isLoaded) {
      element.children;
    } else {
      return [element.statusNode];
    }
  }

  isEmpty() {
    return !!this.nodes.length;
  }

  // 移除节点
  remove(node: ExplorerNode) {
    this.nodes = this.nodes.filter((item) => item !== node);
    this.refresh(node.parent);
  }

  removeAll() {
    this.nodes = [];
  }

  // 刷新页面
  async reload(node?: ExplorerNode) {
    if (node) {
      await node.reload();
    }

    this.refresh(node);
  }

  // 刷新页面
  refresh(node?: ExplorerNode | TreeItem, cascaded?: boolean) {
    this._onDidChangeTreeData.fire(node);

    if (node instanceof ExplorerNode && cascaded && node.children) {
      node.children.forEach((item) => {
        this.refresh(item, cascaded);
      });
    }
  }

  // 获取当前节点
  get currentNode(): ExplorerNode {
    return this._currentNode;
  }

  // 设置当前节点
  set currentNode(node: ExplorerNode) {
    this._currentNode = node;
  }

  // 查找节点
  async findNode(predicateFn: Function, children?: ExplorerNode[]): Promise<ExplorerNode | undefined> {
    if (children === undefined) {
      children = this.nodes;
    }

    for (let node of children) {
      if (predicateFn(node)) {
        return node;
      }

      if (!node.isLoaded) {
        await node.loadChildren();
      }

      if (node.children && node.children.length) {
        let _node = await this.findNode(predicateFn, node.children);

        if (_node !== undefined) {
          return _node;
        }
      }
    }

    return undefined;
  }
}
