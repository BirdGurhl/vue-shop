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
Vue.filter('dateFormat', (date) => {
  const dt = new Date(date)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
