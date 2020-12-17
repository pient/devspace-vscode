/* eslint-disable @typescript-eslint/naming-convention */
import * as _ from "lodash";
import * as Handlebars from "handlebars";

// 默认帮助方法
Handlebars.registerHelper({
  iif: (flag, v1, v2) => (flag ? v1 : v2),
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
    return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  },
  in() {
    return Array.prototype.slice.call(arguments, 1).includes(arguments[0]);
  },
  nin() {
    return !Array.prototype.slice.call(arguments, 1).includes(arguments[0]);
  },
  replace: (v1: string, v2: string, v3: string, flag?: string) => {
    return (v1 || "").replace(new RegExp(v2, flag), v3);
  },
  def_val: (type: string, defaultValue: any) => getDefaultValue(type, defaultValue),
  escape: (v1: string) => escape(v1),
  get: (v1, path) => _.get(v1, path),
  api_name: (v1: string) => getApiName(v1),
  api_obj_name: (v1: string, flag?: number) => {
    let apiName = getApiName(v1);
    let objName = _.camelCase(apiName);

    if (flag !== 0) {
      objName = _.upperFirst(objName);
    }

    return objName;
  },
  api_list: (v1: any) => {
    let result = _.get(v1, "properties.result");

    if (!result) {
      return [];
    }

    if (result.type === "array") {
      return result;
    }

    return _.get(result, "properties.list");
  },
});

export default Handlebars;

/** 根据接口路径获取接口名称 */
function getApiName(path: string) {
  const paths = path.split("/");

  let result: string[] = [];

  paths.forEach((path) => {
    if (!/\{.+\}/.test(path) && path) {
      result.push(path);
    }
  });

  return result.join("_");
}

/** 根据类型名获取默认值 */
function getDefaultValue(type: string, defaultValue: any) {
  if (typeof defaultValue === "string") {
    return defaultValue;
  }

  switch (type) {
    case "string":
      return "''";
    case "array":
      return "[]";
    default:
      return "undefined";
  }
}

function escape(v1: string) {
  return v1.replace(/(['"])/g, "\\$1");
}
