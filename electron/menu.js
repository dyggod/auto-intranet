const { Menu, app, BrowserWindow } = require("electron");

let menuTemplate = [
  {
    label: "文件",
    submenu: [
      {
        label: "编辑"
      },
      {
        label: "编辑"
      },
    ]
  },
  {
    label: '刷新',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(win => {
            if (win.id > 1) win.close()
          })
        }
        focusedWindow.reload()
      }
    }
  }
];

let menuBuilder = Menu.buildFromTemplate(menuTemplate);

Menu.setApplicationMenu(menuBuilder);
