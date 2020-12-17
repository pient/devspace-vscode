/** 加载特定文件夹下符合规则的模块，参考sailsjs include all */
import * as path from "path";
import * as fs from "fs";
import * as _ from "lodash";

interface IncludeAllOptions {
  dirname: string; // 初始目录
  filter?: RegExp; // 正则表达式，根据名字过滤特定文件
  excludeDirs?: RegExp; // 相对于filter，黑名单过滤器
  exclude?: string[]; // 排除路径，excludeDirs补充
  depth?: number; // 查询文件最大深度，默认没有最大深度
  optional?: boolean; // 设置后，轮询出错，继续执行
  ignoreRequireFailures?: boolean; // 设置后，获取模块出错，继续执行
  dontLoad?: boolean; // 设置后，只返回模块是否存在，而不加载模块
  force?: boolean; // 设置后，将清除模块缓存，并重新请求模块，默认为true
  flatten?: boolean; // 设置后，所有模块（包括子模块）保持在顶级
  keepDirectoryPath?: boolean; // flatten为true生效，设置后，在key中包含了相对路径名
  allowDuplicateKeys?: boolean; // 是否允许重复key，否则报错， 默认不允许
}

export function includeAll(options: IncludeAllOptions) {
  options = Object.assign(
    {
      force: true,
      filter: /(.*)/,
    },
    options
  );

  // 获取绝对路径名
  let contextPath = path.resolve(options.dirname);

  // 循环导入模块
  let modules = recursivelyIncludeAll(contextPath, 0, contextPath, options);

  return modules;
}

// 清理路径下缓存
export function clearRequireCache(filepath: string) {
  let resolved = require.resolve(filepath);

  // 判断该以来是否被cache
  if (require.cache[resolved]) {
    // 如果是，则将其加入移除队列
    let modulesToRemove = [require.cache[resolved]];

    // 如果有items在队列中
    while (modulesToRemove.length) {
      // 移除一个
      let moduleToRemove = modulesToRemove.pop();

      // 并将其子孙加入队列
      let children: any[] = (require.cache[moduleToRemove.id] && require.cache[moduleToRemove.id].children) || [];

      // 不要重缓存中清理已经编译过的模块
      children = _.reject(children, function (child) {
        return child.id.match(/\.node$/);
      });

      modulesToRemove = modulesToRemove.concat(children);

      // 从缓存中清理模块
      delete require.cache[moduleToRemove.id];
    }
  }
}

function recursivelyIncludeAll(thisDirname, depth, contextPath, options: IncludeAllOptions) {
  let _modules = {};

  // 超过特定深度，则不再循环
  if (options.depth !== undefined && depth >= options.depth) {
    return;
  }

  // 列出特定文件夹下所有问题
  let files;

  try {
    files = fs.readdirSync(thisDirname);
  } catch (e) {
    if (options.optional) {
      return {};
    } else {
      throw new Error("`include-all` 无法扫描文件夹(`" + thisDirname + "`) .\n Details:" + e.stack);
    }
  }

  // 循环当前目录文件
  files.forEach(function (file) {
    let filepath = path.join(thisDirname, file);
    // `path.join()` 不保留 `./`-- 单由于在require模块时有特殊含义，这里将他还原
    if (thisDirname.match(/^\.\//) && !filepath.match(/^\.\//)) {
      filepath = "./" + filepath;
    }

    // 获取模块相对路径
    let relativePath = path.relative(contextPath, filepath);

    // 判断当前路径是否在 "exclude"过滤中 (黑名单)
    if (
      options.exclude &&
      options.exclude.some((regexp) => {
        return relativePath.match(regexp);
      })
    ) {
      return;
    }

    // 如果当前目标是目录，则开始迭代轮询
    if (fs.statSync(filepath).isDirectory()) {
      // 显示移除指定文件
      if (options.excludeDirs && file.match(options.excludeDirs)) {
        return;
      }

      // 迭代执行recursivelyIncludeAll于子文件夹
      let descendantModules = recursivelyIncludeAll(filepath, depth + 1, contextPath, options);

      // 如果设置了flatten, then fold _our_ direct child modules
      // (grandchildren, if you will) onto ourselves.
      if (options.flatten) {
        _.each(descendantModules, function (rhs, grandchildKey) {
          if (options.keepDirectoryPath) {
            _modules[path.join(path.basename(relativePath), grandchildKey)] = rhs;
          } else {
            if (_modules[grandchildKey]) {
              throw new Error("发现重复的key (`" + grandchildKey + "`).  设置 `keepDirectoryPath: true` 生成命名空间.");
            }
            _modules[grandchildKey] = rhs;
          }
        });
      } else {
        _modules[file] = descendantModules;
      }
    }
    // 如果是文件则，直接执行
    else {
      // 模块key Name
      let keyName;

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // For debugging:
      //
      // console.log('contextPath:',contextPath);
      // console.log('file:',file);
      // console.log('filepath:',filepath);
      // console.log('relativePath:',relativePath);
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

      // 检测 "include" 过滤器 (白名单)，并且计算对应的key名
      if (options.filter) {
        let match = file.match(options.filter);
        if (!match) {
          return;
        }
        keyName = match[1];
      }

      // 如果设置了dontLoad则不加载直接设置为true
      if (options.dontLoad) {
        _modules[keyName] = true;
      }
      // 否则实用require加载模块
      else {
        // 如果force设为true，则先情路require和其下所有子依赖
        if (options.force) {
          clearRequireCache(filepath);
        }

        // 返回module
        try {
          let _module = require(filepath);
          _modules[keyName] = _module.default || _module;
        } catch (e) {
          // 跳过module, 如果设置了`ignoreRequireFailures`
          if (options.ignoreRequireFailures) {
            return;
          } else {
            throw new Error("企图 `require('" + filepath + "')`, 但有错误:\n--\n" + e.stack + "\n--");
          }
        }
      }
    }
  });

  // 返回modules到上一级循环
  return _modules;
}
