import { win } from "../main";
import { app, Menu, nativeImage, Tray } from "electron";
import * as path from "path";

/**
 * Init system tray
 *
 * @type {Tray}
 */
export let tray: Tray;

/** Creates tray icon
* @returns {Tray} Returns tray icon with context menu
*/
export const createTray = (): Tray => {
    let appIcon = new Tray(nativeImage.createEmpty());
        appIcon.setImage(nativeImage.createFromPath(path.join(__dirname, '../dist/lars/browser/assets/icons/favicon.ico')));
    
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

  export const setNewTray = () => {
    tray = createTray();
  }