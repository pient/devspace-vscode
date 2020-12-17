import { ApiProjectService as ApiDocApiProjectService } from "@devspace/vscode-apidoc";
import { vscode, Constants } from "../../../core";

import { ApiDocConfig, ApiProjectConfig, ProjectConfig } from "../types";

export default class ApiProjectService extends ApiDocApiProjectService {
  protected config: ApiProjectConfig;

  constructor(config: ApiProjectConfig) {
    super({
      url: config.url || ApiProjectService.apiDocDefaultUrl,
      token: config.token
    });
    
    this.config = config;
  }

  // 默认文档地址
  static get apiDocDefaultUrl(): string {
    return vscode.workspace.getConfiguration().get(Constants.cfgApiDocDefaultUrl);
  }

  // 工作区项目配置
  get wsProjectConfig(): ProjectConfig {
    return this.config.wsProject;
  }

  // Api文档配置
  get apiDocConfig(): ApiDocConfig {
    return (this.wsProjectConfig && this.wsProjectConfig.apiDoc) || {};
  }
}
