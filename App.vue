<script>
import store from '@/store/index.js'
export default {
  onLaunch: function () {
    const token = uni.getStorageSync('token')

    if (!token) {
      uni.reLaunch({
        url: '/pages/me/login',
        success: () => {
          //#ifdef APP-PLUS
          plus.navigator.closeSplashscreen()
          //#endif
        }
      })
    } else {
      console.log(111)

      store.dispatch('getUserInfo')
    }
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  }
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
