import { Tray, Menu, app, dialog } from 'electron'
import { state } from './state'
import { appIcon, trayIcon, trayNotifyIcon } from './assets'

export function updateTrayIcon() {
  const { tray, hasUnreadNotifications } = state
  if (!tray || tray.isDestroyed()) return

    if (hasUnreadNotifications) {
    tray.setImage(trayNotifyIcon)
    tray.setToolTip('Exami Sync - Alerta')
    //console.log('trayNotifyIcon')
    mainWindowsBlink(true)   // ativa o flash da janela
  } else {
    tray.setImage(trayIcon)
    tray.setToolTip('Exami Sync')
    //console.log('trayIcon')
    mainWindowsBlink(false)  // desativa o flash
  }
}

export function mainWindowsBlink(value) {
  const { mainWindow } = state
  if (!mainWindow || mainWindow.isDestroyed()) {
    return
  }

  if (value) {
    if (!mainWindow.isVisible()) {
      mainWindow.showInactive()
      mainWindow.minimize()
    }
    mainWindow.flashFrame(true)
  } else {
    mainWindow.flashFrame(false)
  }
}


export function setUnreadNotifications(value) {
  state.hasUnreadNotifications = value

  // Atualiza o ícone do tray e o flash da janela uma única vez
  updateTrayIcon()
}

export function createTray() {
  const tray = new Tray(trayIcon);
  state.tray = tray
  tray.setToolTip('Exami Sync');

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Abrir',
        click() {
          const { mainWindow } = state
          if (!mainWindow) return

          mainWindow.show()

          if (mainWindow.isMinimized()) {
            mainWindow.restore()
          }

          mainWindow.focus()
        }
      },
      { type: 'separator' },
      {
        label: 'Sair',
        async click() {
          const { response } = await dialog.showMessageBox(state.mainWindow, {
            type: 'question',
            title: 'Sair do Exami Sync',
            message: 'Deseja realmente fechar o Exami Sync?',
            detail:
              'Ao fechar, o sistema não irá realizar a sincronização de exames medicos com o sistema web.',
            buttons: ['Cancelar', 'Reiniciar', 'Sair'],
            defaultId: 1,
            cancelId: 0,
            icon: appIcon
          })

          switch (response) {
            case 1:
              state.isQuiting = true
              app.relaunch()
              app.quit()
              break

            case 2:
              state.isQuiting = true
              app.quit()
              break
          }
        }
      }
    ])
  )

  tray.on('click', () => {
    const { mainWindow } = state
    if (!mainWindow) return

    if (mainWindow.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}
