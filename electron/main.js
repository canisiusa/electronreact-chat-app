const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        show: false,
        frame: false,
    });
    const startURL = isDev ? 'http://192.168.43.139:7065' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    
    mainWindow.once('ready-to-show', () => mainWindow.show());
    
    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.handle('close-app', () => {
    console.log(mainWindow.webContents)
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

require("electron-debug")();

