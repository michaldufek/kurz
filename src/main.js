/*
 =========================================================
 * Vue Black Dashboard - v1.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/black-dashboard
 * Copyright 2018 Creative Tim (http://www.creative-tim.com)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import VueRouter from "vue-router";
import RouterPrefetch from 'vue-router-prefetch'
import App from "./App";
// TIP: change to import router from "./router/starterRouter"; to start with a clean layout
import router from "./router/index";
import VueSimpleAlert from "vue-simple-alert";

import BlackDashboard from "./plugins/blackDashboard";
import i18n from "./i18n"

import './registerServiceWorker'
import helper from '@/custom/assets/js/helper';
import http from "@/custom/assets/js/http";
// workaround for strange axios TypeError: ..get(...).then(...).catch(...).finally is not a function
const promiseFinally = require('promise.prototype.finally');
promiseFinally.shim();

Vue.use(BlackDashboard);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);
Vue.use(VueSimpleAlert);

// global filter on the Vue instance
Vue.filter(helper.roundToFixed.name, helper.roundToFixed)
Vue.filter(helper.chartUpdateTsText.name, helper.chartUpdateTsText)

http.setHttpPrototype()

Vue.prototype.$store = {
  setItem(key, value) {
    if (value instanceof Array || value instanceof Object) {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  },
  getItem(key) {
    return JSON.parse(localStorage.getItem(key))    
  },
  removeItem(key) {
    localStorage.removeItem(key)
  }
}

/* eslint-disable no-new */
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount("#app");