# 自动登录内网

## 说明

本项目是个自动登录内网的小工具，主要解决内网下线后，需要手动登录的问题。

目前只支持在windows下使用。

## 使用方法

### 直接使用.exe执行程序

### 使用nodejs脚本

前提条件：
1. 有nodejs环境，版本>8
2. 有npm环境, 版本>5

1. 安装依赖

使用npm 或 pnpm 安装依赖
```bash
npm install

# 或者

pnpm install
```

2. 启动
```bash
node index.js -u 用户名 -p 密码 -t 间隔时间
```
