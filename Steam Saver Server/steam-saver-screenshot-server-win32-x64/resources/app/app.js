const {app, Tray, Menu, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const ip = require('ip');

const Server = require('./lib/server');
const SystemTray = require('./lib/system_tray');
const Screenshots = require('./lib/screenshots');

const settings = require('./settings'); 

const PORT = settings.port;

let win = null;
let appIcon = null;

app.on('ready', () => {

  win = new BrowserWindow({width: 1024, height:600, frame: false});
  win.setMenu(null);

  const server = new Server(PORT, win);
  server.initialize(win);

  let systemTray = new SystemTray;
  systemTray.initialize(win, appIcon, server);
  appIcon = systemTray.icon;

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  ipcMain.on('close-click', () => {
    win.hide();
  });

  ipcMain.on('dom-ready', () => {
    console.log(`DOM ready send info`);
    win.webContents.send('address', `http://${ip.address()}:${PORT}`);
  });

});