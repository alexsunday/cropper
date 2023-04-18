import Vue from 'vue';

export type outOpt = {
  dir: string;
  width: number;
  height: number;
}

// 简单封装一下 xhr
export async function xhrRequest(url: string):Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      const ab = xhr.response;
      resolve(ab);
    }
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4) {
        if(xhr.status > 399) {
          reject(new Error(xhr.response));
        }
      }
    }
    xhr.open("GET", url, true);
    xhr.send(null);
  });
}
