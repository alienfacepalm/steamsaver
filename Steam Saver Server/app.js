const {app, Tray, Menu, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const ip = require('ip');

const Server = require('./lib/server');
const SystemTray = require('./lib/system_tray');
const Screenshots = require('./lib/screenshots');
const Settings = require('./lib/settings');

const port = require('./settings').port;

let win = null;
let appIcon = null;

app.on('ready', () => {
  win = new BrowserWindow({width: 1024, height:600, frame: false});
  win.setMenu(null);

  const settings = new Settings(app.getPath('userData'));

  const server = new Server(app, port);
  server.initialize();

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

  ipcMain.on('add-directory-click', (directory) => {
    //this.settings.save() the directory;
  });

  ipcMain.on('dom-ready', () => {
    win.webContents.send('address', `http://${ip.address()}:${port}`);
  });

});