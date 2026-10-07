// Estado mutável compartilhado entre os módulos do processo principal.
export const state = {
  mainWindow: null,
  updateWindow: null,
  tray: null,
  isQuiting: false,

  currentChatId: null,
  windowFocused: false,
  hasUnreadNotifications: false,

  notificationWindow: null,
  notificationTimeout: null,

}
