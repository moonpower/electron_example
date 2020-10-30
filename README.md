### Enviroment

electron + typescript + electron-builder

### module install
```
$>npm install
or
$>yarn install
```

### Run the app
```
$>npm start
or
$>yarn start
```

### build installer
```
$>npm run build:win32
or
$>yarn run build:win32
```

### electron setting

1. create file ".gitignore" > "node_modules/"
2. create file "package.jgon" >
```
{
  "name": "your-app",
  "version": "0.1.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  }
}
```
3. $>npm install --save-electron
4. create file "main.js" >
```
const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.on('ready', createWindow)
```

5. create file "index.html" 
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <!-- https://electronjs.org/docs/tutorial/security#csp-meta-tag -->
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using node <script>document.write(process.versions.node)</script>,
    Chrome <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.
  </body>
</html>
```

### 라이브러리

- [custom-electron-titlebar](https://github.com/AlexTorresSk/custom-electron-titlebar#readme) : vscode와 비슷한 타이틀 메뉴바
- [electron-json-storage](https://github.com/jviotti/electron-json-storage): json로컬 저장
- [NeDB](https://github.com/louischatriot/nedb): DB
- [chrome-tabs](https://github.com/adamschwartz/chrome-tabs): 크롬 탭 모양
- 참고. [Electron-commnunity](https://www.electronjs.org/community#boilerplates)
- [node-hid](https://github.com/node-hid/node-hid): USB connector
- [serialport](https://serialport.io/)
- [electron-store](https://github.com/sindresorhus/electron-store)