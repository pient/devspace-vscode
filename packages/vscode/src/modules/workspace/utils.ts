import { Constants, vscodeUtil, ExplorerNodeStatus } from "../../core";

// 获取节点icon路径
export function getNodeIconPath(type: string, status?: ExplorerNodeStatus | string): string {
  return vscodeUtil.getNodeIconPath(Constants.mdlWorkspaceName, `${type}${status === undefined ? "" : "-" + status}`);
}

// 获取节点icon路径
export function getIconPath(folder: string, name: string): string {
  return vscodeUtil.getModuleIconPath(Constants.mdlWorkspaceName, folder, name);
}
