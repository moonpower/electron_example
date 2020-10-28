const {remote,ipcRenderer} = require('electron');
const {Menu} = remote;
const {dialog} = remote;
const {fs} = require('fs');

var openFile = function() {
  dialog.showOpenDialog({
    properties:["openFile"]
    // filters:[
    //   { name: "Images", extensions: ['jpg','png','gif']},
    //   { name: "All Files", extensions: ['*']}
    // ]
  }).then(result=>{
    console.log(result.filePaths);
    // remote.getCurrentWindow().loadFile(result.filePaths);
  }).catch(err =>{
    console.log(err);
  })
}
 
var openDeveloperTool = function() {
  remote.getCurrentWebContents().openDevTools();
}
 
var onPrefsClicked3 = function() {
  alert('You clicked Prefs-3');
}

var onUpdateCheck = function(){
  ipcRenderer.send("check-update");
  ipcRenderer.removeListener("update_not_available",updateNotAvailableMessage);
  ipcRenderer.once('update_not_available',updateNotAvailableMessage);
}

function saveFile(){
  dialog.showSaveDialog().then((file)=>{
    if(file === undefined){
      console.log("You didn't save the file");
      return;
    }
    
    console.log(file);
    fs.writeFile(file.filePath.toString(),"test contents",(err)=>{
      if(err){
        alert("An error ocurred creating the file "+ err.message);
      }

      alert("The file has been successfully saved");
    });
  }).catch((err)=>{
    if(err){

    }
  });

 
}

function updateNotAvailableMessage(){
  dialog.showMessageBox(remote.getCurrentWindow(),{
    type:"info",
    message: "현재 사용할 수 있는 업데이트가 없습니다.",
    title: remote.getCurrentWindow().getTitle()
  });
}

// define template
const template = [
  {
    label: '파일',
    submenu: [
      {
        label: '파일 열기...',
        click: function() {
          openFile();
        },
        accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O'
      },
      {
        label:'파일 저장',
        click: function(){
          saveFile();
        },
        accelerator:process.platform === 'darwin' ? 'Command+Shift+S' : 'Ctrl+Shift+S'
      }
    ]
  },
  {
    label: '도구 더보기',
    submenu: [
      {
        label: '개발자 도구',
        click: function() {
          openDeveloperTool();
        },
        accelerator: process === 'darwin'? 'Command+D': 'Ctrl+D'
      },
      {
        label: 'Prefs-3',
        click: function() {
          onPrefsClicked3();
        }
      }
    ]
  },
  {
    label: '도움말',
    submenu:[
      {
        label: "업데이트 확인...",
        click:function(){
          onUpdateCheck();
        }
      }
    ],
    accelerator: 'H'
  }
];
 
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);