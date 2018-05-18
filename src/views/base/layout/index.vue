<style media="screen" lang="less">@import "./styles/index.less";</style>

<template>
<div class="main" :class="{'main-hide-text': shrink}">
	<div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
		<shrinkable-menu :shrink="shrink" :menu-list="menuList" :open-names="openMenuArr">
			<div slot="top" class="logo-con">
				<img v-show="!shrink" src="/static/logo.jpg" key="max-logo" />
				<img v-show="shrink" src="/static/logo-min.jpg" key="min-logo" />
			</div>
		</shrinkable-menu>
	</div>
	<div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
		<div class="main-header">
			<div class="navicon-con">
				<div :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)',padding: '6px 15px',cursor:'pointer'}" type="text" @click="toggleClick">
					<Icon type="navicon" size="32"></Icon>
				</div>
			</div>
			<div class="header-middle-con">
				<div class="main-breadcrumb">
					<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
				</div>
			</div>
			<div class="header-avator-con">
				<full-screen v-model="isFullScreen"></full-screen>
				<message-tip v-model="mesCount"></message-tip>
                <!-- <theme-switch></theme-switch> -->
				<div class="user-dropdown-menu-con">
					<Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
						<Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
							<a href="javascript:void(0)">
								<span class="main-user-name">{{ userName }}</span>
								<Icon type="arrow-down-b"></Icon>
							</a>
							<DropdownMenu slot="list">
								<DropdownItem name="ownSpace">个人中心</DropdownItem>
								<DropdownItem name="loginout" divided>退出登录</DropdownItem>
							</DropdownMenu>
						</Dropdown>
						<Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
					</Row>
				</div>
			</div>
		</div>

		<div class="tags-con">
			<tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
		</div>
	</div>
	<div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
		<div class="single-page">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>
	</div>
</div>

</template>

<script>
import {
	mapGetters
}
from 'vuex'
import shrinkableMenu from './components/shrinkable-menu/shrinkable-menu.vue';
import fullScreen from './components/fullscreen.vue';
import messageTip from './components/message-tip.vue';
import breadcrumbNav from './components/breadcrumb-nav.vue';
import tagsPageOpened from './components/tags-page-opened.vue';
import util from '@/util';
export default {
	components: {
		shrinkableMenu,
		fullScreen,
		messageTip,
		breadcrumbNav,
		tagsPageOpened
	},
	data() {
		return {
			shrink: false,
			menuList: [],
			userName: 'noname',
            isFullScreen: false,
            openMenuArr:[]
		}
	},
	computed: {
		// ...mapGetters([
		//     'menuList'
		// ]),
		avatorPath() {
			return localStorage.avatorImgPath;
		},
		pageTagsList() {
			return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
		},
		currentPath() {
			return this.$store.state.app.currentPath; // 当前面包屑数组
		},
		mesCount() {
			return this.$store.state.app.messageCount;
		}
	},
	created() {
		this.$http.get( "/layout", data => {
			this.menuList = data.menuList
		})
	},
	watch: {
		'$route' ( to ) {

			this.$store.commit( 'setCurrentPageName', to.name );
			let pathArr = util.setCurrentPath( this, to.name );
			if ( pathArr.length > 2 ) {
				this.$store.commit( 'addOpenSubmenu', pathArr[ 1 ].name );
			}
			this.checkTag( to.name );
			localStorage.currentPageName = to.name;
		},
	},
    mounted () {
        this.init();
    },
	methods: {
        init () {
                // let pathArr = util.setCurrentPath(this, this.$route.name);
                // this.$store.commit('updateMenulist');
                // if (pathArr.length >= 2) {
                //     this.$store.commit('addOpenSubmenu', pathArr[1].name);
                // }
                this.userName = localStorage.getItem('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
                this.$store.commit('initCachepage');
                this.openMenuArr.push(this.$router.currentRoute.meta.name)
            },
		toggleClick() {
			this.shrink = !this.shrink;
		},
		handleClickUserDropdown( name ) {
			if ( name === 'ownSpace' ) {
				util.openNewPage( this, 'ownspace_index' );
				this.$router.push( {
					name: 'ownspace_index'
				} );
			} else if ( name === 'loginout' ) {
				// 退出登录
				this.$store.commit( 'logout', this );
				this.$store.commit( 'clearOpenedSubmenu' );
				this.$router.push( {
					name: '/login'
				} );
			}
		},
        checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
	}
};

</script>
