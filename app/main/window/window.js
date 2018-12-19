import {app, BrowserWindow, Menu} from 'electron';

const appUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${app.getAppPath()}/index.html`;

let mainWindow = null;

export function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 735,
    useContentSize: true,
    width: 1075
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'Application',
      submenu: [
        {
          label: 'Config',
          click: () => {
            console.log('Opening config');
            mainWindow.webContents.send('config');
          }
        },
        {
          label: 'Exit',
          click () {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]}
  ]);

  Menu.setApplicationMenu(menu);

  mainWindow.loadURL(appUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}
