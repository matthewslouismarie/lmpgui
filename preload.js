const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('lmp', {
    'loadSchema': () => ipcRenderer.invoke('loadSchema'),
    'loadConfig': (path) => ipcRenderer.invoke('loadConfig'),
})