import { nativeImage } from 'electron'
import { join } from 'path'
import { readFileSync } from 'fs'
import { is } from '@electron-toolkit/utils'

let iconPath;
let trayIconPath;
let trayNotifyIconPath;

if(is.dev){
  iconPath =
    process.platform === 'win32'
      ? join(__dirname, '../../build/icon.ico')
      : process.platform === 'darwin'
        ? join(__dirname, '../../build/icon.icns')
        : join(__dirname, '../../build/icon.png')

  trayIconPath = join(__dirname, '../../build/icon.ico' );
  trayNotifyIconPath = join(__dirname, '../../build/iconNotify.ico' );

}else{
  iconPath =
    process.platform === 'win32'
      ? join(process.resourcesPath, 'icon.ico')
      : process.platform === 'darwin'
        ? join(process.resourcesPath, 'icon.icns')
        : join(process.resourcesPath, 'icon.png')

  trayIconPath = join( process.resourcesPath,'icon.ico' );
  trayNotifyIconPath = join( process.resourcesPath,'iconNotify.ico' );
}

export const appIcon = nativeImage.createFromPath(iconPath);
export const trayIcon = nativeImage.createFromPath(trayIconPath);
export const trayNotifyIcon = nativeImage.createFromPath(trayNotifyIconPath);