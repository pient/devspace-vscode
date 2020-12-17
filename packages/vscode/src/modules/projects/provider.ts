import { ExplorerNode, ExplorerProvider } from "../../core";

// 项目数据提供
export default class ProjectsProvider extends ExplorerProvider {
  constructor() {
    super();
    this.nodes = [new ExplorerNode("首页")];

    // this.nodes = [
    //   new ExplorerNode("常用", [
    //     new ExplorerNode("欢迎使用"),
    //     new ExplorerNode("收藏"),
    //     new ExplorerNode("最近"),
    //     new ExplorerNode("相关", [
    //       new ExplorerNode("YApi"),
    //       new ExplorerNode("Stellar"),
    //       new ExplorerNode("蓝湖"),
    //       new ExplorerNode("PMS"),
    //       new ExplorerNode("GitLab"),
    //       new ExplorerNode("文档"),
    //       new ExplorerNode("权限"),
    //       new ExplorerNode("ZKE"),
    //     ]),
    //   ]),
    //   new ExplorerNode("项目组", [
    //     new ExplorerNode("财务共享", [
    //       new ExplorerNode("用户工作台"),
    //       new ExplorerNode("资产"),
    //       new ExplorerNode("采购系统"),
    //       new ExplorerNode("库存"),
    //       new ExplorerNode("供应商门户"),
    //     ]),
    //     new ExplorerNode("前端", [new ExplorerNode("博客")]),
    //   ]),
    // ];
  }
}
