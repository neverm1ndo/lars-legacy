import { createWriteStream, readFile, WriteStream } from 'fs';
import * as path from 'path';
import { app, Notification, NotificationConstructorOptions } from 'electron';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Agent } from 'https';
import { win } from '../main';
import * as ping from 'ping';

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

const API: URL = new URL('https://' + (serve ? 'localhost:8443': 'svr.gta-liberty.ru'));

console.log('API init:', API);
/** Downloads file and saves to th local disk
* @returns {Promise.<any>}
*/
const downloadFile = async (configuration: { localPath: string; remotePath: string, token: string }): Promise<unknown> => {
  
  const stream: WriteStream = createWriteStream(configuration.localPath);
  

  const requestConfig: AxiosRequestConfig = { 
    httpsAgent: agent,
    params: { 
      path: configuration.remotePath 
    },
    headers: {
      'Authorization': `Bearer ${configuration.token}`
    },
    responseType: 'stream'
  };

  const url: URL = new URL('/v2/lars/utils/download-file', API);

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

const loadFromFileSystem = async (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      readFile(path, (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err || !data) return reject(err);
                 resolve(data.toString());
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

/** Show currently running operating system's native notification
  @param {NotificationConstructorOptions} options Notification options
*/
const showNotification = (options: NotificationConstructorOptions) => {
  new Notification(options).show()
}

const pingHost = (host: string, options: ping.PingConfig): Promise<ping.PingResponse> => {
  return ping.promise.probe(host, options);
}

export { downloadFile, sign, showNotification, args, serve, loadFromAsar, pingHost, loadFromFileSystem };