<style>
    .ivu-shrinkable-menu{
        height: 100%;
        width: 100%;
    }
</style>

<template>
    <Menu ref="sideMenu" :active-name="activeName" :open-names="openNames"
        :theme="menuTheme" width="auto"
        accordion @on-select="changeMenu">
        <template v-for="(item, index) in menuList">
            <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="item.path">
                <Icon :type="item.icon" :size="iconSize" :key="item.path"></Icon>
                <span class="layout-text" :key="item.path">{{ itemTitle(item) }}</span>
            </MenuItem>

            <Submenu v-if="item.children.length > 1" :name="item.name" :key="item.path">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="(child, count) in item.children">
                    <MenuItem :name="child.path" :key="count">
                        <Icon :type="child.icon" :size="iconSize" :key="count*10"></Icon>
                        <span class="layout-text" :key="child.name">{{ child.meta.title }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'primary'
        },
        openNames: {
            type: Array
        }
    },
    data() {
        return {
            activeName: ''
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            return item.meta.title
            // if (typeof item.title === 'object') {
            //     return this.$t(item.title.i18n);
            // } else {
            //     return item.title;
            // }
        }
    },
    updated () {
        this.$nextTick(() => {
            this.activeName = this.$router.currentRoute.path;
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
                this.$refs.sideMenu.updateActiveName();
            }
        });
    },

};
</script>
