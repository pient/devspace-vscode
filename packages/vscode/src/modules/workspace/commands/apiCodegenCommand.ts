import { vscode, Constants, pathUtil, fsUtil, utils, vscodeUtil } from "../../../core";
import { ApiCodeGenConfig } from "../types";
import { ApiDocBaseNode, ApiDocNode, ApiProjectNode } from "../nodes";

import WsBaseCommand from "./base";

/**
 * 调用codegen生成代码
 */
export default class extends WsBaseCommand {
  get name(): string {
    return Constants.cmdWorkspaceApiDocCodeGen;
  }

  async method(treeNode: ApiDocNode | ApiProjectNode) {
    let config: ApiCodeGenConfig = {};

    // 没有加载则先加载
    if (treeNode.isInitial) {
      await this._provider.getChildren(treeNode);
    }

    if (!treeNode.isLoaded) {
      return;
    }

    config = treeNode.apiProjectConfig && treeNode.apiProjectConfig.codegen;

    // 配置问题
    if (!treeNode.apiProjectService || !config || !config.command) {
      return;
    }

    // 直接执行代码生成，无须导出json (已备后续需求)
    if (config.jsonExport === false) {
      execCodegen(this.terminal, config);
      return;
    }

    if (!config.jsonExportFolder) {
      // 选择导出目录并缓存
      const selFolders = await vscode.window.showOpenDialog({
        title: "请选择导出的文件目录",
        canSelectFolders: true,
        canSelectMany: false,
        filters: { json: ["json"] },
      });

      if (!selFolders || !selFolders.length) {
        return;
      }

      config.jsonExportFolder = selFolders[0].fsPath;
    }

    if (!config.jsonExportName) {
      // 提示保存文件名称
      const exportFileName = await vscode.window.showInputBox({
        value: ".json",
        prompt: "请选择要导出的文件名（json结尾）",
        valueSelection: [0, 0],
        validateInput: async (val: string) => {
          if (!val.endsWith(".json")) {
            return "文件名必须以json结尾。";
          }

          if (val.length < 5) {
            return "请输入合法的导出文件名。";
          }
        },
      });

      if (!exportFileName) {
        return;
      }

      config.jsonExportName = exportFileName;
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "正在导出api文档...",
      },
      async () => {
        await exportJson(treeNode, config);

        execCodegen(this.terminal, config);
      }
    );
  }
}

/** 执行代码生成 */
async function exportJson(treeNode: ApiDocBaseNode, config: ApiCodeGenConfig) {
  let exportFolder = config.jsonExportFolder;

  if (utils.isRelativePath(exportFolder)) {
    exportFolder = pathUtil.join(config.wsPath, exportFolder);
  }

  if (!fsUtil.pathExistsSync(exportFolder)) {
    vscodeUtil.showWarningMessage(`文件夹${exportFolder}不存在。`);
    return;
  }

  let exportPath = pathUtil.join(exportFolder, config.jsonExportName);

  // 获取导出数据
  let res = await treeNode.apiProjectService.fetchExportData();

  // 保存json文件
  await fsUtil.writeJson(exportPath, res, { spaces: 2 });
}

/** 执行代码生成 */
function execCodegen(terminal: vscode.Terminal, config: ApiCodeGenConfig) {
  terminal.sendText(`cd ${config.wsPath} && ${config.command}`, true);
  terminal.show(true);
}
