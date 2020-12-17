import { Constants, ExplorerNode } from "../../../core";

import { ProjectConfig } from "../types";
import { ApiDocNode } from "./apiDocNode";
import { GeneralNode } from "./generalNode";

/**
 * 项目节点
 */
export class ProjectNode extends ExplorerNode {
  _config: ProjectConfig;

  constructor(config: ProjectConfig) {
    super(config.name.toLocaleUpperCase(), {
      type: Constants.ctxWorkspaceNodeTypeProject,
    });
    this._config = config;
  }

  protected async load(): Promise<ExplorerNode[]> {
    let nodes: ExplorerNode[] = [];

    let prjCfg = this._config;

    // 加载常用节点
    nodes.push(new GeneralNode(this._config));

    // 加载apiDocNode（目前为yapi）
    if (prjCfg.apiDoc) {
      let apiDocCfg = Object.assign(prjCfg.apiDoc, {
        wsProject: prjCfg,
      });

      let apiDocNode = new ApiDocNode(apiDocCfg);
      nodes.push(apiDocNode);
    }

    return nodes;
  }
}
