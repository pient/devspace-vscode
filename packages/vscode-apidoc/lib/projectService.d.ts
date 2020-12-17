import { HttpRequest } from "@devspace/vscode-core";
import { ApiProjectServiceConfig, ApiCategoryItem, ApiItem, ApiProjectItem } from "../types/apidoc";
export declare const ApiItemTypes: Record<string, string>;
export declare class ApiProjectService {
    protected _config: ApiProjectServiceConfig;
    protected _request?: HttpRequest;
    constructor(config: ApiProjectServiceConfig);
    get url(): string;
    get token(): string;
    getLink(type: string | number, options?: any): string;
    /** 获取项目信息 */
    fetchProject(): Promise<ApiProjectItem>;
    /** 获取分类下api信息 */
    fetchApiList(): Promise<ApiItem[]>;
    /** 获取项目分类信息 */
    fetchCateory(id: string | number): Promise<ApiCategoryItem | undefined>;
    /** 获取项目分类信息 */
    fetchCateories(): Promise<ApiCategoryItem[]>;
    /** 获取分类下api信息 */
    fetchApiListByCategory(catid: number | string): Promise<ApiItem[]>;
    protected formatApiItem(data: any): ApiItem;
    /** 获取api信息 */
    fetchApi(id: number | string): Promise<ApiItem | undefined>;
    /** 设置api Tag */
    setApiTag(id: number | string, tag: string[]): Promise<void>;
    /** 导出文档数据 */
    fetchExportData(params?: any): Promise<any>;
    /** 更新api */
    protected updateApi(data: {
        id: string | number;
        [prop: string]: any;
    }): Promise<void>;
    /**
     * api请求
     * @param url 查询地址
     * @param options 请求选项
     */
    protected request(url: string | object, options?: any): Promise<any>;
}
