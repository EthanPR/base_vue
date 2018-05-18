import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';


Vue.use(Vuex);

const getters = {
    menuList: state => state.app.menuList,
    nickname: state => state.user.nickname,
    logined: state => state.user.logined,
    perms: state => state.user.perms,
    visitedViews: state => state.app.visitedViews,
    baseUrl: state => state.app.baseUrl
  }


const store = new Vuex.Store({
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,
        user
    },
    getters
});

export default store;
