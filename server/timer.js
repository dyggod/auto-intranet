const ping = require('ping');
const { Builder } = require('selenium-webdriver');
const logger = require('./logger')();

class Timer {
  constructor(username, password, time = 3000) {
    this.username = username;
    this.password = password;
    this.time = time;
    this.timer = null;
    if (!username || !password) {
      throw new Error('用户名或密码不能为空');
    }
  }
  start() {
    this.timer = setInterval(() => {
      this.watchInternet();
    }, this.time);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  pause() {
    clearInterval(this.timer);
  }

  getStatus() {
    return this.timer ? 1 : 0;
  }

  async isOnline() {
    const { alive } = await ping.promise.probe('www.baidu.com');
    return alive;
  }

  async watchInternet() {
    const online = await this.isOnline();
    if (!online) {
        logger.info('网络已断开，正在尝试重新登录...');
        this.pause();
        await this.login();
        this.start();
    }
  }

  async login() {
    const loginUrl = 'http://191.80.1.254/ac_portal/20220831163936/pc.html?template=20220831163936&tabs=pwd&vlanid=0&_ID_=0&switch_url=&url=http://191.80.1.254/homepage/index.html&controller_type=&mac=f4-6b-8c-8b-6f-10';
    const driver = await new Builder().forBrowser('chrome').build();
    await driver.get(loginUrl);
    await driver.findElement({ id: 'password_name' }).sendKeys(this.username);
    await driver.findElement({ id: 'password_pwd' }).sendKeys(this.password);
    await driver.findElement({ id: 'password_disclaimer' }).click();
    await driver.findElement({ id: 'password_submitBtn' }).click();
    logger.info('登录成功一次');
    // 关闭浏览器并退出driver
    await driver.close();
    await driver.quit();
  }

  /**
   * 由于服务器资源限制，无法直接通过接口登录
   */
  // async loginByUrl() {
  //   const loginUrl = 'http://191.80.1.254/ac_portal/login.php';
  //   const rcKey = +(new Date()) + '';
  //   const submitData = {
  //     opr: 'pwdLogin',
  //     userName: this.username,
  //     pwd: do_encrypt_rc4(this.password, rcKey),
  //     auth_tag: rcKey,
  //     rememberPwd: 1,
  //   };
  //   // 将submitData创建FormData
  //   const formData = new FormData();
  //   Object.keys(submitData).forEach(key => {
  //     formData.append(key, submitData[key]);
  //   });
  //   const res = await superagent.post(loginUrl).send(formData);
  // }
}

// 返回单例
module.exports = (function() {
  let instance;
  return function(username, password) {
    if (!instance) {
      instance = new Timer(username, password);
    }
    return instance;
  };
})();
