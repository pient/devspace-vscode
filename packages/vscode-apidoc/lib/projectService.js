"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiProjectService = exports.ApiItemTypes = void 0;
const vscode_core_1 = require("@devspace/vscode-core");
exports.ApiItemTypes = {
    ApiDoc: 'api_doc',
    ApiProject: 'api_project',
    ApiCategory: 'api_category',
    Api: 'api'
};
class ApiProjectService {
    constructor(config) {
        this._config = config;
        this._request = new vscode_core_1.HttpRequest(this.url);
    }
    get url() {
        return this._config.url;
    }
    get token() {
        return this._config.token;
    }
    // 获取特定类型链接
    getLink(type, options = {}) {
        let link = this.url;
        switch (type) {
            case exports.ApiItemTypes.ApiDoc:
                if (options._id) {
                    link = `${this.url}/project/${options._id}/interface/api`;
                }
                break;
            case exports.ApiItemTypes.ApiProject:
                link = `${this.url}/project/${options._id}/interface/api`;
                break;
            case exports.ApiItemTypes.ApiCategory:
                link = `${this.url}/project/${options.projectId}/interface/api/cat_${options._id}`;
                break;
            case exports.ApiItemTypes.Api:
                link = `${this.url}/project/${options.projectId}/interface/api/${options._id}`;
                break;
        }
        return link;
    }
    /** 获取项目信息 */
    fetchProject() {
        return __awaiter(this, void 0, void 0, function* () {
            let prjData = yield this.request("api/project/get");
            prjData.type = 'project';
            prjData.title = prjData.name;
            prjData.key = `prj_${prjData._id}`;
            prjData.link = this.getLink(exports.ApiItemTypes.ApiProject, prjData);
            return prjData;
        });
    }
    /** 获取分类下api信息 */
    fetchApiList() {
        return __awaiter(this, void 0, void 0, function* () {
            let apisData = yield this.request({
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
        });
    }
    /** 获取项目分类信息 */
    fetchCateory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let catNodes = yield this.fetchCateories();
            let catNode = catNodes.find((item) => {
                return item._id === id;
            });
            return catNode;
        });
    }
    /** 获取项目分类信息 */
    fetchCateories() {
        return __awaiter(this, void 0, void 0, function* () {
            let catMenu = yield this.request({
                url: "api/interface/getCatMenu",
                params: {
                    page: 1,
                    limit: 100,
                },
            });
            if (!catMenu || !catMenu.length) {
                return [];
            }
            let catList = catMenu.map((menu) => {
                menu.type = 'category';
                menu.title = menu.name;
                menu.projectId = menu.project_id;
                menu.key = `cat_${menu.project_id}_${menu._id}`;
                menu.link = this.getLink(exports.ApiItemTypes.ApiCategory, menu);
                return menu;
            });
            return catList;
        });
    }
    /** 获取分类下api信息 */
    fetchApiListByCategory(catid) {
        return __awaiter(this, void 0, void 0, function* () {
            let apisData = yield this.request({
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
        });
    }
    formatApiItem(data) {
        let nodeData = {
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
            nodeData.link = this.getLink(exports.ApiItemTypes.Api, nodeData);
            if (nodeData.reqBodyType === "json") {
                nodeData.reqBody = JSON.parse(data.req_body_other);
            }
            else {
                nodeData.reqBody = data.req_body_other;
            }
            if (nodeData.resBodyType === "json") {
                nodeData.resBody = JSON.parse(data.res_body);
            }
            else {
                nodeData.resBody = data.res_body;
            }
        }
        catch (err) { }
        if (nodeData.reqBodyType) {
            nodeData._isDetail = true;
        }
        return nodeData;
    }
    /** 获取api信息 */
    fetchApi(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.request({
                url: "api/interface/get",
                params: { id },
            });
            let nodeData = this.formatApiItem(res);
            return nodeData;
        });
    }
    /** 设置api Tag */
    setApiTag(id, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateApi({
                id,
                tag,
            });
        });
    }
    /** 导出文档数据 */
    fetchExportData(params) {
        return __awaiter(this, void 0, void 0, function* () {
            params = Object.assign({
                type: "json",
                status: "all",
            }, params);
            let data = yield this.request({
                url: "api/plugin/export",
                params,
            });
            return data;
        });
    }
    /** 更新api */
    updateApi(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.request({
                url: "api/interface/up",
                method: "post",
                data,
            });
        });
    }
    /**
     * api请求
     * @param url 查询地址
     * @param options 请求选项
     */
    request(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof url === "object") {
                options = url;
            }
            else {
                options = Object.assign({}, options, {
                    url,
                });
            }
            let reqParams = Object.assign({
                token: this.token,
            }, options.params);
            options.method = options.method || "get";
            options.params = reqParams;
            let res = yield this._request.fetch(options);
            if (!res) {
                return res;
            }
            if (res.errcode === 0) {
                return res.data;
            }
            else if (res.errcode) {
                throw new Error(res.errmsg);
            }
            return res;
        });
    }
}
exports.ApiProjectService = ApiProjectService;
//# sourceMappingURL=projectService.js.map