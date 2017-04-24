const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');

const Server = require('./lib/server');
const Screenshots = require('./lib/screenshots');

const PORT = 10003;
const iconPath = path.join(__dirname, 'assets/icon.png');

let appIcon = null;
let win = null;

app.on('ready', () => {
  win = new BrowserWindow({show: false});

  let screenshots = new Screenshots;
  screenshots.initialize();
 
  let server = new Server(PORT);
  server.start();

  //Tray Menu
  appIcon = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      submenu: [
        { 
          label: 'Manage Directories',
          click: () => {
            win.show();
          }
        }
      ]
    },
    {
      label: 'Server',
      submenu: [
         {
            label: "Toggle",
            click: () => {
                server.running ? server.stop() : server.start()
            }
         }
      ]
    },
    {
      label: 'Options',
      submenu: [
         {
          label: 'Developer Tools',
          click: () => {
            win.show();
            win.toggleDevTools();
          }
        }
      ]
    },
    { 
      label: 'Quit',
      selector: 'terminate:',
    }
  ]);
  appIcon.setToolTip(`Steam Saver`);
  appIcon.setContextMenu(contextMenu);

});