import { BaseCommand, vscode } from "../../../core";
import WorkspaceProvider from "../provider";

export default abstract class WsBaseCommand extends BaseCommand {
  protected terminal: vscode.Terminal;
  protected _provider: WorkspaceProvider;
  protected _explorerView: vscode.TreeView<any>;

  resetViewAndContext() {}
}
