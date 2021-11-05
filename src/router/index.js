import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/components/homePage/index'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'homePage',
            component: homePage
        },
        {
            path: '/homePage',
            name: 'homePage',
            component: homePage
        },
        {
            path: '/photo',
            name: 'photo'
        }
    ]
})
