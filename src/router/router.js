import Layout from '@/views/base/layout'
import Login from '@/views/base/login'
import _import from './_import'
export const sysRouter = [{
        path: "/login",
        name: "/login",
        component: _import("base/login")
    },
    {
        path: "/",
        name: "/",
        redirect: "/home",
        component: _import("base/layout")
    },

]

export const appRouter = [{
        path: '/access',
        icon: 'key',
        name: 'access',
        title: "权限管理",
        component: Layout,
        children: [{
            path: 'index',
            title: '权限管理',
            name: 'access_index',
            component: () =>
                import ('@/views/access/access.vue')
        }]
    },
    {
        path: '/sys',
        icon: 'key',
        name: '/sys',
        title: "系统管理",
        component: Layout,
        children: [{
            path: 'admin',
            title: '账号管理',
            name: '/sys/admin',
            component: () =>
                import ('@/components/baseTable')
        }]
    }
]
export const otherRouter = {
    path: "/",
    name: "otherRouter",
    component: _import("base/layout"),
    children: [{
            path: 'home',
            title: "首页",
            name: 'home_index',
            component: () =>
                import ('@/views/home/index.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () =>
                import ('@/views/own-space/index.vue')
        },
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () =>
                import ('@/views/message/message.vue')
        },
        {
            path: 'table',
            title: '表格组件',
            name: '/table',
            // 此处的name必须和path一致，且需要加上反斜杠
            meta:{
                name:'/enroll'
            },
            // meta的name与侧栏菜单父级的name必须一致
            component: () =>
                import ('@/views/demo-table')
        },

    ]
}

export const routers = [
    ...sysRouter,
    ...appRouter,
    otherRouter
]
