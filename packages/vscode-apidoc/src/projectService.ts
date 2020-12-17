import { HttpRequest } from "@devspace/vscode-core";
import { ApiProjectServiceConfig, ApiCategoryItem, ApiItem, ApiProjectItem } from "../types/apidoc";

export const ApiItemTypes: Record<string, string> = {
  ApiDoc: 'api_doc',
  ApiProject: 'api_project',
  ApiCategory: 'api_category',
  Api: 'api'
}

export class ApiProjectService {
  protected _config: ApiProjectServiceConfig;
  protected _request?: HttpRequest;

  constructor(config: ApiProjectServiceConfig) {
    this._config = config;
    this._request = new HttpRequest(this.url);
  }

  get url() {
    return this._config.url;
  }

  get token() {
    return this._config.token;
  }

  // 获取特定类型链接
  getLink(type: string | number, options: any = {}): string {
    let link = this.url;

    switch (type) {
      case ApiItemTypes.ApiDoc:
        if (options._id) {
          link = `${this.url}/project/${options._id}/interface/api`;
        }
        break;
      case ApiItemTypes.ApiProject:
        link = `${this.url}/project/${options._id}/interface/api`;
        break;
      case ApiItemTypes.ApiCategory:
        link = `${this.url}/project/${options.projectId}/interface/api/cat_${options._id}`;
        break;
      case ApiItemTypes.Api:
        link = `${this.url}/project/${options.projectId}/interface/api/${options._id}`;
        break;
    }

    return link;
  }

  /** 获取项目信息 */
  async fetchProject(): Promise<ApiProjectItem> {
    let prjData: any = await this.request("api/project/get");
    prjData.type = 'project'
    prjData.title = prjData.name;
    prjData.key = `prj_${prjData._id}`;
    prjData.link = this.getLink(ApiItemTypes.ApiProject, prjData)
    return prjData;
  }

  /** 获取分类下api信息 */
  async fetchApiList(): Promise<ApiItem[]> {
    let apisData: any = await this.request({
      url: "api/interface/list",
      params: {
        page: 1,
        limit: 1000,
      },
    });

    if (!apisData || !apisData.list) {
      return [];
    }

    let apisList = apisData.list.map((item) => {
      return this.formatApiItem(item);
    });

    return apisList;
  }

  /** 获取项目分类信息 */
  async fetchCateory(id: string | number): Promise<ApiCategoryItem | undefined> {
    let catNodes = await this.fetchCateories();
    let catNode = catNodes.find((item) => {
      return item._id === id;
    });

    return catNode;
  }

  /** 获取项目分类信息 */
  async fetchCateories(): Promise<ApiCategoryItem[]> {
    let catMenu: any = await this.request({
      url: "api/interface/getCatMenu",
      params: {
        page: 1,
        limit: 100,
      },
    });

    if (!catMenu || !catMenu.length) {
      return [];
    }

    let catList = catMenu.map((menu: any) => {
      menu.type = 'category'
      menu.title = menu.name;
      menu.projectId = menu.project_id;
      menu.key = `cat_${menu.project_id}_${menu._id}`;
      menu.link = this.getLink(ApiItemTypes.ApiCategory, menu)
      return menu;
    });

    return catList;
  }

  /** 获取分类下api信息 */
  async fetchApiListByCategory(catid: number | string): Promise<ApiItem[]> {
    let apisData: any = await this.request({
      url: "api/interface/list_cat",
      params: {
        catid,
        limit: 100,
      },
    });

    if (!apisData || !apisData.list) {
      return [];
    }

    let apisList = apisData.list.map((item) => {
      return this.formatApiItem(item);
    });

    return apisList;
  }

  protected formatApiItem(data: any): ApiItem {
    let nodeData: ApiItem = {
      _isDetail: false,
      _id: data._id,
      type: 'api',
      key: `api_${data.project_id}_${data._id}`,
      title: data.title,
      catId: data.catid,
      projectId: data.project_id,
      method: data.method,
      tag: data.tag,
      path: data.path,
      reqBodyType: data.req_body_type,
      reqHeaders: data.req_headers,
      reqQuery: data.req_query,
      reqParams: data.req_params,
      reqBodyForm: data.req_body_form,
      resBodyType: data.res_body_type,
      desc: data.desc,
      markdown: data.markdown,
      uid: data.uid,
      username: data.username,
      createdAt: data.add_time,
      updatedAt: data.up_time
    };

    try {
      nodeData.link = this.getLink(ApiItemTypes.Api, nodeData)

      if (nodeData.reqBodyType === "json") {
        nodeData.reqBody = JSON.parse(data.req_body_other);
      } else {
        nodeData.reqBody = data.req_body_other;
      }

      if (nodeData.resBodyType === "json") {
        nodeData.resBody = JSON.parse(data.res_body);
      } else {
        nodeData.resBody = data.res_body;
      }
    } catch (err) {}

    if (nodeData.reqBodyType) {
      nodeData._isDetail = true;
    }

    return nodeData;
  }

  /** 获取api信息 */
  async fetchApi(id: number | string): Promise<ApiItem | undefined> {
    let res: any = await this.request({
      url: "api/interface/get",
      params: { id },
    });

    let nodeData = this.formatApiItem(res);

    return nodeData;
  }

  /** 设置api Tag */
  async setApiTag(id: number | string, tag: string[]): Promise<void> {
    await this.updateApi({
      id,
      tag,
    });
  }

  /** 导出文档数据 */
  async fetchExportData(params?: any) {
    params = Object.assign(
      {
        type: "json",
        status: "all",
      },
      params
    );

    let data: any = await this.request({
      url: "api/plugin/export",
      params,
    });

    return data;
  }

  /** 更新api */
  protected async updateApi(data: { id: string | number; [prop: string]: any }) {
    await this.request({
      url: "api/interface/up",
      method: "post",
      data,
    });
  }

  /**
   * api请求
   * @param url 查询地址
   * @param options 请求选项
   */
  protected async request(url: string | object, options?: any) {
    if (typeof url === "object") {
      options = url;
    } else {
      options = Object.assign({}, options, {
        url,
      });
    }

    let reqParams = Object.assign(
      {
        token: this.token,
      },
      options.params
    );

    options.method = options.method || "get";
    options.params = reqParams;

    let res: any = await this._request.fetch(options);

    if (!res) {
      return res;
    }

    if (res.errcode === 0) {
      return res.data;
    } else if (res.errcode) {
      throw new Error(res.errmsg);
    }

    return res;
  }
}
