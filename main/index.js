const {app, BrowserWindow} = require('electron');

app.on('ready', ()=>{
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
    });

    win.once('ready-to-show',function(){
        win.show();
    });

    win.loadURL(`file:${__dirname}/../index.html`);
    // win.loadURL('http://localhost:8080');

    win.webContents.openDevTools();
})