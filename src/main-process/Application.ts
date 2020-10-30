import { app, nativeImage, BrowserWindow, ipcMain, Tray, Menu, BrowserView } from 'electron';
import { autoUpdater } from 'electron-updater';
import { ApplicationMenu } from './menus/ApplicationMenu';
import { TrayMenu } from './menus/TrayMenu';

export class Application {

    private _mainWindow: BrowserWindow;
    private _tray: Tray;
    private _rendererFilePath: string = "index.html";

    public run() {
        this._initAppEvent();
        this._initMainEvent();
        this._initAutoUpdaterEvent(); // 자동업데이트하려면 코드사인이 필요. Windows의 경우 "스마트 스크린"에 걸림. macOS는 자동업데이트가 불가능.
    }

    public getMainWindow() {
        return this._mainWindow;
    }

    public getAutoUpdater() {
        return autoUpdater;
    }

    public getAppInstance() {
        return app;
    }

    private _initAppEvent() {
        app.on('ready', () => { this._onReady() });

        app.on('window-all-closed', () => { this._onWindowAllClosed() });

        app.on('activate', () => { this._onActivate() });
    }

    private _initAutoUpdaterEvent() {
        autoUpdater.on('update-available', () => {
            this._mainWindow.webContents.send('update_available');
        });

        autoUpdater.on('update-downloaded', () => {
            this._mainWindow.webContents.send('update_downloaded');
        });

    }

    private _initMainEvent() {
        ipcMain.on('online-status-changed', (event: any, status: any) => {
            console.log(status)
        })

        ipcMain.on('app_version', (event: any) => {
            event.sender.send('app_version', { version: app.getVersion() });
        });

        ipcMain.on('restart_app', () => {
            autoUpdater.quitAndInstall();
        });

        ipcMain.on('check-update', () => {
            autoUpdater.checkForUpdatesAndNotify();
        });
    }

    private _createWindow() {
        this._mainWindow = new BrowserWindow({
            width: 800,
            minWidth: 330,
            height: 600,
            minHeight: 450,
            // frame:false,
            // show:false, // 초기 보여주지 않음
            // icon: __dirname + '/resources/installer/Icon.ico',
            webPreferences: {
                defaultFontSize: 14,
                nodeIntegration: true //웹 페이지에 node모듈을 사용할지 여부. require를 사용할 수 있음.
            }
        })
        this._mainWindow.loadFile(this._rendererFilePath);
        this._mainWindow.on('closed', function () {
            this._mainWindow = null;
        });
    }

    public _createTray() {
        this._tray = new Tray(nativeImage.createEmpty());
        this._tray.on("click", () => {
            this._mainWindow.show();
        })

        let trayMenu = new TrayMenu(this);
        this._tray.setToolTip('This is my application')
        this._tray.setContextMenu(trayMenu.getMenu());
    }

    private _onReady() {
        this._createWindow();
        this._createTray();
        let applicationMenu = new ApplicationMenu(this);
        Menu.setApplicationMenu(applicationMenu.getMenu());
        autoUpdater.checkForUpdatesAndNotify();
    }

    private _onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    }

    private _onActivate() {
        if (BrowserWindow.getAllWindows().length === 0) {
            // if(mainWindow === null){
            this._createWindow();
        }
    }
}

