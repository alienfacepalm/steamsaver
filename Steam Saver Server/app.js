const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');

const Server = require('./lib/server');
const SystemTray = require('./lib/system_tray');
const Screenshots = require('./lib/screenshots');

const PORT = 10003;

let win = null;
let appIcon = null;

app.on('ready', () => {
  win = new BrowserWindow({show: false});
  
  const server = new Server(PORT);
  server.start();

  let systemTray = new SystemTray;
  systemTray.initialize(win, appIcon, server);
  appIcon = systemTray.icon;

});