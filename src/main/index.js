import { app, BrowserWindow, Menu } from 'electron'



/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


  const wnd={
    label: "Window Manager",
    submenu: [
      /*
      { 
        label: "Login",
        click(){
          mainWindow.webContents.send('navigate', '/')
        } 
      },
        { 
          label: "Preferences",
          click(){
            mainWindow.webContents.send('navigate', '/preferences')
          } 
        },
        */
        { 
          label: "Quit",
          accelerator: 'CmdOrCtrl+Q',
          click() { 
            app.quit() 
          } 
        },
    ]
}


const edit={
  label: "Edit",
  submenu: [
    {
      label: "Undo",
      accelerator: "CmdOrCtrl+Z",
      selector: "undo:"
    },
    {
      label: "Redo",
      accelerator: "Shift+CmdOrCtrl+Z",
      selector: "redo:"
    },
    {
      type: "separator"
    },
    {
      label: "Cut",
      accelerator: "CmdOrCtrl+X",
      selector: "cut:"
    },
    {
      label: "Copy",
      accelerator: "CmdOrCtrl+C",
      selector: "copy:"
    },
    {
      label: "Paste",
      accelerator: "CmdOrCtrl+V",
      selector: "paste:"
    },
    {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      selector: "selectAll:"
    }
  ]
}




  let menuTemplate = [wnd,edit];


function createWindow () {

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 800 ,
    height: 600,
    useContentSize: true,
  })
  //mainWindow.webContents.openDevTools() 
  
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  let menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);


  /*
  mainWindow.webContents.on('did-finish-load', function() {
    console.log("loaded")
  });
  
*/
  
  

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
