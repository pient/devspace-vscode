import * as apidocTypes from "@devspace/vscode-apidoc/types/apidoc";

export interface PickData {
  title: string;
  [prop: string]: any; // 其他配置
}

export interface LinkPickData extends PickData {
  label?: string;
  url: string;
}

/** 链接配置 */
export interface LinkConfig {
  label?: string;
  url: string;
  desc: string;
}

/** 工作区项目配置 */
export interface ProjectConfig {
  id: string; // config标识
  name: string; // 工作区项目名称
  path: string; // 工作区根目录
  apiDoc?: ApiDocConfig; // api文档配置
  general?: GeneralConfig; // 常用配置
  [prop: string]: any; // 其他配置
}

/** 常用配置 */
export interface GeneralConfig {
  links?: LinkConfig[];
}

/** 代码生成配置 */
export interface ApiCodeGenConfig {
  wsPath?: string;
  jsonExport?: boolean;
  jsonExportName?: string;
  jsonExportFolder?: string;
  command?: string;
}

export interface QuickCodeItemConfig {
  tag: string[];
  body: string[] | string;
  apiDetail?: boolean; // 是否需要api详细信息（默认需要）
  renderOptions?: any;
}

export interface QuickCodeConfig {
  api?: { [prop: string]: QuickCodeItemConfig };
}

/** Api文档配置 */
export interface ApiDocConfig {
  url?: string; // 文档地址
  codegen?: ApiCodeGenConfig; // 代码生成配置
  projects?: ApiProjectConfig[]; // 文档包含项目
  apiTags?: string[]; // 可选api标签
  quickcode?: QuickCodeConfig; // 快速生成代码配置
  wsProject?: ProjectConfig; // 工作区项目配置
}

/** Api项目配置 */
export interface ApiProjectConfig {
  name: string; // 项目名，必填
  _id?: string; // 项目id
  url?: string; // 文档地址
  token?: string; // 项目token
  codegen?: ApiCodeGenConfig; // 代码生成配置
  wsProject?: ProjectConfig; // 工作区项目配置
}

/** Api Tag */
export interface ApiTag extends apidocTypes.ApiTag {}

/** Api文档项目节点数据 */
export interface ApiProjectNodeData extends apidocTypes.ApiProjectItem {
  tag: ApiTag[];
}

/** Api文档分类数据 */
export interface ApiCategoryNodeData extends apidocTypes.ApiCategoryItem {}

/** Api文档Api数据 */
export interface ApiNodeData extends apidocTypes.ApiItem {}
