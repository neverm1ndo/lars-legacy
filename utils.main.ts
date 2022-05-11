import { createWriteStream } from 'fs';
import * as path from 'path';
import { app, Menu, Tray, Notification, NotificationConstructorOptions, nativeImage } from 'electron';
import axios, { AxiosResponse} from 'axios';
import { Agent } from 'https';
import { win } from './main';

/** Define HTTPS agent for axios (Insecure HACK (TLS/CA))
* @type {Agent>}
*/
const agent: Agent = new Agent({
  rejectUnauthorized: false
});

/** Define launch arguments
* @type {Array.<string>}
*/
const args: string[] = process.argv.slice(1),
      serve = args.some(val => val === '--serve');

const API: string = serve?process.env.DEV_API!:process.env.PROD_API!;

/** Downloads file
* @returns {Promise.<any>}
*/
const downloadFile = async (configuration: any): Promise<Promise<unknown>> => {
  const w_stream = createWriteStream(configuration.localPath);
  return axios.get(API + 'utils/download-file' ,
    { headers: { 'Authorization': 'Bearer ' + configuration.token },
    httpsAgent: agent,
    params: { path: configuration.remotePath },
    responseType: 'stream'
  })
  .then((res: AxiosResponse) => {
    return new Promise((resolve, reject) => {
      const totalSize = res.headers['content-length'];
      let error: Error | null = null;
      let downloaded: number = 0;
      res.data.pipe(w_stream);
      res.data.on('data', (data: any) => {
        downloaded += Buffer.byteLength(data);
        win.webContents.send('download-progress', { total: totalSize, loaded: downloaded });
      });
      res.data.on('error', (error: any) => {
        win.webContents.send('download-error', error);
      });
      w_stream.on('error', err => {
        error = err;
        w_stream.close();
        reject(err);
      });
      w_stream.on('close', () => {
        if (error) return;
        resolve(true);
        win.webContents.send('download-end');
      });
    });
  })
  .catch((err)=> {
    win.webContents.send('download-error', err);
  });
}

const verifyUserToken = async (): Promise<any> => {
  return win.webContents.executeJavaScript('localStorage.getItem("user");', true)
  .then(result => {
     return axios.get(API + 'login/check-token', {
      httpsAgent: agent,
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(result).token
      }
    });
  });
};

/** Creates tray icon
* @returns {Tray} Returns tray icon with context menu
*/
const createTray = (): Tray => {
  let appIcon = new Tray(nativeImage.createEmpty());
  appIcon.setImage(nativeImage.createFromPath(path.join(__dirname, 'dist/assets/icons/favicon.ico')));
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

  appIcon.on('double-click', function (_event: Electron.KeyboardEvent) {
    win.show();
  });
  appIcon.setToolTip('LARS');
  appIcon.setContextMenu(contextMenu);
  return appIcon;
};

/** Show currently running operating system's native notification
  @param {NotificationConstructorOptions} options Notification options
*/
const showNotification = (options: NotificationConstructorOptions) => {
  new Notification(options).show()
}

export { downloadFile, verifyUserToken, createTray, showNotification, args, serve };
