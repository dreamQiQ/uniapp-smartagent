<script>
import store from '@/store/index.js'

export default {
  data() {
    return {}
  },
  onLaunch: function (options) {
    const token = uni.getStorageSync('token')

    if (!token && options.path !== 'pages/video/player') {
      uni.reLaunch({
        url: '/pages/me/login',
        success: () => {
          //#ifdef APP-PLUS
          plus.navigator.closeSplashscreen()
          //#endif
        }
      })
    } else if (options.path !== 'pages/video/player') {
      store.dispatch('getUserInfo')
    }
  },
  methods: {},
  components: {}
}
</script>
<style lang="scss">
/*每个页面公共css */
@import 'uview-ui/index.scss';
@import 'static/style/video.scss';

uni-page-body,
html,
body {
  height: 100%;
}
uni-page-body {
  overflow-y: auto;
}

view {
  box-sizing: border-box;
}

.mb-16 {
  margin-bottom: 16px;
}
</style>
