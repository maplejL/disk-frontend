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
import Moment from 'moment'

// 引入ElementUI 组件库
import ElementUI from 'element-ui'
// 引入ElementUI 组件库的css样式
import 'element-ui/lib/theme-chalk/index.css'

Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    return Moment(dataStr).format(pattern)
})

Vue.prototype.axios = axios
Vue.use(VueRouter)
Vue.use(ViewUI)
Vue.use(ElementUI)
Vue.prototype.global = global
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
