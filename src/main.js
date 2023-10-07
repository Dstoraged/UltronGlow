import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "normalize.css/normalize.css";
import i18n from "./locales";
import storage from "./utils/localstorage.js";
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(ElementUI, { size: "small", zIndex: 3000 });
Vue.config.productionTip = false;
Vue.use(storage);
Vue.use(Vant);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
