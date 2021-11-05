import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/components/homePage/index'
import photo from '../components/photo/index'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/homePage',
            name: 'homePage',
            component: homePage
        },
        {
            path: '/photo',
            name: 'photo',
            component: photo
        }
    ]
})
