import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';

type IpcRenderCallback = (event: IpcRendererEvent, ...args: any[]) => void;

contextBridge.exposeInMainWorld('eapi', {
  cropDone: (...args: any[]) => ipcRenderer.send('eapi:crop-done', args),
  openDirectory: () => ipcRenderer.invoke('eapi:open-directory'),
});
