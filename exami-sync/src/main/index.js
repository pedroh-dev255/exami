import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { appIcon } from './assets'
import { createTray, setUnreadNotifications } from './tray'
import { state } from './state'

// ================================================================
// INSTÂNCIA ÚNICA
// O aplicativo nunca pode rodar mais de uma vez. Se uma segunda
// instância for solicitada, ela encerra imediatamente e a instância
// original recebe o evento 'second-instance' para mostrar a janela.
// ================================================================
const hasSingleInstanceLock = app.requestSingleInstanceLock()

if (!hasSingleInstanceLock) {
  // Outra instância já está em execução (possivelmente no tray).
  app.quit()
} else {
  app.on('second-instance', () => {
    // O usuário tentou abrir o programa novamente:
    // apenas mostra e foca a janela principal da instância ativa.
    showMainWindow()
  })
}

function showMainWindow() {
  const { mainWindow } = state

  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow()
    return
  }

  if (!mainWindow.isVisible()) {
    mainWindow.show()
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }

  mainWindow.focus()
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 688,
    height: 565,
    minWidth: 625,
    minHeight: 565,
    show: false,
    icon: appIcon,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: appIcon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Mantém a referência global para o tray e para o 'second-instance'.
  state.mainWindow = mainWindow

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Fechar a janela apenas a esconde: o app continua rodando no tray.
  mainWindow.on('close', (event) => {
    if (state.isQuiting) return

    event.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('closed', () => {
    if (state.mainWindow === mainWindow) {
      state.mainWindow = null
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow();

  createTray();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else showMainWindow()
  })
})

// Qualquer saída explícita (tray "Sair", Cmd+Q, Alt+F4 do sistema)
// deve realmente encerrar o app — libera o 'close' interceptado.
app.on('before-quit', () => {
  state.isQuiting = true
})

app.on('window-all-closed', () => {
  // O app não deve encerrar ao fechar a janela: ele segue no tray.
  // O encerramento real ocorre apenas via 'before-quit' (tray "Sair").
  if (state.isQuiting) {
    app.quit()
  }
})


