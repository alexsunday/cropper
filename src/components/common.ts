import Vue from 'vue';
import WarnMsgWidget from './warn-msg.vue';

export async function showWarnMsg<T>(msg: string, timeoutMs: number, parent?: Vue):Promise<T> {
  return new Promise((resolve, reject) => {
    const w = new Vue({
      parent: parent,
      render: h=>{
        return h(WarnMsgWidget, {
          props: {
            msg: msg,
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
