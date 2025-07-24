const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

// Global references to prevent garbage collection
let mainWindow;
let splashWindow;
let tray = null;

// Create splash screen
function createSplashScreen() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  splashWindow.loadFile('splash.html');

  // Close splash screen after 2 seconds and open main window
  setTimeout(() => {
    splashWindow.close();
    createWindow();
  }, 2000);
}

// Create main window (your existing window)
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  // Show window when content has loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Create tray when window is created
  createTray();
}

// Create system tray
function createTray() {
  // Use a PNG with transparency for best results
  tray = new Tray(path.join(__dirname, 'logo.jpg'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Minimize to Tray',
      click: () => {
        mainWindow.hide();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  // Set tooltip and context menu
  tray.setToolTip('Digital DaVinci');
  tray.setContextMenu(contextMenu);

  // Show window on click (optional)
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

// App ready event
app.whenReady().then(() => {
  createSplashScreen();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle window-close to minimize to tray instead of quitting (optional)
app.on('before-quit', () => {
  tray.destroy();
});