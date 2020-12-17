import { _, utils, Constants, ExplorerNodeStatus } from "../../../core";

import { ApiDocConfig, ApiProjectConfig, ApiProjectNodeData, ApiCategoryNodeData, ApiNodeData } from "../types";
import { getNodeIconPath } from "../utils";
import ApiProjectService from "../services/apiProjectService";

import { WsBaseNode } from "./base";

export abstract class ApiDocBaseNode extends WsBaseNode {
  // 当前项目节点
  abstract get apiProjectNode(): ApiProjectNode | undefined;

  // 当前项目api服务
  get apiProjectService(): ApiProjectService | undefined {
    if (!this.apiProjectNode) {
      return undefined;
    }

    return this.apiProjectNode.apiProjectService;
  }

  // 当前项目配置
  get apiProjectConfig(): ApiProjectConfig | undefined {
    if (!this.apiProjectNode) {
      return undefined;
    }

    return this.apiProjectNode.config;
  }

  // 获取当前链接
  get link(): string | undefined {
    if (!this.apiProjectService) {
      return ApiProjectService.apiDocDefaultUrl;
    }

    return this.apiProjectService.getLink(this.type, this.data);
  }
}

/**
 * API文档节点
 */
export class ApiDocNode extends ApiDocBaseNode {
  protected _config: ApiDocConfig;
  protected _url: string;

  constructor(config: ApiDocConfig) {
    super("Api文档", { type: Constants.ctxWorkspaceNodeTypeApiDoc });

    this._config = config;
    this._url = config.url;
  }

  get apiProjectNode() {
    if (!this.children || !this.children.length) {
      return undefined;
    }

    let childNode = this.children[0] as ApiDocBaseNode;

    if (childNode.type === Constants.ctxWorkspaceNodeTypeApiCategory) {
      return childNode.apiProjectNode;
    }

    return undefined;
  }

  get data() {
    if (!this.apiProjectNode) {
      return {};
    }

    return this.apiProjectNode.data;
  }

  async load(): Promise<ApiDocBaseNode[]> {
    let docCfg = this._config;
    let prjCfgs = this._config.projects as ApiProjectConfig[];

    if (!prjCfgs || !prjCfgs.length) {
      return;
    }

    // merge apiDoc部分配置
    prjCfgs.forEach((cfg) => {
      if (!cfg) {
        return;
      }

      let wsPrjCfg = docCfg.wsProject;

      // 补偿配置
      _.defaultsDeep(
        cfg,
        {
          codegen: docCfg.codegen,
          wsProject: wsPrjCfg,
        },
        {
          codegen: {
            wsPath: wsPrjCfg && wsPrjCfg.path,
          },
        }
      );
    });

    // 多个项目，则生成多个项目节点
    let nodeOps = prjCfgs.map((cfg) => {
      return this.createApiProjectNode(cfg);
    });

    // 创建节点
    let nodes: ApiDocBaseNode[] = await Promise.all(nodeOps);

    return nodes;
  }

  // 根据配置文件创建节点
  async createApiProjectNode(cfg: ApiProjectConfig): Promise<ApiProjectNode> {
    return new ApiProjectNode(cfg);
  }
}

/**
 * API项目节点
 */
export class ApiProjectNode extends ApiDocBaseNode {
  protected _data: ApiProjectNodeData; // Api项目节点数据
  protected _config: ApiProjectConfig; // api节点配置
  protected _apiProjectService: ApiProjectService; // Api文档请求

  protected _catsData: ApiCategoryNodeData[];
  protected _apisData: ApiNodeData[];

  constructor(config: ApiProjectConfig) {
    super(config.name, { type: Constants.ctxWorkspaceNodeTypeApiProject, changeContextValueWithStaus: true });

    this._config = config;
    this._apiProjectService = new ApiProjectService(config);
  }

  get config() {
    return this._config;
  }

  get data() {
    return this._data;
  }

  get apiProjectNode() {
    return this;
  }

  get apiProjectService() {
    return this._apiProjectService;
  }

  get catsData() {
    return this._catsData;
  }

  get apisData() {
    return this._apisData;
  }

  async getData(): Promise<ApiProjectNodeData> {
    if (!this.isLoaded) {
      await this.load();
    }

    return this._data;
  }

  // 设置分类数据
  setCatsData(catsData: ApiCategoryNodeData[], force?) {
    if (!this._catsData || force === true) {
      this._catsData = catsData;
      return;
    }

    utils.setObjectsByKey(this._catsData, catsData, "_id");
  }

  // 设置接口数据
  setApisData(apisData: ApiNodeData[], force?) {
    if (!this._apisData || force === true) {
      this._apisData = apisData;
      return;
    }

    utils.setObjectsByKey(this._apisData, apisData, "_id");
  }

  // 重新加载当前节点数据
  async reloadData() {
    this._data = await this.apiProjectService.fetchProject();
  }

  // 重新加载分类节点数据
  async reloadCatsData() {
    this._catsData = await this.apiProjectService.fetchCateories();
  }

  // 重新加载所有接口节点数据
  async reloadApisData() {
    this._apisData = await this.apiProjectService.fetchApiList();
  }

  // 加载子节点
  async load(): Promise<ApiCategoryNode[] | undefined> {
    await Promise.all([this.reloadData(), this.reloadCatsData(), this.reloadApisData()]);

    let catNodes = this._catsData.map((cat) => {
      return new ApiCategoryNode(this, cat);
    });

    return catNodes;
  }
}

/**
 * API分类节点
 */
export class ApiCategoryNode extends ApiDocBaseNode {
  protected _projectNode: ApiProjectNode;
  protected _id: string | number;
  protected _data: ApiCategoryNodeData;

  constructor(prjNode: ApiProjectNode, nodeData: ApiCategoryNodeData) {
    super(nodeData.title, { type: Constants.ctxWorkspaceNodeTypeApiCategory });

    this._id = nodeData._id;
    this._projectNode = prjNode;
    this._data = nodeData;
  }

  get data() {
    return this._data;
  }

  get apiProjectNode() {
    return this._projectNode;
  }

  async reload() {
    let nodeData = await this.apiProjectService.fetchCateory(this._id);

    if (!nodeData) {
      return;
    }

    let apisData = await this.apiProjectService.fetchApiListByCategory(this._id);

    this.label = nodeData.title;
    this.apiProjectNode.setCatsData([nodeData]);
    this.apiProjectNode.setApisData(apisData);

    super.reload();
  }

  getApisData() {
    return this._projectNode.apisData.filter((api) => {
      return api.catId === this._id;
    });
  }

  async load(): Promise<ApiNode[]> {
    let apisData = this.getApisData();

    let nodes = apisData.map((api) => {
      return new ApiNode(this, api);
    });

    return nodes;
  }
}

/**
 * Api节点
 */
export class ApiNode extends ApiDocBaseNode {
  protected _categoryNode: ApiCategoryNode;
  protected _id: string | number;
  protected _data: ApiNodeData; // Api节点数据

  constructor(catNode: ApiCategoryNode, nodeData: ApiNodeData) {
    super(nodeData.title, { type: Constants.ctxWorkspaceNodeTypeApi, leaf: true });

    this._id = nodeData._id;
    this._categoryNode = catNode;
    this.setData(nodeData);
    this.setStatus(ExplorerNodeStatus.loaded);
  }

  get data() {
    return this._data;
  }

  get apiCategoryNode() {
    return this._categoryNode;
  }

  get apiProjectNode() {
    return this._categoryNode.apiProjectNode;
  }

  get tagName() {
    let data = this.data;
    if (!data || !data.tag || !data.tag.length) {
      return undefined;
    }

    return data.tag[0];
  }

  get isDetailData() {
    let data = this.data;
    return data && !!data._isDetail;
  }

  async reload() {
    let nodeData = await this.apiProjectService.fetchApi(this._id);
    this.setData(nodeData);
  }

  // 获取图标路径（一般在设置状态时调用）
  getIconPath(): string {
    let status = this.isDetailData ? "detail" : undefined;
    return getNodeIconPath(this.type, status);
  }

  /** 设置tag */
  async setTag(tagName: string) {
    let tag: string[] = [];
    if (tagName && tagName !== "清空") {
      tag = [tagName];
    }
    await this.apiProjectService.setApiTag(this._id, tag);

    let data = Object.assign({}, this._data, { tag });
    this.setData(data);
  }

  /** 获取详情 */
  async getDetail() {
    if (this.isDetailData) {
      return this.data;
    }

    await this.reload();

    return this.data;
  }

  /** 设置Api数据 */
  setData(data: ApiNodeData) {
    if (data === this.data) {
      return;
    }

    this.apiProjectNode.setApisData([data]);
    this._data = data;

    let { title } = data;

    let label = title;

    if (this.tagName) {
      label += ` [${this.tagName}]`;
    }

    if (data.path) {
      this.tooltip = `${data.method} ${data.path}`;
    }

    this.label = label;
    this.iconPath = this.getIconPath();
  }
}
