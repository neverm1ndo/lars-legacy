import { app, BrowserWindow, dialog, ipcMain, Tray, protocol, clipboard } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as winStateKeeper from 'electron-window-state';
import * as path from 'path';
import * as url from 'url';
import { verifyUserToken, downloadFile, createTray, showNotification } from './utils.main';

/** Init main window
* @type {BrowserWindow}
*/
export let win: BrowserWindow = null;
/** Init splash window
* @type {BrowserWindow}
*/
export let splash: BrowserWindow = null;

/** Define launch arguments
* @type {Array.<string>}
*/
const args: string[] = process.argv.slice(1),
      serve = args.some(val => val === '--serve');

/** Init system tray
* @type {Tray>}
*/
let tray: Tray;
/** Creates splash window
*/
function splashWindow() {
  splash = new BrowserWindow({
    width: 450,
    height: 300,
    backgroundColor: '#3A3F52',
    resizable: false,
    icon: path.join(__dirname, 'src/assets/icons/favicon.ico'),
    frame: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      allowRunningInsecureContent: true
    }
  });
  // splash.setAlwaysOnTop(true);
  splash.center();
  splash.setMenu(null);
  splash.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/assets/splash.html'),
    protocol: 'file:'
  }));
  splash.once('ready-to-show', () => {
    splash.show();
    splash.webContents.executeJavaScript('changeStatus("Загрузка основного модуля", 60);', true)
  })
  splash.on('closed', () => {
    splash = null;
  });
}

/** Creates main window
*/
function createWindow(): BrowserWindow {
  /** Window state manager. Keeps window size, position etc.
  * @type {winStateKeeper.State}
  */
  let state: winStateKeeper.State = winStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 600
  });

  win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minHeight: 580,
    minWidth: 950,
    title: 'LARS',
    show: false,
    frame: false,
    icon: path.join(__dirname, 'src/assets/icons/favicon.ico'),
    backgroundColor: '#3A3F52',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: (serve)? false: true,
      allowRunningInsecureContent: true,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
    },
  });

  /** Main window Ready-To-Show event handler */
  win.once('ready-to-show', () => {
    if (!serve) autoUpdater.checkForUpdatesAndNotify();
    splash.webContents.executeJavaScript('changeStatus("Проверка токена авторизации", 85);', true)
    verifyUserToken().then(() => {
        splash.webContents.executeJavaScript('changeStatus("Токен успешно верифицирован", 100);', true);
      })
      .catch((err)=> {
        win.webContents.send('token-verify-denied', true);
        console.error(err);
        splash.webContents.executeJavaScript(`changeStatus("Токен не прошел верификацию: ${err.code}", 100);`, true);
      })
      .catch((err) => {
        win.webContents.send('token-verify-denied', true);
        splash.webContents.executeJavaScript(`changeStatus("Токен отсутствует: ${err.message}", 100);`, true);
      }).finally(() => {
        setTimeout(() => {
          splash.close();
          win.show();
          state.manage(win);
        }, 2000);
      })
  });

  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL('https://libertyapp.nmnd.ru');
  }
  protocol.registerFileProtocol('lars', (request, callback) => {
    const url = request.url.substr(7);
    callback({path: path.join(__dirname, 'dist', url)});
  })
  win.on('show', (event: any) => {
    if (tray) tray.destroy();
  })
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    app.quit();
  });

  return win;
}

/** IPC */
ipcMain.on('download-file', (event, conf) => {
  downloadFile(conf);
});
ipcMain.on('minimize-to-tray', (event) => {
  event.preventDefault();
  win.hide();
  tray = createTray();
})
ipcMain.on('close', () => {
  win.close();
})
ipcMain.on('minimize', () => {
  win.minimize();
})
ipcMain.on('reload', () => {
  win.reload();
})
ipcMain.on('notification', (event, options) => {
  showNotification(options)
});
ipcMain.handle('message-box', (event: Electron.IpcMainInvokeEvent, opts: Electron.MessageBoxOptions) => {
  return dialog.showMessageBox(opts);
})
ipcMain.handle('save-dialog', (event: Electron.IpcMainInvokeEvent, opts: Electron.SaveDialogOptions) => {
  return dialog.showSaveDialog(opts);
})
ipcMain.handle('open-dialog', (event: Electron.IpcMainInvokeEvent, opts: Electron.OpenDialogOptions) => {
  return dialog.showOpenDialog(opts);
})
ipcMain.handle('clipboard', (event: Electron.IpcMainInvokeEvent, str: string) => {
  clipboard.writeText(str);
});

/** AutoUpdater handlers */
autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});
autoUpdater.on('checking-for-update', () => {
  splash.webContents.executeJavaScript(`changeStatus("Проверка наличия обновлений:", 20);`, true);
});
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Перезапустить', 'Отложить'],
    title: 'Обновление приложения',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'Новая версия уже загружена. Перезапустите приложение, чтобы принять изменения.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  })
})
autoUpdater.on('error', message => {
  console.error('Ошибка при попытке обновить приложение');
  console.error(message);
  dialog.showErrorBox('Ошибка при попытке обновить приложение', message.message);
})
/********************************************/

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(() => splashWindow(), 400);
    createWindow();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
  if (serve) {
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      // On certificate error we disable default behaviour (stop loading the page)
      // and we then say "it is all fine - true" to the callback
      event.preventDefault();
      callback(true);
    });
  }

} catch (e) {
  console.error(e);
  dialog.showErrorBox('Ошибка', e);
}
