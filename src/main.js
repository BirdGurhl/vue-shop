import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 全局引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 引入全局样式
import './assets/global.css'

import service from './service.js'

Vue.prototype.$http = service

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
