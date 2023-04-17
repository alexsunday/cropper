import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';

type IpcRenderCallback = (event: IpcRendererEvent, ...args: any[]) => void;

contextBridge.exposeInMainWorld('eapi', {
  cropDone: (...args: any[]) => ipcRenderer.invoke('eapi:crop-done', args),
  openDirectory: () => ipcRenderer.invoke('eapi:open-directory'),
  sendData: (v: any) => ipcRenderer.invoke('eapi:send-data', v),
});
