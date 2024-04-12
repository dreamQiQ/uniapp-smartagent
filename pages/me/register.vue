<template>
  <view class="register">
    <view class="title">请填写基本信息</view>
    <uni-forms ref="form" :modelValue="formData" label-position="top">
      <uni-forms-item label="邮箱" name="username">
        <uni-easyinput v-model="formData.username" focus class="uni-input-custom" type="text" :inputBorder="false" :clearable="false" :placeholderStyle="placeholderStyle" placeholder="请输入邮箱" />
      </uni-forms-item>
      <uni-forms-item label="密码" name="password">
        <uni-easyinput class="uni-input-custom" v-model="formData.password" type="password" :inputBorder="false" :clearable="false" :placeholderStyle="placeholderStyle" placeholder="请输入密码" />
      </uni-forms-item>
      <uni-forms-item label="确认密码" name="confirm">
        <uni-easyinput v-model="formData.confirm" class="uni-input-custom" type="password" :inputBorder="false" :clearable="false" :placeholderStyle="placeholderStyle" placeholder="请再次输入密码" />
      </uni-forms-item>
      <uni-forms-item label="英文名" name="nickName">
        <uni-easyinput v-model="formData.nickName" class="uni-input-custom" type="text" :inputBorder="false" :clearable="false" :placeholderStyle="placeholderStyle" placeholder="请输入英文名" />
      </uni-forms-item>
      <uni-forms-item label="手机号" name="mobile" class="mobile-input">
        <span class="mobile-before">+1</span>
        <uni-easyinput v-model="formData.mobile" class="uni-input-custom" type="text" :inputBorder="false" :clearable="false" :placeholderStyle="placeholderStyle" placeholder="请输入手机号" />
      </uni-forms-item>
      <uni-forms-item label="执照号" name="licenseNumber">
        <uni-easyinput
          v-model="formData.licenseNumber"
          focus
          class="uni-input-custom"
          type="text"
          :inputBorder="false"
          :clearable="false"
          :placeholderStyle="placeholderStyle"
          placeholder="请输入执照号"
        />
      </uni-forms-item>
      <uni-forms-item label="行业" name="industry">
        <uni-data-select v-model="formData.industry" class="uni-input-custom" :localdata="range" placement="top" :clear="false" placeholder="请选择行业"></uni-data-select>
      </uni-forms-item>
    </uni-forms>
    <button class="subButton" :class="{ disabledBtn: disabledBtn }" @click="submit">登录</button>
  </view>
</template>
<script>
import { register } from '@/api/system.js'

export default {
  data() {
    const that = this
    return {
      formData: {
        username: '',
        password: '',
        confirm: '',
        nickName: '',
        mobile: '',
        licenseNumber: '',
        industry: ''
      },
      range: [
        { value: '保险', text: '保险' },
        { value: '法律', text: '法律' },
        { value: '房产置业', text: '房产置业' },
        { value: '移民', text: '移民' },
        { value: '财税', text: '财税' },
        { value: '工作创业', text: '工作创业' },
        { value: '生活', text: '生活' }
      ],
      rules: {
        username: {
          rules: [
            { required: true, errorMessage: '请输入邮箱' },
            { format: 'email', errorMessage: '请输入正确的邮箱' }
          ]
        },
        password: {
          rules: [
            { required: true, errorMessage: '请输入密码' },
            { minLength: 6, maxLength: 20, errorMessage: '请输入正确的密码' }
          ]
        },
        confirm: {
          rules: [
            { required: true, errorMessage: '请输入密码' },
            { minLength: 6, maxLength: 20, errorMessage: '请输入正确的密码' },
            {
              validateFunction(rule, value, data, callback) {
                if (value !== that.formData.password) {
                  console.log(value, that.formData.password)
                  debugger
                  callback('两次输入的密码不一致')
                }
                return true
              }
            }
          ]
        },
        nickName: {
          rules: [{ required: true, errorMessage: '请输入英文名' }]
        },
        licenseNumber: {
          rules: [{ required: true, errorMessage: '请输入执照号' }]
        },
        mobile: {
          rules: [
            { required: true, errorMessage: '请输入手机号' },
            {
              validateFunction(rule, value, data, callback) {
                let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
                if (!reg.test(value)) {
                  debugger
                  callback('请输入正确的手机号')
                }
                debugger
                return true
              }
            }
          ]
        }
      },
      placeholderStyle: 'color: #ccc; font-size: 32rpx;'
    }
  },
  computed: {
    disabledBtn() {
      return !Object.values(this.formData).every((item) => item)
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  methods: {
    submit() {
      if (this.disabledBtn) return
      uni.showLoading()
      this.$refs.form
        .validate()
        .then(async (res) => {
          await this.register()
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
    async register() {
      const formData = JSON.parse(JSON.stringify(this.formData))
      delete formData.confirm
      const res = await register(formData)
      if (res.code === 200) {
        this.formData = {
          username: '',
          password: '',
          confirm: '',
          nickName: '',
          mobile: '',
          licenseNumber: '',
          industry: ''
        }
        this.$refs.form.resetFields()
        uni.reLaunch({ url: '/pages/me/login' })
      }
    }
  },
  components: {}
}
</script>
<style scoped>
.register {
  padding: 30rpx 56rpx;

  .title {
    width: 100%;
    text-align: center;
    color: #f0a105;
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 32rpx;
  }

  .mobile-input .uni-forms-item__content {
    color: #666;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    .mobile-before {
      margin-right: 32rpx;
    }
  }

  .uni-forms-item {
    margin-bottom: 40rpx;
    .uni-forms-item__label {
      color: #333333;
      font-size: 32rpx;
      font-weight: 600;
    }

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
        font-size: 32rpx;
        background-color: #f5f7fa;
      }
      .uni-select {
        width: 100%;
        height: 88rpx;
        display: flex;
        font-size: 32rpx;
        box-sizing: border-box;
        align-items: center;
        border-radius: 16rpx;
        background-color: #f5f7fa;
        font-size: 32rpx;
        background-color: #f5f7fa;
        border: none;
        .uni-select__input-text {
          color: #9e9e9e;
        }
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
}
</style>
