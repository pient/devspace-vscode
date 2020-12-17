import { Constants, ViewPanel } from "../../../core";
import { ApiNode } from "../nodes";
import WorkspaceProvider from "../provider";

export default class ApiViewPanel extends ViewPanel {
  static readonly viewType = Constants.vwWorkspaceApiDocApiViewType;

  public static async show(provider: WorkspaceProvider, treeNode: ApiNode, isNew?: boolean) {
    if (!treeNode.isDetailData) {
      await provider.reload(treeNode);
    }

    let data = await treeNode.getDetail();

    await ViewPanel.showPanel({
      viewType: ApiViewPanel.viewType,
      title: data.title,
      data,
      isNew,
    });
  }
}
