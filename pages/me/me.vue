<template>
  <view>
    我的
    <u-button text="退出登录" @click="logout"></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      uni.setStorageSync('token', '')
      uni.setStorageSync('user_id', '')
      uni.reLaunch({ url: '/pages/me/login' })
    }
  }
}
</script>

<style></style>
