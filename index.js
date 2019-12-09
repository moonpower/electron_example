const {app, BrowserWindow} = require('electron');

app.on('ready', ()=>{
    win = new BrowserWindow({
        width: 800,
        minWidth: 330,
        height: 500,
        minHeight : 450,
        show:false,
        // icon: __dirname + '/resources/installer/Icon.ico',
        webPreferences: {defaultFontSize: 14}
    });

    win.once('ready-to-show',function(){
        win.show();
    });

    win.loadURL(`file:${__dirname}/index.html`);

    win.webContents.openDevTools();
})