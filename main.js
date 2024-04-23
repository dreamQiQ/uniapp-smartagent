import App from './App'
import store from './store'
import uView from 'uview-ui'
import dayjs from 'dayjs'

Vue.use(uView)
Vue.prototype.$store = store
Vue.filter('timeFormat', function (timestamp, format) {
  if (!timestamp) return ''
  let date = new dayjs(timestamp.toString())

  if (date.get('year') == new Date().getFullYear()) {
    return date.format('YYYY-MM-DD')
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss')
  }
})

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
