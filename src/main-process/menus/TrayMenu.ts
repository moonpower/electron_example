import { Menu, MenuItem } from "electron";
import { Application } from "../Application";

export class TrayMenu {

    private _menu: Menu;
    private _owner: Application;

    constructor(owner: Application) {
        this._owner = owner;
        this._initMenu();
    }

    public getMenu() {
        return this._menu;
    }

    private _initMenu() {

        this._menu = new Menu();
        this._menu.append(new MenuItem({
            label: "Close", click: () => {
                this._owner.getMainWindow().close();
                this._owner.getAppInstance().quit();
                this._owner.getAppInstance().exit();
            }
        }))
        this._menu.append(new MenuItem({
            label: "Item2", type: "radio"
        }))
        this._menu.append(new MenuItem({
            label: "Item3", type: "radio", checked: true
        }))
        this._menu.append(new MenuItem({
            label: "Item4", type: "radio"
        }))

    }
}