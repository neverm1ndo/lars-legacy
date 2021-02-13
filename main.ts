import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as winStateKeeper from 'electron-window-state';
import * as path from 'path';
import * as url from 'url';
import axios from 'axios';
import { createWriteStream } from 'fs';

let win: BrowserWindow = null;
let splash: BrowserWindow = null;
const args: string[] = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

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
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      allowRunningInsecureContent: true
    }
  });
  splash.setAlwaysOnTop(true);
  splash.center();
  splash.setMenu(null);
  splash.loadURL(url.format({
    pathname: path.join(__dirname, 'src/assets/splash.html'),
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

function createWindow(): BrowserWindow {

  // const electronScreen: Electron.Screen = screen;
  let state = winStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 600
  });

  // Create the browser window.
  win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minHeight: 580,
    minWidth: 950,
    title: 'LIBERTYLOGS',
    show: false,
    frame: false,
    icon: path.join(__dirname, 'src/assets/icons/favicon.ico'),
    backgroundColor: '#3A3F52',
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      webSecurity: (serve)? false: true,
      allowRunningInsecureContent: true,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule : true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });


  win.once('ready-to-show', () => {
    splash.webContents.executeJavaScript('changeStatus("Проверка токена авторизации", 85);', true)
    win.webContents.executeJavaScript('localStorage.getItem("user");', true)
    .then(result => {
      axios.get('https://instr.gta-liberty.ru/v2/login/check-token', {
        headers: {
          'Authorization': JSON.parse(result).token
        }
      })
      .then(() => {
        splash.webContents.executeJavaScript('changeStatus("Токен успешно верифицирован", 100);', true);
      })
      .catch((err)=> {
        win.webContents.send('token-verify-denied', true);
        splash.webContents.executeJavaScript(`changeStatus("Токен не прошел верификацию: ${err.message}", 100);`, true);
      }).finally(() => {
        setTimeout(() => {
          splash.close();
          win.show();
        }, 2000);
      });
    }).catch((err) => {
      win.webContents.send('token-verify-denied', true);
      splash.webContents.executeJavaScript(`changeStatus("Токен отсутствует: ${err.message}", 100);`, true);
      setTimeout(() => {
        splash.close();
        win.show();
      }, 2000);
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
    // win.loadURL(url.format({
    //   pathname: path.join(__dirname, 'dist/index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }));
  }

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

function downloadFile(configuration: any) {
  const w_stream = createWriteStream(configuration.localPath);
  axios.get('https://instr.gta-liberty.ru/v2/utils/download-file' ,
    { headers: { 'Authorization': 'Bearer ' + configuration.token },
    params: { path: configuration.remotePath },
    responseType: 'stream'
  })
  .then((res: any) => {
    return new Promise((resolve, reject) => {
      const totalSize = res.headers['content-length']
      let error = null;
      let downloaded = 0
      res.data.pipe(w_stream);
      res.data.on('data', (data) => {
        downloaded += Buffer.byteLength(data);
        win.webContents.send('download-progress', { total: totalSize, loaded: downloaded })
      })
      res.data.on('error', (error) => {
        win.webContents.send('download-error', error)
      })
      w_stream.on('error', err => {
        error = err;
        w_stream.close();
        reject(err);
      });
      w_stream.on('close', () => {
        if (!error) {
          resolve(true);
          win.webContents.send('download-end');
        }
      });
    });
  })
  .catch((err)=> {
    win.webContents.send('download-error', err);
  })
}
ipcMain.on('download-file', (event, conf) => {
  downloadFile(conf);
});

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
