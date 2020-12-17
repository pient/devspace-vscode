# DevSpace

## 开发

### 主要命令

### 准备

```bash
npm i rimraf typescript -g
```

#### lerna bootstrap

启动 Lerna

过程：

- 为每个包安装依赖
- 链接相互依赖的库到具体的目录
- 执行 npm run prepublish
- 执行 npm run prepare

```bash
npm config set package-lock false
lerna bootstrap

# 构建client，否则delieveries/admin无法启动
cd packages/client && npm run build

# 安装node-sass遇到超时问题
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

#### lerna add

添加一个包的版本为各个包的依赖

```bash
lerna add <package>[@version] [--dev] [--exact]

# eg. 将core依赖添加到@devspace/apidoc
lerna add @devspace/core --scope @devspace/apidoc
lerna add @devspace/core --scope vscode-plugin-devspace
```

#### lerna clean

删除各个包下的 node_modules

#### lerna link

链接互相引用的库

#### lerna create

新建包

## 运维

### Redis安装部署

#### Windows

1. 要安装Redis，首先要获取安装包。Windows的Redis安装包需要到以下GitHub链接找到Release，点击前往下载页面。
    链接：[https://github.com/MSOpenTech/redis](https://github.com/MSOpenTech/redis)。
2. 下一步、下一步

参考：
[windows下Redis的安装和使用](https://www.cnblogs.com/liuqingzheng/p/9831331.html)

#### CentOs

```bash
# 安装
cd /opt/pkgs
wget http://download.redis.io/releases/redis-3.2.6.tar.gz

tar xzf redis-3.2.6.tar.gz
cd redis-3.2.6
make
make test
sudo make install
cd utils
chmod +x install_server.sh

mkdir -p /opt/ops/redis

./install_server.sh

# 提示及相应参数
# Please select the redis port for this instance: # [6379]
# Selecting default: 6379
# Please select the redis config file name [/etc/# redis/6379.conf] /opt/ops/redis/etc/6379.conf
# Please select the redis log file name [/var/log/# redis_6379.log] /opt/ops/redis/log/redis_6379.log
# Please select the data directory for this instance # [/var/lib/redis/6379] /opt/ops/redis/lib/6379
# Please select the redis executable path [/usr/local/# bin/redis-server] /opt/ops/redis/bin/redis-server

# Selected config:
# Port           : 6379
# Config file    : /opt/ops/redis/etc/6379.conf
# Log file       : /opt/ops/redis/log/redis_6379.log
# Data dir       : /opt/ops/redis/lib/6379
# Executable     : /usr/local/bin/redis-server
# Cli Executable : /usr/local/bin/redis-cli

sudo chkconfig --level 2345 redis_6379 on

service redis_6379 status
service redis_6379 start
```

### Mongo安装部署

```bash
# 备份
mongodump -d zeros -o <path>
# 还原
mongorestore -d zeros --drop <path>
```

## 常用命令

```bash
# Windows下(删除指定后缀文件)
del /a /f /s /q  "*.js" "*.js.map"
```

## 参考

- [lerna Github](https://github.com/lerna/lerna)
- [lerna 的基础使用](https://www.jianshu.com/p/8b7e6025354b)
