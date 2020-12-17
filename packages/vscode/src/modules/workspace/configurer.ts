import { vscode, fsUtil, pathUtil, Constants, vscodeUtil, requireUtil } from "../../core";

import { ProjectConfig } from "./types";

// eslint-disable-next-line @typescript-eslint/naming-convention
const __configs: { [key: string]: ProjectConfig } = {};

// eslint-disable-next-line @typescript-eslint/naming-convention
let __loaded = false;

export default class WorkspaceConfigurer {
  /**
   * 加载配置
   * @param force 清空原配置，并强制重新加载
   */
  static async load(force?: boolean): Promise<void> {
    if (force !== true && __loaded) {
      return;
    }

    if (force === true) {
      // 清空configs
      for (let key in __configs) {
        delete __configs[key];
      }
    }

    // 判断根目录下是否有配置文件
    let loaded = await WorkspaceConfigurer.loadConfig();

    // 如果没有，则加载子文件夹配置
    if (!loaded) {
      let fstats = fsUtil.readdirSync(vscode.workspace.rootPath, {
        withFileTypes: true,
      });

      for (let i = 0; i < fstats.length; i++) {
        if (fstats[i].isDirectory) {
          WorkspaceConfigurer.loadConfig(fstats[i].name);
        }
      }
    }

    __loaded = true;

    vscodeUtil.logDebug("加载配置信息：" + JSON.stringify(__configs));
  }

  /**
   * 获取所有配置
   */
  static getConfigs(): ProjectConfig[] {
    return Object.values(__configs);
  }

  /**
   * 获取配置
   * @param name 配置文件名
   */
  static getConfig(name?: string): ProjectConfig | undefined {
    return __configs[name || "."];
  }

  /** 获取可选api标签 */
  static getApiTags(name?: string): string[] {
    let config = WorkspaceConfigurer.getConfig(name);
    if (config.apiDoc) {
      return config.apiDoc.apiTags;
    }
    return [];
  }

  /**
   *
   * @param root 默认workspace root
   * @param name workspace下目录，若不存在，则root为 workspace root
   */
  private static async loadConfig(rootDir?: string, name?: string): Promise<boolean> {
    let wsFolders = vscode.workspace.workspaceFolders;

    if (!wsFolders || !wsFolders.length) {
      return;
    }

    let rootPath = wsFolders[0].uri.fsPath;

    if (rootDir) {
      if (name) {
        rootPath = rootDir;
      } else {
        name = rootDir;
      }
    }

    name = name || ".";
    const cfgDir = pathUtil.join(rootPath, name);
    const cfgPath = pathUtil.join(cfgDir, Constants.zfConfigFile);

    // 判断文件是否存在
    let exists = fsUtil.existsSync(cfgPath);

    if (!exists) {
      return false;
    }

    // 清除配置文件缓存，并重新获取配置文件
    requireUtil.clearRequireCache(cfgPath);

    let cfg = require(cfgPath);

    let cfgName = cfg.name || name;
    // 路径为根路径，则配置文件命名为根路径名
    if (cfgName === ".") {
      cfgName = pathUtil.basename(rootPath);
    }

    cfg.id = name; // 配置文件名（key）
    cfg.name = cfgName; // 配置文件名称
    cfg.path = cfgDir; // 配置文件所在路径

    __configs[cfg.id] = cfg;

    // 加载配置
    return true;
  }
}
