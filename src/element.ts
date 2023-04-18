
import Vue from 'vue';
import { MessageBox, Message } from 'element-ui';

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
