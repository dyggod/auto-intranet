/**
 * 实现一个logger类，用于记录日志
 * 1. 有info、debug、error三种日志级别
 * 2. 可以写入日志、读取日志
 * 3. 日志消息格式为：{ type: 'info', msg: 'hello world', time: '2019-01-01 00:00:00' }
 *   或者 'info: hello world 2019-01-01 00:00:00'的字符串
 */
class Logger {
  constructor() {
    this.log = {
      info: [],
      debug: [],
      error: []
    }
  }
  // 输入日志内容和type，转换为日志消息格式
  convert(msg, type) {
    // 如果没有type，则默认为info
    if (!type) {
      type = 'info';
    }
    // 如果没有type 且 msg 符合'info: hello world 2019-01-01 00:00:00'的格式
    if (!type && msg.match(/^[a-z]+: .+ \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      const [type, msg, time] = msg.split(': ');
      return { type, msg, time };
    }
    return { type, msg, time: new Date().toLocaleString() };
  }

  info(msg) {
    this.log.info.push(this.convert(msg, 'info'));
  }
  debug(msg) {
    this.log.debug.push(this.convert(msg, 'debug'));
  }
  error(msg) {
    this.log.error.push(this.convert(msg, 'error'));
  }
  read(type) {
    return this.log[type];
  }
  write(type, msg) {
    this.log[type].push(this.convert(msg, type));
  }
}

// 返回单例
module.exports = (function() {
  let instance;
  return function() {
    if (!instance) {
      instance = new Logger();
    }
    return instance;
  };
})();
