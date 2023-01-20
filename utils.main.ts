import { createWriteStream, readFile, WriteStream } from 'fs';
import * as path from 'path';
import { app, Menu, Tray, Notification, NotificationConstructorOptions, nativeImage } from 'electron';
import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';
import { Agent } from 'https';
import { win } from './main';

/** Define HTTPS agent for axios (Insecure HACK (TLS/CA))
* @type {Agent}
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

/** Downloads file and saves to th local disk
* @returns {Promise.<any>}
*/
const downloadFile = async (configuration: { localPath: string; remotePath: string }): Promise<unknown> => {
  
  const stream: WriteStream = createWriteStream(configuration.localPath);

  const requestConfig: AxiosRequestConfig = { 
    httpsAgent: agent,
    params: { 
      path: configuration.remotePath 
    },
    responseType: 'stream'
  };

  const url: URL = new URL('/v2/utils/download-file', API); 

  console.log(API, url.toString());
  
  return axios.get(url.toString(), requestConfig)
              .then((res: AxiosResponse) => new Promise((resolve, reject) => {
                const totalSize = res.headers['content-length'];
                
                let error: Error | null = null;
                let downloaded: number = 0;
                
                res.data.pipe(stream);
                res.data.on('data', (data: any) => {
                  downloaded += Buffer.byteLength(data);
                  win.webContents.send('download-progress', { total: totalSize, loaded: downloaded });
                });
                
                res.data.on('error', (error: any) => {
                  win.webContents.send('download-error', error);
                });
                
                stream.on('error', err => {
                  error = err;
                  console.log(err);
                  stream.close();
                  reject(err);
                });
                
                stream.on('close', () => {
                  if (error) return;
                  resolve(true);
                  win.webContents.send('download-end');
                });
              }))
              .catch((err) => {
                console.log(err);
                win.webContents.send('download-error', err);
              });
}

const loadFromAsar = async (assetPath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    readFile(path.join(app.getPath('appData'), assetPath), (err: NodeJS.ErrnoException, data: Buffer) => {
      if (err) reject(err);
               resolve(data);
    });
  });
};

/**
 * Sign user before launch
 * @deprecated
 */
const sign = async (): Promise<any> => {
  // ipcRenderer.
  return win.webContents.executeJavaScript('window.localStorage.getItem("user");', true)
                        .then((_result) => {
                          return axios.get(API + 'auth/sign', {
                            httpsAgent: agent,
                          });
                        });
};

/** Creates tray icon
* @returns {Tray} Returns tray icon with context menu
*/
const createTray = (): Tray => {
  let appIcon = new Tray(nativeImage.createEmpty());
      appIcon.setImage(nativeImage.createFromPath(path.join(__dirname, 'dist/lars/browser/assets/icons/favicon.ico')));
  
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

export { downloadFile, sign, createTray, showNotification, args, serve, loadFromAsar };
