const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')

function createWindow(){
    win = new BrowserWindow({
        width: 800,
        minWidth: 330,
        height: 600,
        minHeight : 450,
        show:false,
        // icon: __dirname + '/resources/installer/Icon.ico',
        webPreferences: {
            defaultFontSize: 14,
            nodeIntegration:true //웹 페이지에 node모듈을 사용할지 여부. require를 사용할 수 있음.
        }
    })

    win.once('ready-to-show',function(){
        win.show()
    })

    win.loadURL(`file:${__dirname}/index.html`);
    // win.loadURL('http://localhost:8080');

    // win.webContents.openDevTools(); // 개발자 도구실행
}

// const root = fs.readdirSync('/')
// console.log(root)

app.whenReady().then(createWindow)

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
});

app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow()
    }
})

ipcMain.on('online-status-changed',(event,status)=>{
    console.log(status)
})