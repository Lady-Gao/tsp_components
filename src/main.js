import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
import i18n from "./lang"
import ElementUI from 'element-ui';
// import cvtspweb from '../index';
// Vue.use(cvtspweb);
Vue.use(ElementUI);

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')
 