import { app, clipboard, dialog, ipcMain } from "electron";

import { setNewTray } from "../tray";
import { downloadFile, loadFromAsar, loadFromFileSystem, pingHost, serve, showNotification } from "../utils";
import { win } from "../main";
import { PingConfig, PingResponse } from "ping";
import { defaultServerInfo, ServerGameMode } from "../samp/samp";
import { samp, serverInfo } from "../samp/lars.samp";


export class IpcHandler {

  constructor() {
    this.init();
  }

  init() {
    ipcMain.on('download-file', (_event: Electron.IpcMainEvent, conf) => {
      downloadFile(conf);
    });
    ipcMain.on('minimize-to-tray', (event: Electron.IpcMainEvent) => {
      event.preventDefault();
      win.hide();
      setNewTray();
      serverInfo.unsubscribe();
    });
    ipcMain.on('close', () => win.close());
    ipcMain.on('minimize', () => win.minimize());
    ipcMain.on('reload', () => win.reload());
    
    ipcMain.on('notification', (_event: Electron.IpcMainEvent, options) => {
      showNotification(options);
    });
    
    ipcMain.handle(
      'server-game-mode',
      (_event: Electron.IpcMainInvokeEvent, ip: string, port: number): Promise<ServerGameMode> => {
        if (!serve) {
          return samp.getGameMode(ip, port);
        }
        return Promise.resolve(defaultServerInfo);
      }
    );
    
    ipcMain.handle(
      'message-box',
      (
        _event: Electron.IpcMainInvokeEvent,
        opts: Electron.MessageBoxOptions
      ): Promise<Electron.MessageBoxReturnValue> => dialog.showMessageBox(opts)
    );
    
    ipcMain.handle(
      'save-dialog',
      (
        _event: Electron.IpcMainInvokeEvent,
        opts: Electron.SaveDialogOptions
      ): Promise<Electron.SaveDialogReturnValue> => dialog.showSaveDialog(opts)
    );
    
    ipcMain.handle(
      'open-dialog',
      (
        _event: Electron.IpcMainInvokeEvent,
        opts: Electron.OpenDialogOptions
      ): Promise<Electron.OpenDialogReturnValue> => dialog.showOpenDialog(opts)
    );
    
    ipcMain.handle('clipboard', (_event: Electron.IpcMainInvokeEvent, str: string): void => {
      clipboard.writeText(str);
    });
    
    ipcMain.handle('version', (_event: Electron.IpcMainInvokeEvent): string => app.getVersion());
   
    ipcMain.handle(
      'asar-load',
      (_event: Electron.IpcMainInvokeEvent, assetPath: string): Promise<Buffer> =>
        loadFromAsar(assetPath)
    );
    
    ipcMain.handle(
      'ping',
      (
        _event: Electron.IpcMainInvokeEvent,
        host: string,
        options: PingConfig
      ): Promise<PingResponse | void> =>
        pingHost(host, options)
          .then((value) => value)
          .catch(console.error)
    );
    
    ipcMain.handle(
      'model',
      (_event: Electron.IpcMainInvokeEvent, filePath: string): Promise<Buffer> =>
        loadFromFileSystem(filePath)
    );
  }
}