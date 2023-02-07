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
  timerInstance = getTimer(username, password);
  timerInstance.start();
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
  const loggers = loggerInstance.read('info');
  res.send(resFactory(loggers));
});

// 错误处理
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
})


app.listen(10256);
loggerInstance.info('服务启动成功，监听10256端口');
