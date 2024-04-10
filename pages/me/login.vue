<template>
  <view class="login">
    <u--input class="mb-16" placeholder="请输入用户名" border="surround" v-model="username" @change="change"></u--input>
    <u--input placeholder="请输入密码" border="surround" v-model="password" @change="change"></u--input>
    <u-button class="btn-login" type="primary" text="登录" @click="login"></u-button>
  </view>
</template>

<script>
import env from '@/common/utils/env.js'
import { login, getUserInfo } from '@/api/system.js'

export default {
  data() {
    return {
      username: env.username,
      password: env.password,
    }
  },
  methods: {
    change() {},
    async login() {
      let deviceInfo = uni.getDeviceInfo()

      const res = await login({ username: this.username, password: this.password, deviceInfo })
      if (res && res.code === 200) {
        uni.setStorageSync('token', res.data.access_token)
        uni.setStorageSync('user_id', res.data.user_id)
        uni.reLaunch({
          url: '/pages/video/list',
        })
      } else {
        console.log(res)
        uni.showToast({ icon: 'none', title: res.msg })
      }
    },
  },
}
</script>

<style>
.login {
  padding: 20px;
}

.btn-login {
  margin-top: 50px;
}
</style>
