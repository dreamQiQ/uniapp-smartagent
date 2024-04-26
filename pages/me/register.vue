<template>
  <view class="register">
    <view class="title">请填写基本信息</view>
    <u-form ref="form" :model="formData" labelPosition="top" labelWidth="auto" :labelStyle="labelStyle">
      <u-form-item label="邮箱" prop="userName">
        <u-input v-model="formData.userName" color="#9e9e9e" fontSize="32rpx" type="text" :placeholderStyle="placeholderStyle" placeholder="请输入邮箱" />
      </u-form-item>
      <u-form-item label="密码" prop="password">
        <u-input color="#9e9e9e" fontSize="32rpx" v-model="formData.password" type="password" :placeholderStyle="placeholderStyle" placeholder="请输入密码" />
      </u-form-item>
      <u-form-item label="确认密码" prop="confirm">
        <u-input v-model="formData.confirm" color="#9e9e9e" fontSize="32rpx" type="password" :placeholderStyle="placeholderStyle" placeholder="请再次输入密码" />
      </u-form-item>
      <u-form-item label="英文名" prop="nickName">
        <u-input v-model="formData.nickName" color="#9e9e9e" fontSize="32rpx" type="text" :placeholderStyle="placeholderStyle" placeholder="请输入英文名" />
      </u-form-item>
      <u-form-item label="手机号" prop="mobile" class="mobile-input">
        <view class="mobile">
          <view class="areaCode"> +1 </view>
          <u-input v-model="formData.mobile" color="#9e9e9e" fontSize="32rpx" type="text" :placeholderStyle="placeholderStyle" placeholder="请输入手机号" />
        </view>
      </u-form-item>
      <u-form-item label="执照号" prop="licenseNumber">
        <u-input
          v-model="formData.licenseNumber"
          color="#9e9e9e"
          fontSize="32rpx"
          type="text"
          :inputBorder="false"
          :clearable="false"
          :placeholderStyle="placeholderStyle"
          placeholder="请输入执照号"
        />
      </u-form-item>
      <u-form-item label="行业" prop="industry" @tap="industryShow = true">
        <u-input v-model="formData.industry" :readonly="true" color="#9e9e9e" fontSize="32rpx" type="text" :placeholderStyle="placeholderStyle" placeholder="请选择行业">
          <u-icon slot="suffix" name="arrow-right"></u-icon>
        </u-input>
      </u-form-item>
      <u-picker :show="industryShow" :columns="industryColumns" :closeOnClickOverlay="true" @close="industryShow = false" @cancel="industryShow = false" @confirm="confirm"></u-picker>
    </u-form>
    <button class="subButton" :class="{ disabledBtn: disabledBtn }" @tap="submit">注册</button>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>
<script>
import { register } from '@/api/system.js'

export default {
  data() {
    const that = this
    return {
      formData: {
        userName: '',
        password: '',
        confirm: '',
        nickName: '',
        mobile: '',
        licenseNumber: '',
        industry: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码' },
          { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'change' }
        ],
        confirm: [
          { required: true, message: '请输入密码' },
          { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'change' },
          {
            validator(rule, value, callback) {
              return value === that.formData.password
            },
            message: '两次输入的密码不一致',
            trigger: 'change'
          }
        ],
        nickName: [{ required: true, message: '请输入英文名' }],
        licenseNumber: [
          { required: true, message: '请输入执照号' },
          {
            validator(rule, value, callback) {
              const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{5,20}$/
              return reg.test(value)
            },
            message: '5-20字符，字母和数字组成，不区分大小写',
            trigger: 'change'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号' },
          {
            validator(rule, value, callback) {
              const reg = /^[0-9]{10}$/
              return reg.test(value)
            },
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ]
      },
      placeholderStyle: 'color: #ccc; font-size: 32rpx;',
      labelStyle: {
        color: '#333333',
        fontSize: '32rpx',
        fontWeight: 'bold',
        marginBottom: '16rpx'
      },
      industryShow: false,
      industryColumns: [['保险', '法律', '房产置业', '移民', '财税', '工作创业', '生活']]
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
          this.$refs.uNotify.error(err.msg || '操作失败')
          uni.hideLoading()
        })
    },
    async register() {
      const formData = JSON.parse(JSON.stringify(this.formData))
      delete formData.confirm
      const res = await register(formData)
      if (res.code === 200) {
        this.formData = {
          userName: '',
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
    },
    confirm(data) {
      this.formData.industry = data.value[0]
      this.industryShow = false
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.register {
  padding: 30rpx 56rpx;

  .title {
    width: 100%;
    text-align: center;
    color: #f0a105;
    font-size: 36rpx;
    font-weight: 600;
    margin: 0 auto;
    margin-bottom: 32rpx;
  }

  .mobile {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    color: #666;
    font-size: 28rpx;
    .areaCode {
      margin-right: 32rpx;
    }
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
    margin-bottom: 16rpx;
    margin-top: 28rpx;

    &:after {
      border: 1px solid transparent;
    }

    &.disabledBtn {
      background-color: #fee7c5;
    }
  }
}
</style>
