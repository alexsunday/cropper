import * as path from 'path';
import { BrowserWindow, ipcMain, dialog } from 'electron'
import { cropPicture } from './pic';

type cropArgsType = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  path: string;
  out: {
    dir: string;
    width: number;
    height: number;
  }
}

export function initEvents(wnd: BrowserWindow) {
  ipcMain.handle('eapi:crop-done', async (sender: any, rs: any) => {
    if (!Array.isArray(rs)) {
      console.warn('arguments not array!');
      return null;
    }
    const r0: cropArgsType = rs[0];
    const fileName = path.basename(r0.path);
    const dstName = path.join(r0.out.dir, fileName);

    await cropPicture(r0.path, dstName, {
      x: r0.x,
      y: r0.y,
      width: r0.width,
      height: r0.height,
    }, {
      width: r0.out.width,
      height: r0.out.height,
    });
    console.log(`${fileName} done.`);
    return 'OK';
  });

  ipcMain.handle('eapi:open-directory', async (sender: any) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(wnd, {
      title: '选择文件夹',
      properties: ['openDirectory'],
    });
    if (canceled) {
      return null;
    } else {
      return filePaths[0]
    }
  });
}

const isDevelopment = process.env.NODE_ENV !== 'production'
export async function installVueDev() {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      if (process.env.NODE_ENV === 'development') {
        const m = await import('./devtool');
        m.fixDevTools();
        m.installDevTools();
      }
    } catch (e) {
      console.error('Vue Devtools failed to install:', e)
    }
  }
}
