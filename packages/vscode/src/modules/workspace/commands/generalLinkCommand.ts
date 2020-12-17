import { Constants, utils } from "../../../core";

import { LinkPickData } from "../types";
import WsBaseCommand from "./base";

/** 常用链接跳转 */
export default class extends WsBaseCommand {
  get name(): string {
    return Constants.cmdWorkspaceGeneralLink;
  }

  async method(links: LinkPickData[]) {
    let link = await this._provider.showPickLinks(links);

    if (!link) {
      return;
    }

    // 跳转
    await utils.openLink(link.url);
  }
}
