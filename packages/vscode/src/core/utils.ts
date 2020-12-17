/**
 * 帮助方法
 */

import open from "open";
import fastStringify from "fast-safe-stringify";

import { helpers } from '@devspace/vscode-core';

// 指定路径是否相对路径
function isRelativePath(path: string) {
  return path.indexOf(":") < 0;
}

export default {
  ...helpers,
  openLink: open, // 打开外部链接
  stringify: fastStringify, // stringify json
  isRelativePath
};
