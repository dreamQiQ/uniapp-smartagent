<template>
  <view class="user-data">
    <u-avatar
      :class="{ loading: loading }"
      :src="userInfo.avatar"
      mode="aspectFill"
      default-url="../../static/images/defaultAvatar.png"
      shape="circle"
      size="160rpx"
      @tap="uploadAvatar"
    ></u-avatar>

    <u-cell-group :border="false" :customStyle="groupStyle">
      <u-cell title="英文名" :titleStyle="titleStyle" :isLink="true" @tap="openPopup('英文名', 'nickName')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.nickName }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
      <u-cell title="业务简介" :titleStyle="titleStyle" :isLink="true" :border="false" @tap="openPopup('业务简介', 'businessBrief')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.businessBrief || '暂无简介' }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
    </u-cell-group>
    <u-cell-group :border="false" :customStyle="groupStyle">
      <u-cell title="邮箱" :titleStyle="titleStyle" :isLink="true" @tap="openPopup('邮箱', 'email')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.email }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
      <u-cell title="手机号" :titleStyle="titleStyle" :isLink="true" @tap="openPopup('手机号', 'mobile')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.mobile }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
      <u-cell title="微信号" :titleStyle="titleStyle" :isLink="true" :border="false" @tap="openPopup('微信号', 'wechatAccount')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.wechatAccount || '去填写' }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
    </u-cell-group>
    <u-cell-group :border="false" :customStyle="groupStyle">
      <u-cell title="公司名称" :titleStyle="titleStyle" :isLink="true" @tap="openPopup('公司名称', 'companyName')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.companyName || '去填写' }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
      <u-cell title="公司电话" :titleStyle="titleStyle" :isLink="true" @tap="openPopup('公司电话', 'companyPhone')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.companyPhone || '去填写' }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
      <u-cell title="公司地址" :titleStyle="titleStyle" :isLink="true" @tap="openPopup('公司地址', 'companyAddress')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.companyAddress || '去填写' }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
      <u-cell title="职务" :titleStyle="titleStyle" :isLink="true" :border="false" @tap="openPopup('职务', 'companyPosition')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.companyPosition || '去填写' }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
    </u-cell-group>
    <u-cell-group :border="false" :customStyle="groupStyle">
      <u-cell title="执照号" :titleStyle="titleStyle">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.licenseNumber }}</view>
        </view>
      </u-cell>
      <u-cell title="行业" :titleStyle="titleStyle" :isLink="true" :border="false" @tap="openPopup('行业', 'industry')">
        <view slot="right-icon" class="cell-right">
          <view>{{ userInfo.industry }}</view>
          <u-icon name="arrow-right" color="#979797" />
        </view>
      </u-cell>
    </u-cell-group>
    <!-- 弹出 -->
    <u-popup :show="showPopup" :round="10" :closeOnClickOverlay="true" mode="bottom" customStyle="padding: 30rpx" @close="closePopup">
      <view class="popup-header">
        <view @tap="closePopup"> 关闭 </view>
        <view @tap="editUserData">完成</view>
      </view>

      <u-form ref="form" :model="formData" :rules="rules" labelPosition="top" labelWidth="auto" style="margin: 44rpx 0rpx 16rpx">
        <u-form-item v-if="field === 'businessBrief'" :prop="field">
          <u-textarea v-model="formData[field]" :maxlength="-1" :placeholder="placeholder" style="background-color: #f5f7fa" />
        </u-form-item>
        <u-form-item v-else-if="field === 'industry'" :prop="field" @tap="industryShow = true">
          <u-input v-model="formData[field]" :readonly="true" :placeholder="placeholder" fontSize="32rpx" type="text" :placeholderStyle="placeholderStyle" style="background-color: #f5f7fa">
            <u-icon slot="suffix" name="arrow-right"></u-icon>
          </u-input>
        </u-form-item>
        <u-form-item v-else-if="['mobile', 'companyPhone'].includes(field)" :prop="field">
          <u-input v-model="formData[field]" :placeholder="placeholder" fontSize="32rpx" type="text" :placeholderStyle="placeholderStyle" style="background-color: #f5f7fa">
            <u--text text="+1" slot="prefix" margin="0 3px 0 0" type="tips"></u--text>
          </u-input>
        </u-form-item>
        <u-form-item v-else :prop="field">
          <u-input v-model="formData[field]" :placeholder="placeholder" fontSize="32rpx" type="text" :placeholderStyle="placeholderStyle" style="background-color: #f5f7fa" />
        </u-form-item>
      </u-form>
    </u-popup>
    <u-picker :show="industryShow" :columns="industryColumns" :closeOnClickOverlay="true" @close="industryShow = false" @cancel="industryShow = false" @confirm="confirm"></u-picker>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>
<script>
import env from '@/common/utils/env.js'
import { uploadAvatar, editUserInfo } from '@/api/me.js'
import { getUserInfo } from '@/api/system.js'

export default {
  data() {
    return {
      groupStyle: {
        backgroundColor: '#fff',
        borderRadius: '14px',
        marginBottom: '40rpx'
      },
      titleStyle: {
        color: '#3d3d3d',
        fontWeight: 'bold'
      },
      placeholderStyle: 'color: #ccc; font-size: 32rpx;',
      showPopup: false,
      userInfo: {},
      formData: {},
      placeholder: '',
      field: '',
      industryShow: false,
      industryColumns: [['保险', '法律', '房产置业', '移民', '财税', '工作创业', '生活']],
      rules: {
        nickName: [{ required: true, message: '请输入英文名', trigger: 'change' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          {
            validator(rule, value, callback) {
              const reg = /^[0-9]{10}$/
              return reg.test(value)
            },
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ],
        companyPhone: [
          { required: true, message: '请输入电话号', trigger: 'change' },
          {
            validator(rule, value, callback) {
              const reg = /^[0-9]{10}$/
              return reg.test(value)
            },
            message: '请输入正确的电话号',
            trigger: 'change'
          }
        ],
        licenseNumber: [{ required: true, message: '请输入执照号', trigger: 'change' }]
      },
      loading: false
    }
  },
  onShow() {
    this.userInfo = this.$store.state.userInfo
    if (!this.userInfo?.userId) this.getUserData()
  },
  // 下拉刷新
  async onPullDownRefresh() {
    await this.getUserData()
    uni.stopPullDownRefresh()
  },
  methods: {
    // 获取用户信息
    async getUserData() {
      const { result } = await getUserInfo()
      this.userInfo = result
      this.formData = JSON.parse(JSON.stringify(result))
    },
    // 上传头像
    async uploadAvatar(event) {
      const that = this
      if (this.loading) return
      this.loading = true
      uni.chooseImage({
        count: 1,
        success: async (imageRes) => {
          try {
            const fileUrl = imageRes.tempFilePaths[0]
            const { data } = await that.uploadFilePromise(fileUrl)
            const res = JSON.parse(data)
            // 上传成功后修改用户信息
            const edit = await editUserInfo({ avatar: res.result })
            await that.getUserData()
            that.$store.dispatch('getUserInfo')
            that.loading = false
          } catch (error) {
            that.loading = false
          }
        },
        fail: ({ errMsg }) => {
          console.log('🚀 ~ uploadAvatar ~ err:', errMsg)
          this.loading = false
          if (errMsg !== 'chooseImage:fail cancel') {
            this.$refs.uNotify.show({
              type: 'error',
              message: '上传失败',
              fontSize: '24rpx'
            })
          }
        }
      })
    },
    // 上传
    uploadFilePromise(url) {
      // 根据配置来设置域名和端口号
      const host = uni.getStorageSync('host') || env.host
      const port = uni.getStorageSync('port') || env.port
      const protocl = uni.getStorageSync('ishttps') ? 'https://' : 'http://'
      const token = uni.getStorageSync('token')
      let baseUrl = protocl + host
      if (port) baseUrl += ':' + port
      const api = '/gomk/system/common/file/upload/avatar'

      return new Promise((resolve, reject) => {
        let a = uni.uploadFile({
          url: baseUrl + api,
          filePath: url,
          name: 'file',
          fileType: 'image',
          header: {
            Authorization: 'Bearer ' + token
          },
          success: (res) => {
            resolve(res)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    // 打开
    openPopup(type, field) {
      this.showPopup = true
      this.placeholder = type
      this.field = field
      // 表单验证规则
      this.$nextTick(() => {
        this.$refs.form.setRules(this.rules)
      })
    },
    // 取消
    closePopup() {
      this.formData = JSON.parse(JSON.stringify(this.userInfo))
      this.showPopup = false
    },
    // 行业编辑
    confirm(data) {
      this.formData.industry = data.value[0]
      this.industryShow = false
    },
    // 编辑用户信息
    async editUserData() {
      const { formData, field } = this
      this.$refs.form
        .validate()
        .then(async () => {
          await editUserInfo({ [field]: formData[field] })
          this.$store.dispatch('getUserInfo')
          this.getUserData()
          this.closePopup()
        })
        .catch((err) => {
          console.log('🚀 ~ this.$refs.form.validate ~ err:', err)
        })
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.user-data {
  width: 100%;
  height: 100%;
  padding: 30rpx;
  background-color: #f1f3f8;
  .u-avatar {
    margin: 0 auto;
    margin-bottom: 80rpx;
    border: 1px solid #d3d4d6;
    &.loading {
      opacity: 0.5;
    }
  }
  .cell-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #979797;
    font-size: 28rpx;
    .u-icon {
      margin-left: 10rpx;
      position: relative;
      top: 2rpx;
    }
  }
  .popup-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #979797;
  }
}
</style>
