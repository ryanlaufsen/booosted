const { app, BrowserWindow, dialog, globalShortcut, net } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();
const fetch = require('electron-fetch').default;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

async function checkEnabled() {
  const response = await fetch('https://ryanlaufsen.github.io/data/booosted.json', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  });
  responseJSON = await response.json();
  return responseJSON.enabled;
};


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    minWidth: 800,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // devTools: false
    },
    icon: __dirname + '/resources/fire.ico', // only shows on Windows and Linux, but icon should be included in build
    vibrancy: 'titlebar', // Windows Aero-like effect on Mac OS X
    titleBarStyle: 'customButtonsOnHover' // protractable traffic light buttons on Mac OS X
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (await checkEnabled() === true) {
    createWindow();
  } else {
    dialog.showMessageBoxSync({
      title: 'NOOOOOOOOOOOOOOO!',
      message: 'With a heavy heart, we must inform you:',
      type: 'info',
      buttons: ['Aw, man!', 'It\'s okay. I still love you.'],
      defaultId: 1,
      detail: 'The BOOOSTED ARAM Skin Boost service is not available at the moment. :(',
      icon: __dirname + '/resources/fire.ico'
    });
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Prevents opening the dev console with Control+Shift+I
app.on('ready', () => {
  globalShortcut.register('Control+Shift+I', () => {
    options = {
      message: 'Did you press CTRL-SHIFT-I by accident? Sure you did. Gotcha >:(',
      type: 'warning',
      buttons: ['Aw, man!'],
      title: '!! HACKERMAN ALERT !!',
      detail: 'Your evil plots have been foiled!',
    }
    dialog.showMessageBox(options);
    return false;
  });
});