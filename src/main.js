// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import ViewUI from 'view-design'
import axios from 'axios'
import global from '../static/global.js'
import 'view-design/dist/styles/iview.css'
import {post, get} from './service/axiosSetting'
import Moment from 'moment'
//  导入所有请求方法
// 引入ElementUI 组件库
import ElementUI from 'element-ui'
// 引入ElementUI 组件库的css样式
import 'element-ui/lib/theme-chalk/index.css'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Video from 'video.js'
import 'video.js/dist/video-js.css'

Vue.prototype.$video = Video
// 引入图片浏览插件
Vue.use(Viewer)
// 引入图片浏览插件
Viewer.setDefaults({
    Options: {
        'inline': true,
        'button': true,
        'navbar': true,
        'title': true,
        'toolbar': true,
        'tooltip': true,
        'movable': true,
        'zoomable': true,
        'rotatable': true,
        'scalable': true,
        'transition': true,
        'fullscreen': true,
        'keyboard': true,
        'url': 'data-source'
    }
})
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    return Moment(dataStr).format(pattern)
})

Vue.prototype.axios = axios
Vue.use(VueRouter)
Vue.use(ViewUI)
Vue.use(ElementUI)
Vue.prototype.global = global
Vue.prototype.post = post
Vue.prototype.get = get
Vue.config.productionTip = false
axios.defaults.baseURL = '/api'
Vue.prototype.$moment = Moment
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
