import { app, BrowserWindow, dialog } from 'electron';
import * as winStateKeeper from 'electron-window-state'
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow = null;
let splash: BrowserWindow = null;
const args: string[] = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

// function splashWindow() {
//   splash = new BrowserWindow({
//     width: 450,
//     height: 300,
//     backgroundColor: '#3A3F52',
//     resizable: false,
//     icon: path.join(__dirname, 'src/assets/icons/favicon.ico'),
//     frame: false
//   });
//   splash.setAlwaysOnTop(true);
//   splash.center();
//   splash.setMenu(null);
//   splash.loadURL(url.format({
//     pathname: path.join(__dirname, 'dist/assets/splash.html'),
//     protocol: 'file:'
//   }));
//   splash.on('closed', () => {
//     splash = null;
//   });
// }

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
    minWidth: 800,
    title: 'LIBERTYLOGS',
    show: false,
    frame: false,
    icon: path.join(__dirname, 'src/assets/icons/favicon.ico'),
    backgroundColor: '#3A3F52',
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule : true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  // win.once('ready-to-show', () => {
  //   splash.close();
  //   setTimeout(() => win.show(), 2000);
  // });

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
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    // setTimeout(() => splashWindow(), 400);
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

} catch (e) {
  console.error(e);
  dialog.showErrorBox('Ошибка', e);
}
