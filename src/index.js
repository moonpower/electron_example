const {app, BrowserWindow, ipcMain} = require('electron')
const { autoUpdater } = require('electron-updater');
// const fs = require('fs')

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 800,
        minWidth: 330,
        height: 600,
        minHeight : 450,
        // icon: __dirname + '/resources/installer/Icon.ico',
        webPreferences: {
            defaultFontSize: 14,
            nodeIntegration:true //웹 페이지에 node모듈을 사용할지 여부. require를 사용할 수 있음.
        }
    })
    mainWindow.loadFile('./src/index.html');
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
    mainWindow.once('ready-to-show',()=>{
        mainWindow.show();
        autoUpdater.checkForUpdatesAndNotify();
    })

    // mainWindow.loadURL(`file:${__dirname}/index.html`);
    // win.loadURL('http://localhost:8080');

    // win.webContents.openDevTools(); // 개발자 도구실행
}

// const root = fs.readdirSync('/')
// console.log(root)

// app.whenReady().then(createWindow)
app.on('ready',()=>{
    createWindow();
});

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
});

app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length === 0){
    // if(mainWindow === null){
        createWindow();
    }
})

ipcMain.on('online-status-changed',(event,status)=>{
    console.log(status)
})

ipcMain.on('app_version',(event)=>{
    event.sender.send('app_version',{version:app.getVersion()});
});

autoUpdater.on('update-available',()=>{
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded',()=>{
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app',()=>{
    autoUpdater.quitAndInstall();
});
