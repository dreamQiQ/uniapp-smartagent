<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    const token = uni.getStorageSync('token')
    if (!token) {
      uni.reLaunch({
        url: '/pages/me/login',
        success: () => {
          //#ifdef APP-PLUS
          plus.navigator.closeSplashscreen()
          //#endif
        },
      })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uview-ui/index.scss';

.mb-16 {
  margin-bottom: 16px;
}
</style>
