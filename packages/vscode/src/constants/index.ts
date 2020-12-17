// 扩展
export const extensionName = "ztoFinance"; // 扩展名
export const extensionConfigSectionName = "zf"; // 配置项名

// 项目配置文件名
// export const zfConfigFile = "zfconfig.json"; // 配置文件
export const zfConfigFile = "zf.config.js"; // 配置文件

// 模块名称
export const mdlWorkspaceName = "workspace";
export const mdlProjectsName = "projects";

// 日志
export const cfgLogDebugInfo = "logDebugInfo"; // 日志信息
export const outputChannelName = "ZtoFinance"; // 日志输出Channel

// 默认Api文档Url
export const cfgApiDocDefaultUrl = "zf.apiDoc.defaultUrl"; // 默认Api文档地址

// main模块 ----------------------------------->
// 首页命令
export const cmdGeneralWelcome = "zf.general.welcome"; // 欢迎页面

// Workspace模块 ----------------------------------->
export const viewWorkspaceExplorer = "workspaceExplorer"; // 视图查看

// 上下文变量
export const ctxWorkspaceShowInExplorer = "zf-workspace-show-in-explorer"; // 插件是否在工作区显示

export const cfgWorkspaceHideWhenEmpty = "zf.workspace.hideWhenEmpty"; // 项目配置文件为空不显示
export const cfgWorkspaceShowInExplorer = "zf.workspace.showInExplorer"; // 项目配置文件

// 节点类型
export const ctxWorkspaceNodeTypeProject = "project"; // 项目节点
export const ctxWorkspaceNodeTypeGeneral = "general"; // 常用节点
export const ctxWorkspaceNodeTypeGeneralLinks = "general_links"; // 常用链接
export const ctxWorkspaceNodeTypeApiDoc = "api_doc"; // Api文档
export const ctxWorkspaceNodeTypeApiProject = "api_project"; // Api项目
export const ctxWorkspaceNodeTypeApiCategory = "api_category"; // Api分类
export const ctxWorkspaceNodeTypeApi = "api"; // Api最终节点

// 命令
export const cmdWorkspaceGeneralLink = "zf.workspace.general.link"; // 常用链接
export const cmdWorkspaceGeneralLinkTitle = "Zto General Link"; // 常用链接
export const cmdWorkspaceApiDocSearch = "zf.workspace.apiDoc.search"; // 查询
export const cmdWorkspaceApiDocLink = "zf.workspace.apiDoc.link"; // 打开链接
export const cmdWorkspaceApiDocRefresh = "zf.workspace.apiDoc.refresh"; // 刷新节点
export const cmdWorkspaceApiDocCodeGen = "zf.workspace.apiDoc.codegen"; // 代码生成
export const cmdWorkspaceApiDocQuickCode = "zf.workspace.apiDoc.quickCode"; // 快速生成代码
export const cmdWorkspaceApiDocSetTag = "zf.workspace.apiDoc.setTag"; // 为api打标签
export const cmdWorkspaceApiDocView = "zf.workspace.apiDoc.view"; // 预览api
export const cmdWorkspaceApiDocNewView = "zf.workspace.apiDoc.newView"; // 预览api(新tab)

// 视图
export const vwWorkspaceApiDocApiViewType = "workspace.apiDoc.apiView"; // 显示api视图

// 项目区模块 ----------------------------------->
// 命令
export const cmdProjectsOpenConfig = "zf.projects.openConfig"; // 打开配置
export const cmdProjectsRefreshConfig = "zf.projects.refreshConfig"; // 刷新配置
export const cmdProjectsAddGroup = "zf.projects.addGroup"; // 新增分组
export const cmdProjectsRemoveNode = "zf.projects.removeNode"; // 移除节点
export const cmdProjectsRefreshNode = "zf.projects.refreshNode"; // 刷新节点
