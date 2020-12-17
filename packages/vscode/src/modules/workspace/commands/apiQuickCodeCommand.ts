import { vscode, Constants, templateUtil, vscodeUtil } from "../../../core";
import { ApiNode } from "../nodes";

import WsBaseCommand from "./base";

/**
 * 快速生成ApiDoc相关代码
 */
export default class extends WsBaseCommand {
  get name(): string {
    return Constants.cmdWorkspaceApiDocQuickCode;
  }

  async method(treeNode: ApiNode) {
    // 获取代码模板
    let qcConfig = treeNode.apiProjectService.apiDocConfig.quickcode;

    if (!qcConfig || !qcConfig.api) {
      vscodeUtil.showWarningMessage(`暂无代码模板，请在"${Constants.zfConfigFile}"文件中进行设置`);
      return;
    }

    let apiQcTemplates = qcConfig.api;
    let tagName = treeNode.tagName;

    let qcTemplates = Object.keys(apiQcTemplates).reduce((tmps, key: string) => {
      let t = apiQcTemplates[key];

      if (!t) {
        return tmps;
      }

      if (!tagName || !t.tag || t.tag.includes(tagName)) {
        tmps[key] = t;
      }

      return tmps;
    }, {});

    let qcTemplateName = await vscode.window.showQuickPick(Object.keys(qcTemplates));
    if (!qcTemplateName) {
      return;
    }

    let qcTemplate = qcTemplates[qcTemplateName];

    let snippets = [];

    if (qcTemplate && qcTemplate.body) {
      if (Array.isArray(qcTemplate.body)) {
        snippets = qcTemplate.body;
      } else if (typeof qcTemplate.body === "string") {
        snippets = [qcTemplate.body];
      }
    }

    if (!snippets.length) {
      return;
    }

    let renderOptions = Object.assign(
      {
        noEscape: true,
        autoReturn: false,
        apiDetail: qcTemplate.apiDetail,
      },
      qcTemplate.renderOptions
    );

    let autoReturn = renderOptions.autoReturn;

    let templateSpec = snippets.reduce((out, cur, index) => {
      out += cur;

      if (cur && autoReturn) {
        out += "\r";
      }

      return out;
    }, "");

    // 如果需要，则加载详细信息
    if (renderOptions.apiDetail !== false && !treeNode.isDetailData) {
      await this._provider.reload(treeNode);
    }

    let apiData = treeNode.data;

    let renderData = {
      api: apiData,
      cat: treeNode.apiCategoryNode.data,
      project: treeNode.apiProjectNode.data,
    };

    // 渲染代码
    let renderFn = templateUtil.compile(templateSpec, renderOptions);
    let output = renderFn(renderData);

    if (!output) {
      await vscodeUtil.showInformationMessage("没有生成任何代码, 请确认接口出参是否符合规则.");
      return;
    }

    // 获取当前文档位置
    let activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
      await vscodeUtil.showInformationMessage("请打开要插入代码的文档，并定位到插入代码的位置.");
      return;
    }

    await activeEditor.edit((edit) => {
      edit.replace(activeEditor.selection, output);
    });
  }
}
