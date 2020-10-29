import {app, nativeImage, BrowserWindow, ipcMain, Tray, Menu} from 'electron';
import {autoUpdater} from 'electron-updater';

let mainWindow:BrowserWindow = null;

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 800,
        minWidth: 330,
        height: 600,
        minHeight : 450,
        // frame:false,
        // show:false, // 초기 보여주지 않음
        // icon: __dirname + '/resources/installer/Icon.ico',
        webPreferences: {
            defaultFontSize: 14,
            nodeIntegration:true //웹 페이지에 node모듈을 사용할지 여부. require를 사용할 수 있음.
        }
    })
    mainWindow.loadFile('index.html');
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
    // mainWindow.once('ready-to-show',()=>{
    //     mainWindow.show();
    //     autoUpdater.checkForUpdatesAndNotify();
    // })

    // mainWindow.loadURL(`file:${__dirname}/index.html`);
    // win.loadURL('http://localhost:8080');

    // mainWindow.webContents.openDevTools(); // 개발자 도구실행
}

let tray = null;

function createTray(){
    tray = new Tray(nativeImage.createEmpty());
    tray.on("click",()=>{
        mainWindow.show();
    })

    const contextMenu = Menu.buildFromTemplate([
        {label:"Close",click:function(){
            mainWindow.close();
            app.quit();
            app.exit();
        }},
        {label:"Item2",type:"radio"},
        {label:"Item3",type:"radio",checked:true},
        {label:"Item4",type:"radio"},
    ])
    tray.setToolTip('This is my application')
    tray.setContextMenu(contextMenu);
}
// const root = fs.readdirSync('/')
// console.log(root)

// app.whenReady().then(createWindow)
app.on('ready',()=>{
    createWindow();
    createTray();
    autoUpdater.checkForUpdatesAndNotify();
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

ipcMain.on('online-status-changed',(event:any,status:any)=>{
    console.log(status)
})

ipcMain.on('app_version',(event:any)=>{
    event.sender.send('app_version',{version:app.getVersion()});
});

autoUpdater.on('update-available',()=>{
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded',()=>{
    mainWindow.webContents.send('update_downloaded');
});

autoUpdater.on('update-not-available',()=>{
    
    mainWindow.webContents.send('update_not_available');
});

ipcMain.on('restart_app',()=>{
    autoUpdater.quitAndInstall();
});

ipcMain.on('check-update',()=>{
    autoUpdater.checkForUpdatesAndNotify();
});
