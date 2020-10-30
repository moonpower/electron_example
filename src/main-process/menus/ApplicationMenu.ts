import * as fs from "fs";
import { Menu, MenuItem, remote, dialog } from "electron";
import { Application } from "../Application";

export class ApplicationMenu {
    private _menu: Menu;
    private _owner: Application;
    private _isUpdateChecking: boolean = false;

    constructor(owner: Application) {
        this._owner = owner;
        this._initMenu();
        this._initAutoUpdater();

    }

    public getMenu() {
        return this._menu;
    }

    private _openFile() {
        dialog.showOpenDialog({
            properties: ["openFile"]
            // filters:[
            //   { name: "Images", extensions: ['jpg','png','gif']},
            //   { name: "All Files", extensions: ['*']}
            // ]
        }).then((result: any) => {
            console.log(result.filePaths);
        }).catch((err: any) => {
            console.log(err);
        })
    }

    private _openDevTools() {
        this._owner.getMainWindow().webContents.openDevTools();
    }

    private _onPrefsClicked3() {
        dialog.showMessageBox({ type: "info", message: 'You clicked Prefs-3' })
    }

    private _onUpdateCheck() {
        this._owner.getAutoUpdater().checkForUpdatesAndNotify();
    }

    private _saveFile() {
        dialog.showSaveDialog({}).then((file: any) => {
            if (file === undefined) {
                console.log("You didn't save the file");
                return;
            }

            console.log(file);
            fs.writeFile(file.filePath.toString(), "test contents", (err: any) => {
                if (err) {
                    // alert("An error ocurred creating the file " + err.message);
                    dialog.showMessageBox({ type: "error", message: "An error ocurred creating the file " + err.message })
                }

                dialog.showMessageBox({ type: "info", message: "The file has been successfully saved" })
                // alert("The file has been successfully saved");
            });
        }).catch((err: any) => {
            if (err) {

            }
        });
    }

    private _updateNotAvailableMessage() {
        dialog.showMessageBox(remote.getCurrentWindow(), {
            type: "info",
            message: "현재 사용할 수 있는 업데이트가 없습니다.",
            title: remote.getCurrentWindow().getTitle()
        });
    }

    private _initAutoUpdater() {
        this._owner.getAutoUpdater().on("update-available", () => { this._isUpdateChecking = false; })
        this._owner.getAutoUpdater().on("update-not-available", () => {
            if (this._isUpdateChecking) {
                this._updateNotAvailableMessage();
            }
            this._isUpdateChecking = false;
        })
        this._owner.getAutoUpdater().on("error", () => { this._isUpdateChecking = false; });
    }

    private _initMenu() {
        this._menu = new Menu();

        this._menu.append(this._createFileMenuItem());

        this._menu.append(this._createToolMenuItem());

        this._menu.append(this._createHelpMenuItem());
    }

    private _createFileMenuItem() {
        let fileMenuItem = new MenuItem({
            label: "파일",
            submenu: [
                {
                    label: '파일 열기...',
                    click: () => {
                        this._openFile();
                    },
                    accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O'
                },
                {
                    label: '파일 저장',
                    click: () => {
                        this._saveFile();
                    },
                    accelerator: process.platform === 'darwin' ? 'Command+Shift+S' : 'Ctrl+Shift+S'
                }
            ]
        });
        return fileMenuItem;
    }
    private _createToolMenuItem() {
        let toolMenuItem = new MenuItem({
            label: "도구 더보기",
            submenu: [
                {
                    label: '개발자 도구',
                    click: () => {
                        this._openDevTools();
                    },
                    accelerator: process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D'
                },
                {
                    label: 'Prefs-3',
                    click: () => {
                        this._onPrefsClicked3();
                    }
                }
            ]
        });
        return toolMenuItem;
    }

    private _createHelpMenuItem() {
        let helpMenuItem = new MenuItem({
            label: "도움말",
            submenu: [
                {
                    label: "업데이트 확인...",
                    click: () => {
                        this._onUpdateCheck();
                    }
                }
            ]
        });
        return helpMenuItem;
    }
}
