import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/components/homePage/index'
import photo from '../components/fileTable/index'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: homePage
        },
        {
            path: '/homePage',
            name: 'homePage',
            component: homePage
        },
        {
            path: '/fileTable',
            name: 'photo',
            component: photo
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/login/index')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../components/register/index')
        }
    ]
})
