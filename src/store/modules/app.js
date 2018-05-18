import {otherRouter, appRouter} from '@/router/router';
import Util from '@/util'

const app = {
  state: {
    menuList: [],
    cachePage: [],
    menuTheme: 'dark', // 主题
    themeColor: '',
    pageOpenedList: [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ],
    tagsList: [...otherRouter.children],
    currentPath: [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ], // 面包屑数组
    currentPageName: '',
    routers: [
      otherRouter, ...appRouter
    ],
    messageCount: 0,
    openedSubmenuArr: [], // 要展开的菜单数组
    dontCache: []
  },
  mutations: {
    removeTag(state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenedList.splice(index, 1);
        }
      });
    },
    setTagsList (state, list) {
            state.tagsList.push(...list);
        },
    setCurrentPath(state, pathArr) {
      state.currentPath = pathArr;
    },
    closePage(state, name) {
      state.cachePage.forEach((item, index) => {
        if (item === name) {
          state.cachePage.splice(index, 1);
        }
      });
    },
    pageOpenedList(state, get) {
      let openedPage = state.pageOpenedList[get.index];
      if (get.argu) {
        openedPage.argu = get.argu;
      }
      if (get.query) {
        openedPage.query = get.query;
      }
      state.pageOpenedList.splice(get.index, 1, openedPage);
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    initCachepage(state) {
      if (localStorage.cachePage) {
        state.cachePage = JSON.parse(localStorage.cachePage);
      }
    },
    setMessageCount(state, count) {
      state.messageCount = count;
    },
    clearAllTags(state) {
      state.pageOpenedList.splice(1);
      state.cachePage.length = 0;
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    clearOpenedSubmenu(state) {
      state.openedSubmenuArr.length = 0;
    },
    clearOtherTags(state, vm) {
      let currentName = vm.$route.name;
      let currentIndex = 0;
      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index;
        }
      });
      if (currentIndex === 0) {
        state.pageOpenedList.splice(1);
      } else {
        state.pageOpenedList.splice(currentIndex + 1);
        state.pageOpenedList.splice(1, currentIndex - 1);
      }
      let newCachepage = state.cachePage.filter(item => {
        return item === currentName;
      });
      state.cachePage = newCachepage;
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    changeMenuTheme(state, theme) {
      state.menuTheme = theme;
    },
    changeMainTheme(state, mainTheme) {
      state.themeColor = mainTheme;
    },
    addOpenSubmenu(state, name) {
      let hasThisName = false;
      let isEmpty = false;
      if (name.length === 0) {
        isEmpty = true;
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true;
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name);
      }
    },
    setOpenedList(state) {
      state.pageOpenedList = localStorage.pageOpenedList
        ? JSON.parse(localStorage.pageOpenedList)
        : [otherRouter.children[0]];
    },
    setCurrentPageName(state, name) {
      state.currentPageName = name;
    },
    increateTag(state, tagObj) {
      if (!Util.oneOf(tagObj.name, state.dontCache)) {
        state.cachePage.push(tagObj.name);
        localStorage.cachePage = JSON.stringify(state.cachePage);
      }
      state.pageOpenedList.push(tagObj);
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    }
  }
};

export default app;
