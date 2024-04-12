<template>
  <view class="login">
    <img class="logo" src="@/static/svg/logo.svg" alt="logo" />
    <view class="title">Smart AgentZ</view>

    <uni-forms ref="form" :modelValue="formData" :rules="rules">
      <uni-forms-item name="username">
        <uni-easyinput
          v-model="formData.username"
          focus
          class="uni-input-custom"
          type="text"
          :inputBorder="false"
          :clearable="false"
          :placeholderStyle="placeholderStyle"
          placeholder="请输入绑定的邮箱"
        />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput class="uni-input-custom" v-model="formData.password" type="password" :inputBorder="false" :clearable="false" :placeholderStyle="placeholderStyle" placeholder="请输入密码" />
      </uni-forms-item>
    </uni-forms>
    <button class="subButton" :class="{ disabledBtn: disabledBtn }" @click="submit">提交注册</button>
    <p class="reset-password">忘记密码</p>
    <p class="register" @click="register">注册新账户</p>
  </view>
</template>

<script>
import { login, getUserInfo } from '@/api/system.js'

export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: {
          rules: [
            { required: true, errorMessage: '请输入正确的邮箱' },
            { format: 'email', errorMessage: '请输入正确的邮箱' }
          ]
        },
        password: {
          rules: [
            { required: true, errorMessage: '请输入正确的密码' },
            { minLength: 6, maxLength: 20, errorMessage: '请输入正确的密码' }
          ]
        }
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
          debugger
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
      let deviceInfo = uni.getDeviceInfo()

      const res = await login({
        username: this.formData.username,
        password: this.formData.password,
        deviceInfo
      })

      if (res && res.code === 200) {
        uni.setStorageSync('token', res.data.access_token)
        uni.setStorageSync('user_id', res.data.user_id)
        uni.reLaunch({ url: '/pages/video/list' })
      }
    },
    register() {
      uni.reLaunch({ url: '/pages/me/register' })
    }
  }
}
</script>

<style scoped>
.login {
  padding: 250rpx 54rpx 54rpx;

  .logo {
    width: 130rpx;
    height: 130rpx;
    margin-bottom: 72rpx;
  }

  .title {
    font-size: 48rpx;
    font-weight: 600;
    line-height: 64rpx;
    margin-bottom: 48rpx;
  }
  .uni-forms-item {
    margin-bottom: 30rpx;

    .uni-input-custom {
      input {
        width: 100%;
        height: 88rpx;
        display: flex;
        color: #9e9e9e;
        font-size: 32rpx;
        padding: 20rpx 4rpx;
        box-sizing: border-box;
        align-items: center;
        border-radius: 16rpx;
        background-color: #f5f7fa;
        color: #9e9e9e;
        font-size: 32rpx;
        background-color: #f5f7fa;
      }
    }
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
    margin-bottom: 16rpx;

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
    margin-top: 376rpx;
    color: #fdb03c;
    font-size: 28rpx;
    text-align: center;
  }
}
</style>
