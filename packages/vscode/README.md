# devspace vscode 插件

devspace vscode 插件，帮助我们快速进行财金应用开发

## 功能

1. 通过 yapi 接口文档快速生成应用

\!\[feature X\]\(images/feature-x.png\)

> Tip: 需要事先设置 yapi 地址

## 要求

要求 vscode 1.46 以上版本，nodejs 12

## 设置

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something

## 问题

Calling out known issues can help limit users opening duplicate issues against your extension.

## 发布问题

Users appreciate release notes as you update your extension.

### 1.0.0

初始发布

---

## 打包

```bash
# 安装打包工具
npm i vsce -g

# 创建publisher
vsce create-publisher <your-publisher-name>

# 开始打包
vsce package

# 查看vsce帮助
vsce -h
```
