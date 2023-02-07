const { app, BrowserWindow } = require('electron');
require('./electron/menu');
// 运行web.js
require('./server/web');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
    },
    // titleBarStyle: 'hidden',
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


// 接管ctrl+R，禁止刷新
app.on('web-contents-created', (e, contents) => {
  contents.on('before-input-event', (e, input) => {
    if (input.control && input.key.toLowerCase() === 'r') {
      e.preventDefault();
    }
  });
})
