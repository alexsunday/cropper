import Vue from 'vue'
import App from './App.vue';
import "./element";

import { loadTinyModels } from '@/components/face-recognition';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

// 启动后加载一下 face-api 的模型
loadTinyModels();
