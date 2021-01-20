
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
let files = require.context('./modules/', false, /\.js$/);
let routes = []
files.keys().forEach(key => {
    routes = routes.concat(files(key).default)
});
export default new VueRouter({
    routes,
    mode: 'history',
    base: '/'// 默认就是 /
})