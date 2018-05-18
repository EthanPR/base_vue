import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview';

import {routers} from './router';

Vue.use(Router)


// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers
};


const router =  new Router(RouterConfig);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next()
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
})

export default router
