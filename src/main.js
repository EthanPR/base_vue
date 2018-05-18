// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import {appRouter} from './router/router';
// iview
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// api
import Api from './util/api'


Vue.use(iView);


Vue.prototype.$http = Api;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
  created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
})
