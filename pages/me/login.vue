<template>
  <view class="login">
    <u-image class="logo" src="@/static/svg/logo.svg" width="130rpx" height="130rpx" />
    <view class="title">Smart AgentZ</view>

    <u-form ref="form" :model="formData" :rules="rules" labelPosition="top">
      <u-form-item prop="username">
        <u-input v-model="formData.username" color="#9e9e9e" fontSize="32rpx" :focus="true" type="text" border="none" :placeholderStyle="placeholderStyle" placeholder="请输入绑定的邮箱"></u-input>
      </u-form-item>
      <u-form-item prop="password">
        <u-input v-model="formData.password" color="#9e9e9e" fontSize="32rpx" type="password" border="none" :placeholderStyle="placeholderStyle" placeholder="请输入密码"></u-input>
      </u-form-item>
    </u-form>

    <button class="subButton" :class="{ disabledBtn: disabledBtn }" @tap="submit">登录</button>
    <p class="reset-password">忘记密码</p>
    <p class="register" @tap="register">注册新账户</p>
  </view>
</template>

<script>
import { login, getUserInfo } from '@/api/system.js'
import store from '@/store/index.js'

export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'change'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            min: 6,
            max: 20,
            message: '密码长度在6到20个字符之间',
            trigger: 'change'
          }
        ]
      },
      placeholderStyle: 'color: #ccc; font-size: 32rpx;'
    }
  },
  computed: {
    disabledBtn() {
      return !(this.formData.username && this.formData.password)
    }
  },
  methods: {
    submit() {
      if (this.disabledBtn) return
      uni.showLoading()
      this.$refs.form
        .validate()
        .then(async (res) => {
          await this.login(res)
          uni.hideLoading()
        })
        .catch((err) => {
          if (err.code) {
            uni.showToast({
              icon: 'none',
              title: err.msg
            })
          }
          uni.hideLoading()
        })
    },
    async login() {
      try {
        let deviceInfo = uni.getDeviceInfo()

        const res = await login({
          username: this.formData.username,
          password: this.formData.password,
          deviceInfo
        })

        if (res && res.code === 200) {
          this.formData = {
            username: '',
            password: ''
          }
          this.$refs.form.resetFields()

          uni.setStorageSync('token', res.data.access_token)
          uni.setStorageSync('user_id', res.data.user_id)
          uni.setStorageSync('videoMenu', '')

          store.dispatch('getUserInfo')
          uni.reLaunch({ url: '/pages/video/home' })
        }
      } catch (error) {
        console.error(error)
      }
    },
    register() {
      uni.navigateTo({ url: '/pages/me/register' })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  padding: 200rpx 54rpx 54rpx;

  .logo {
    margin-bottom: 72rpx;
  }

  .title {
    font-size: 48rpx;
    font-weight: 600;
    line-height: 64rpx;
    margin-bottom: 48rpx;
  }

  .u-input {
    width: 100%;
    height: 88rpx;
    color: #9e9e9e;
    font-size: 32rpx;
    padding: 0rpx 24rpx !important;
    box-sizing: border-box;
    border-radius: 16rpx;
    background-color: #f5f7fa;
  }

  .subButton {
    width: 100%;
    height: 88rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 88rpx;
    border: 1px solid transparent;
    border-radius: 16rpx;
    background-color: #fdb03c;
    margin-bottom: 28rpx;
    margin-top: 28rpx;

    &:after {
      border: 1px solid transparent;
    }

    &.disabledBtn {
      background-color: #fee7c5;
    }
  }

  .reset-password {
    width: 100%;
    text-align: center;
    color: #fdb03c;
    font-size: 24rpx;
  }

  .register {
    width: 100%;
    margin-top: 326rpx;
    color: #fdb03c;
    font-size: 28rpx;
    text-align: center;
  }
}
</style>
