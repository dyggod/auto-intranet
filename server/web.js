// 使用express启动一个web服务器，监听96160端口

const express = require('express');

const { resFactory } = require('./utils');

const getTimer = require('./timer');
let loggerInstance = require('./logger')();


const app = express();

let timerInstance = null;

app.get('/', (req, res) => {
  res.send('electron app is running');
});

// 获取当前定时器状态
app.get('/status', (req, res) => {
  const status = timerInstance ? timerInstance.getStatus() : 0;
  res.send(resFactory(status));
});

// 启动
app.get('/start', (req, res) => {
  const { username, password } = req.query;
  // 启动定时器
  timerInstance = getTimer();
  timerInstance.start(username, password);
  res.send(resFactory('start'));
  loggerInstance.info('监测开始');
});

// 停止
app.get('/stop', (req, res) => {
  timerInstance.stop();
  res.send(resFactory('stop'));
  loggerInstance.info('监测停止');
});

// log日志
app.get('/log', (req, res) => {
  const loggers = loggerInstance.readAll();
  res.send(resFactory(loggers));
});

// 错误处理
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
})


let port = 10256;

const server = app.listen(port);

// 注册错误处理，当端口被占用时，会触发，然后端口号自增，直到找到可用端口
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    loggerInstance.error(`端口${port}被占用，正在尝试使用端口${port + 1}`);
    // 一秒后重试
    setTimeout(() => {
      server.close();
      server.listen(++port);
    }, 1000);
  }
});

// 如果注册成功，打印日志
server.on('listening', () => {
  loggerInstance.info(`服务启动成功，监听${port}端口`);
});

