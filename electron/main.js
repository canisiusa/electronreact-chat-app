const { app, BrowserWindow, ipcMain, Tray, Menu, shell } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');

let mainWindow;
let appIcon = process.platform === "win32" ? path.join(__dirname, "icon.ico") : path.join(__dirname, "icon-64x64.png")
let tray = null
function createWindow() {
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        show: false,
        frame: true,
        icon: appIcon
    });
    const startURL = isDev ? 'http://localhost:7065' : `file://${path.join(__dirname, '../build/index.html')}`;

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
app.whenReady().then(() => {
    tray = new Tray(appIcon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Fenetre",
            submenu: [
                {
                    label: "Zoom +",
                    click: () => {
                        const contents = mainWindow.webContents;
                        const level = contents.getZoomLevel();
                        contents.setZoomLevel(level + 0.5)
                    },
                    accelerator: "CmdOrCtrl+numadd"
                },
                {
                    label: "Zoom -",
                    click: () => {
                        const contents = mainWindow.webContents;
                        const level = contents.getZoomLevel();
                        contents.setZoomLevel(level - 0.5)
                    },
                    accelerator: "CmdOrCtrl+numsub"
                },
                {
                    type: "separator"
                },
                {
                    label: "Agrandir",
                    click: () => {
                        mainWindow.maximize()
                    }
                },
                {
                    label: "Restorer",
                    click: () => {
                        mainWindow.restore()
                    }
                },
                {
                    label: "Reduire",
                    click: () => {
                        mainWindow.minimize()
                    }
                }
            ]
        },
        {
            label: "Quitter",
            click: () => {
                app.quit()
            }
        },
        isDev? {
            label: "DevTools",
            click: () => {
                mainWindow.webContents.openDevTools(/* { mode: 'detach' } */)
            }
        } : null,
        {
            label: "Reload",
            role: 'reload'
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org')
                    }
                },
                {
                    label: 'Github',
                    click: async () => {
                        await shell.openExternal('https://github.com/canisiusa')
                    }
                }
            ]
        }
       
    ])
    tray.setToolTip('electronreact-chapp-app')
    tray.setContextMenu(contextMenu)
})

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

Menu.setApplicationMenu(null)