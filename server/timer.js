const ping = require('ping');
const webDriver = require('selenium-webDriver');
const chrome = require('selenium-webDriver/chrome');
const logger = require('./logger')();

function genDriver() {
  let driver;
  var options = new chrome.Options();
  options.addArguments("--disable-popup-blocking");
  options.addArguments("no-sandbox");
  options.addArguments("disable-extensions");
  options.addArguments("no-default-browser-check");
  options.addArguments("headless");

  // if (chrome.getDefaultService() == null) {
  //   var service;

  //   // exe 安装之后在根目录找到chromedriver.exe
  //   if (fs.existsSync(path.join(__dirname, '../../chromedriver.exe'))) {
  //     console.log(path.join(__dirname, '../../chromedriver.exe'));
  //     service = new chrome.ServiceBuilder(path.join(__dirname, '../../chromedriver.exe')).build();
  //   }

  //   // 开发过程中寻找 chromedriver
  //   if (fs.existsSync(path.join(__dirname, '../chromedriver.exe'))) {
  //     console.log(path.join(__dirname, '../chromedriver.exe'));
  //     service = new chrome.ServiceBuilder(path.join(__dirname, '../chromedriver.exe')).build();
  //   }

  //   chrome.setDefaultService(service);
  // }

  driver = new webDriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  return driver;
}

class Timer {
  constructor() {
    this.username = '';
    this.password = '';
    this.time = null;
    this.timer = null;
    this.loginAction = false;  // 是否正在登录标识
    this.loginSucTimes = 0;  // 记录登录成功次数
  }
  start(username, password, time = 3000) {
    this.username = username;
    this.password = password;
    this.time = time;
    if (!username || !password) {
      throw new Error('用户名或密码不能为空');
    } else {
      this.refresh();
    }
  }

  refresh() {
    this.timer = setTimeout(() => {
      this.watchInternet();
    }, this.time);
  }

  stop() {
    clearTimeout(this.timer);
    this.timer = null;
    this.loginAction = false;
  }

  pause() {
    clearTimeout(this.timer);
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
    if (this.timer !== null) {
      if (!online) {
        if (this.loginAction === false) {
          try {
            logger.info('网络已断开，正在尝试重新登录');
            await this.loginBySelenium();
          } catch (error) {
            logger.error(String(error));
          }
        } else {
          logger.info('登录尝试失败，请检查用户名和密码是否正确');
          this.loginAction = false;
        }
      }
      if (online && this.loginAction === true) {
        this.loginSucTimes += 1;
        logger.info(`登录成功，已成功登录${this.loginSucTimes}次`);
        this.loginAction = false;
      }
      this.refresh();
    }
  }

  async loginByPuppeteer() {
    const loginUrl = 'http://191.80.1.254/ac_portal/20220831163936/pc.html';
    const browser = await puppeteer.launch(
      {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    );
    const page = await browser.newPage();
    await page.goto(loginUrl);
    // 输入用户名和密码
    await page.type('#password_name', this.username);
    await page.type('#password_pwd', this.password);
    // 找到id为password_disclaimer的复选框选中
    await page.click('#password_disclaimer');
    // 找到id为password_submitBtn的按钮点击
    await page.click('#password_submitBtn');
    // 将loginAction设置为true，表示发生过登录操作
    this.loginAction = true;
    await browser.close();
    await browser.quit();
  }

  async loginBySelenium() {
    const loginUrl = 'http://191.80.1.254/ac_portal/20220831163936/pc.html';
    // 设置无头模式
    const driver = genDriver();

    // 打开登录页面
    await driver.get(loginUrl);
    // 输入用户名和密码
    await driver.findElement(webDriver.By.id('password_name')).sendKeys(this.username);
    await driver.findElement(webDriver.By.id('password_pwd')).sendKeys(this.password);
    // 找到id为password_disclaimer的复选框选中
    await driver.findElement(webDriver.By.id('password_disclaimer')).click();
    // 找到id为password_submitBtn的按钮点击
    await driver.findElement(webDriver.By.id('password_submitBtn')).click();
    // 将loginAction设置为true，表示发生过登录操作
    this.loginAction = true;

    await driver.close();
    await driver.quit();
  }

  async resetPath() {
    const loginUrl = 'http://191.80.1.254/ac_portal/20220831163936/pc.html';
    // 设置无头模式
    const driver = genDriver();

    // 打开登录页面
    await driver.get(loginUrl);
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
module.exports = (function () {
  let instance;
  return function (username, password) {
    if (!instance) {
      instance = new Timer(username, password);
    }
    return instance;
  };
})();
