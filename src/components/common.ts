import Vue from 'vue';
import WarnMsgWidget from './warn-msg.vue';

export async function showWarnMsg<T>(msg: string, timeoutMs: number, color?: string, parent?: Vue):Promise<T> {
  return new Promise((resolve, reject) => {
    const w = new Vue({
      parent: parent,
      render: h=>{
        return h(WarnMsgWidget, {
          props: {
            msg: msg,
            color: color,
            timeoutMs: timeoutMs,
          },
          on: {
            finish: (v:T) => {
              resolve(v);
              w.$destroy();
              w.$el.remove();
            },
            error: (e: unknown) => {
              reject(e);
              w.$destroy();
              w.$el.remove();
            }
          }
        });
      }
    });
    w.$mount();
    document.body.appendChild(w.$el);
  });
}

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
