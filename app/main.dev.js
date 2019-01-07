/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import _ from 'lodash';
import log from 'electron-log';
import MenuBuilder from './menu';
import amqp from './main/amqp/amqp';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 1070,
    useContentSize: true,
    height: 650
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});

const blackList = [
  null,
  '',
  'amq.direct',
  'amq.fanout',
  'amq.headers',
  'amq.match',
  'amq.rabbitmq.log',
  'amq.rabbitmq.trace',
  'amq.topic'
];

ipcMain.on('createConnection', (e, options) => {
  console.log('Connect event from renderer');
  amqp.createConnection(options, (initErr, exchanges) => {
    console.log('Connected');
    if (initErr || !exchanges) {
      mainWindow.send('error', initErr);
    }
    // Strip out system exchanges
    const validExchanges = _.filter(
      exchanges,
      ex =>
        blackList.indexOf(ex.name) === -1 &&
        !ex.name.includes('inspection.mobile')
    );
    mainWindow.send('ready', validExchanges);
  });
});

ipcMain.on('bindExchanges', (e, exchanges) => {
  console.log('Binding Exchanges');
  amqp.bindExchanges(exchanges, bindErr => {
    if (bindErr) {
      mainWindow.send('error', bindErr);
    } else {
      mainWindow.send('bindComplete');
    }
  });
});

amqp.on('message', msg => {
  console.log('Sending message to window');
  mainWindow.send('message', msg);
});

amqp.on('error', err => {
  if (!err) {
    err = 'Unknown';
  }
  mainWindow.send('error', err);
});

ipcMain.on('publish', (e, msg) => {
  console.log('Message from view');
  amqp.publish(msg, publishErr => {
    if (publishErr) {
      mainWindow.send('error', publishErr);
    }
  });
});

ipcMain.on('pause', () => {
  amqp.pauseConsume();
});

ipcMain.on('resume', () => {
  amqp.resumeConsume();
});
