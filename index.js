const ping = require('ping');
const commander = require('commander');

const { Builder } = require('selenium-webdriver');

const program = new commander.Command();
program.command('start')
  .description('开始监测内网登录状态......')
  .option('-u, --username <username>', '用户名', '董滢纲')
  .option('-p, --password <password>', '密码', '123456')
  .option('-t, --time <time>', '检测时间间隔', 3000)
  .action(main)

let username;
let password;
let time;
let timer = null;

/**
 * 主函数，配置内网登录的用户名和密码
 * 执行监听函数
 */
function main(cwd, options) {
  console.log('监听正在执行，参数列表为：', cwd);
  username = cwd.username;
  password = cwd.password;
  time = cwd.time;
  start();
};

function start() {
  timer = setTimeout(() => {
    watchInternet();
  }, time);
}

function pause() {
  clearTimeout(timer);
  timer = null;
}


/**
 * 调用系统ping命令，检测电脑是否联网
 */
async function isOnline() {
    const { alive } = await ping.promise.probe('www.baidu.com');
    return alive;
};


/**
 * 监听网络状态，如果断网，则调用login函数
 * 定义一个定时器，每隔一段时间调用一次自身
 * @param {Number} time 检测时间间隔
 */

async function watchInternet(time) {
  const online = await isOnline();
  if (!online) {
    try {
      console.log('\x1b[33m%s\x1b[0m', '网络断开，尝试重新登录...');
      await login();
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', '登录失败，正在重试...');
    }
  }
  start();
}

/**
 * 打开chrome浏览器，填写用户名和密码，然后提交
 */
async function login() {
  const loginUrl = 'http://191.80.1.254/ac_portal/20220831163936/pc.html?template=20220831163936&tabs=pwd&vlanid=0&_ID_=0&switch_url=&url=http://191.80.1.254/homepage/index.html&controller_type=&mac=f4-6b-8c-8b-6f-10';
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get(loginUrl);
  await driver.findElement({ id: 'password_name' }).sendKeys(username);
  await driver.findElement({ id: 'password_pwd' }).sendKeys(password);
  await driver.findElement({ id: 'password_disclaimer' }).click();
  await driver.findElement({ id: 'password_submitBtn' }).click();
  console.log('\x1b[32m%s\x1b[0m', '登录成功');
  // 关闭浏览器并退出driver
  await driver.close();
  await driver.quit();
}


// 执行
program.parse(process.argv).version('1.0.0');
