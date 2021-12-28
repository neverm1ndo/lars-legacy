import { createWriteStream } from 'fs';
import * as path from 'path';
import { app, Menu, Tray, Notification, NotificationConstructorOptions } from 'electron';
import axios from 'axios';
import { Agent } from 'https';
import { win } from './main';
/** Define HTTPS agent for axios (Insecure HACK (TLS/CA))
* @type {Agent>}
*/
const agent: Agent = new Agent({
  rejectUnauthorized: false
});

/** Downloads file
* @returns {Promise.<any>}
*/
const downloadFile = async (configuration: any): Promise<any> => {
  const w_stream = createWriteStream(configuration.localPath);
  return axios.get('https://instr.gta-liberty.ru/v2/utils/download-file' ,
    { headers: { 'Authorization': 'Bearer ' + configuration.token },
    httpsAgent: agent,
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

const verifyUserToken = async (): Promise<any> => {
  return win.webContents.executeJavaScript('localStorage.getItem("user");', true)
  .then(result => {
     return axios.get('https://instr.gta-liberty.ru/v2/login/check-token', {
      httpsAgent: agent,
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(result).token
      }
    })
  })
}

/** Creates tray icon
* @returns {Tray} Returns tray icon with context menu
*/
const createTray = (): Tray => {
    let appIcon = new Tray(path.join(__dirname, 'src/assets/icons/favicon.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Развернуть LARS', click: function () {
                win.show();
            }
        },
        {
            label: 'Закрыть', click: function () {
                app.quit();
            }
        }
    ]);

    appIcon.on('double-click', function (event) {
        win.show();
    });
    appIcon.setToolTip('LARS');
    appIcon.setContextMenu(contextMenu);
    return appIcon;
}

/** Show currently running operating system's native notification
  @param {NotificationConstructorOptions} options Notification options
*/
const showNotification = (options: NotificationConstructorOptions) => {
  new Notification(options).show()
}

export { downloadFile, verifyUserToken, createTray, showNotification };
