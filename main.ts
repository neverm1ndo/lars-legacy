import { app, BrowserWindow, dialog, ipcMain, Tray, protocol, clipboard, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as winStateKeeper from 'electron-window-state';
import * as path from 'path';
import * as url from 'url';
import { verifyUserToken, downloadFile, createTray, showNotification, serve, loadFromAsar } from './utils.main';
import Samp, { ServerGameMode } from './samp';
import { Subscription } from 'rxjs';

/** Init samp to get server stats later
* @type {Samp}
*/
const samp: Samp = new Samp(20000);
const $serverInfo: Subscription = new Subscription();

/** Init main window
* @type {BrowserWindow}
*/
export let win: BrowserWindow = null;
/** Prevents second instnce creating
* @type {boolean}
*/
const lock: boolean = app.requestSingleInstanceLock();
             app.setAppUserModelId('ru.nmnd.lars');
 /** Init splash window
 * @type {BrowserWindow}
 */
export let splash: BrowserWindow = null;

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
  splash.center();
  splash.setMenu(null);
  splash.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/splash.html'),
    protocol: 'file:'
  }));
  splash.once('ready-to-show', () => {
    splash.show();
    splash.webContents.send('loading-state', 'Загрузка основного модуля', 30);
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
    icon: path.join(__dirname, 'dist/angular-electron/browser/assets/icons/favicon.ico'),
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
    if (!serve) {
      splash.webContents.send('loading-state', 'Проверка наличия обновлений', 40);
      autoUpdater.checkForUpdatesAndNotify();
    }
    splash.webContents.send('loading-state', 'Проверка токена авторизации', 85);
    verifyUserToken()
      .then(() => {
        splash.webContents.send('loading-state', 'Токен успешно верифицирован', 100);
      })
      .catch((err) => {
        console.error(err);
        win.webContents.send('token-verify-denied', true);
        splash.webContents.send('loading-state', `Токен не прошел верификацию: ${err.code}`, 100);
      })
      .finally(() => {
        setTimeout(() => {
          splash.close();
          win.show();
          state.manage(win);
        }, 500);
      });
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
    const url: URL = new URL(request.url);
    callback({ path: path.join(__dirname, 'dist', 'angular-electron', 'browser', 'assets' , url.pathname) });
  });
  win.on('show', (_event: any) => {
    if (tray) tray.destroy();
  });
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    $serverInfo.unsubscribe();
    app.quit();
  });

  return win;
}

/** IPC */
ipcMain.on('download-file', (_event: Electron.IpcMainEvent, conf) => {
  downloadFile(conf);
});
ipcMain.on('minimize-to-tray', (event: Electron.IpcMainEvent) => {
  event.preventDefault();
  win.hide();
  tray = createTray();
  $serverInfo.unsubscribe();
});
ipcMain.on('close', () => {
  win.close();
});
ipcMain.on('minimize', () => {
  win.minimize();
});
ipcMain.on('reload', () => {
  win.reload();
})
ipcMain.on('notification', (_event: Electron.IpcMainEvent, options) => {
  showNotification(options)
});
ipcMain.handle('server-game-mode', (_event: Electron.IpcMainInvokeEvent, ip: string, port: number): Promise<ServerGameMode> => {
  if (!serve) return samp.getServerInfo(ip, port);
  return samp.testSampServerStats;
});
ipcMain.handle('message-box', (_event: Electron.IpcMainInvokeEvent, opts: Electron.MessageBoxOptions): Promise<Electron.MessageBoxReturnValue> => {
  return dialog.showMessageBox(opts);
});
ipcMain.handle('save-dialog', (_event: Electron.IpcMainInvokeEvent, opts: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue> => {
  return dialog.showSaveDialog(opts);
});
ipcMain.handle('open-dialog', (_event: Electron.IpcMainInvokeEvent, opts: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue> => {
  return dialog.showOpenDialog(opts);
});
ipcMain.handle('clipboard', (_event: Electron.IpcMainInvokeEvent, str: string): void => {
  clipboard.writeText(str);
});
ipcMain.handle('version', (_event: Electron.IpcMainInvokeEvent): string => {
  return app.getVersion();
});
ipcMain.handle('asar-load', (_event: Electron.IpcMainInvokeEvent, assetPath: string): Promise<Buffer> => {
  return loadFromAsar(assetPath);
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
autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Перезапустить', 'Отложить'],
    title: 'Обновление приложения',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'Новая версия уже загружена. Перезапустите приложение, чтобы принять изменения.'
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});
autoUpdater.on('error', message => {
  console.error('Ошибка при попытке обновить приложение');
  console.error(message);
  dialog.showErrorBox('Ошибка при попытке обновить приложение', message.message);
});
/********************************************/

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  if (!lock) {
    app.quit();
  } else {
    app.on('second-instance', (_event: Electron.Event, _commandLine: string[], _workingDirectory: string) => {
      // Someone tried to run a second instance, we should focus our window.
      if (!win) return;
      if (win.isMinimized()) win.restore();
      if (!win.isVisible()) win.show();
      win.focus();
    });

    app.on('ready', () => {
      setTimeout(() => splashWindow(), 400);
      /**
      * Load Anguar DevTools on serve
      */
      if (serve) session.defaultSession.loadExtension(path.normalize('C:/Users/nmnd/AppData/Local/Google/Chrome/User Data/Default/Extensions/ienfalfjdbdpebioblfackkekamfmbnh/1.0.4_0')).then(({ id }: { id : string}) => {
        console.log('[ADT] DevTools loaded', id);
      });
      createWindow();
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') app.quit();
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) createWindow();
    });
    if (serve) {
      app.on('certificate-error', (event: Electron.Event, _webContents: Electron.WebContents, _url: string, _error: string, _certificate: Electron.Certificate, callback: (isTrusted: boolean) => void) => {
        // On certificate error we disable default behaviour (stop loading the page)
        // and we then say "it is all fine - true" to the callback
        event.preventDefault();
        callback(true);
      });
    }
  }
} catch (err) {
  console.error(err);
  dialog.showErrorBox('Ошибка', err);
}
