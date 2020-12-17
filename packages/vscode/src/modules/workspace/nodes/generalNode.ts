import { Constants, ExplorerNode } from "../../../core";

import { ProjectConfig, GeneralConfig, LinkConfig } from "../types";
import { WsBaseNode } from "./base";

/** 常用节点 */
export class GeneralNode extends WsBaseNode {
  protected _config: ProjectConfig | undefined;

  constructor(config: ProjectConfig) {
    super("常用", { type: Constants.ctxWorkspaceNodeTypeGeneral });

    this._config = config;
    this.children = [];
  }

  get generalConfig(): GeneralConfig | undefined {
    return this._config && this._config.general;
  }

  protected async load(): Promise<ExplorerNode[]> {
    let nodes: ExplorerNode[] = [];

    if (this.generalConfig && this.generalConfig.links && this.generalConfig.links.length) {
      nodes.push(new GeneralLinksNode(this.generalConfig.links));
    }

    return nodes;
  }
}

/** 常用链接节点 */
export class GeneralLinksNode extends WsBaseNode {
  private _links: LinkConfig[] = [];

  constructor(links: LinkConfig[]) {
    super("项目链接", { type: Constants.ctxWorkspaceNodeTypeGeneralLinks, leaf: true });

    this._links = links;

    this.command = {
      title: Constants.cmdWorkspaceGeneralLinkTitle,
      command: Constants.cmdWorkspaceGeneralLink,
      arguments: [this.links],
    };
  }

  get links() {
    return this._links;
  }
}
