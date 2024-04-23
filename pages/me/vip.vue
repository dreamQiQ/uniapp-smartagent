<template>
  <div class="vip-page">
    <u-image src="@/static/images/promotion.png" width="100%" height="400rpx" />
    <view class="vip">
      <view class="vip-title"> 成为smart agent VIP </view>
      <view class="card vip-card">
        <u-row justify="space-between" gutter="10">
          <u-col span="4" v-for="item in vipList" :key="item.Id">
            <view class="card-item" :class="{ active: vipId === item.price_id }" @tap="() => (vipId = item.price_id)">
              <u-tag v-if="item.promotion" :text="item.promotion" type="error"></u-tag>
              <view class="title"> {{ item.Title }} </view>
              <view class="money">
                <view class="unit"> $ </view>
                <view class="number"> {{ item.price }} </view>
              </view>
              <view class="old"> ¥{{ item.original_price }} </view>
              <!-- <view class="nextMonth"> 次月续费58元 </view> -->
            </view>
          </u-col>
        </u-row>
        <view class="hint"> 按每季135美元自动续费，可随时取消 </view>
      </view>
      <view class="vip-title"> 专属功能 </view>
      <view class="card vip-card" style="padding: 16rpx; padding-right: 60rpx">
        <view class="li-item">
          <view class="item-text">
            <u-image src="@/static/images/vipIcon1.png" shape="circle" width="56rpx" height="56rpx" />
            <view> 适配专业人设打造 </view>
          </view>
          <view class="message"> 1 </view>
        </view>
        <view class="li-item">
          <view class="item-text">
            <u-image src="@/static/images/vipIcon2.png" shape="circle" width="56rpx" height="56rpx" />
            <view> 海量视频观看&分享 </view>
          </view>
          <view class="message"> 无限制 </view>
        </view>
        <view class="li-item">
          <view class="item-text">
            <u-image src="@/static/images/vipIcon3.png" shape="circle" width="56rpx" height="56rpx" />
            <view> 无水印海报分享&下载 </view>
          </view>
          <view class="message"> 无限制 </view>
        </view>
        <view class="li-item">
          <view class="item-text">
            <u-image src="@/static/images/vipIcon4.png" shape="circle" width="56rpx" height="56rpx" />
            <view> 最新前沿资讯分析 </view>
          </view>
          <view class="message"> 1 </view>
        </view>
        <view class="li-item">
          <view class="item-text">
            <u-image src="@/static/images/vipIcon5.png" shape="circle" width="56rpx" height="56rpx" />
            <view> 个人营销数据分析 </view>
          </view>
          <view class="message"> 1 </view>
        </view>
      </view>
      <view class="vip-btn" :class="{ disabled: !vipId }" @tap="openVipModel"> 7天免费使用并开通 </view>
      <u-checkbox-group v-model="agreement" placement="row">
        <u-checkbox label="开通前阅读《会员服务协议》及《自动续费服务规则》" :name="true" shape="circle" labelSize="26rpx" />
      </u-checkbox-group>
      <!-- vip弹窗 -->
      <u-modal :show="vipModal" :closeOnClickOverlay="true" @close="vipModal = false">
        <view slot="default" class="model-content">
          <view class="model-title">确认开通</view>
          <view class="model-text">请阅读并同意《会员服务协议》</view>
        </view>

        <view slot="confirmButton" class="model-btn" @tap="openVip">继续开通</view>
      </u-modal>
    </view>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </div>
</template>
<script>
import { getVipList, openVip } from '@/api/me.js'

export default {
  data() {
    return {
      agreement: [],
      vipModal: false,
      vipList: [],
      vipId: ''
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  onLoad() {
    this.getVipList()
  },
  onShow() {
    this.$store.dispatch('getUserInfo')
    if (this.userInfo.isVip) uni.switchTab({ url: '/pages/me/me' })
  },
  methods: {
    // 获取vip套餐
    async getVipList() {
      try {
        const { list } = await getVipList()
        this.vipList = list
      } catch (error) {
        this.$refs.uNotify.show({
          type: 'error',
          message: '获取会员信息失败',
          fontSize: '24rpx'
        })
      }
    },
    // vip model
    openVipModel() {
      const { vipId, agreement } = this
      if (!vipId) return false
      if (!agreement?.length) {
        this.$refs.uNotify.show({
          type: 'warning',
          message: '请先阅读《会员服务协议》及《自动续费服务规则》',
          fontSize: '24rpx'
        })
        return false
      }
      this.vipModal = true
    },
    // 开通vip
    async openVip() {
      try {
        const { vipId } = this
        const { result } = await openVip(vipId)
        plus.runtime.openURL(result, (err) => {
          console.error(err)
        })

        this.vipModal = false
      } catch (error) {
        console.error(error)
        this.$refs.uNotify.show({
          type: 'error',
          message: error.msg || '开通会员失败',
          fontSize: '24rpx'
        })
      }
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.vip-page {
  width: 100%;
  height: auto;
  .vip {
    padding: 32rpx 26rpx;
    .vip-title {
      color: #000;
      font-size: 32rpx;
      font-weight: 400;
      line-height: 44rpx;
      margin: 32rpx 0rpx;
    }
    .vip-card {
      padding: 100rpx 24rpx 8rpx 24rpx;
      .card-item {
        height: 224rpx;
        position: relative;
        border: 1px solid #f3c873;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &.active {
          box-shadow: 0px 4px 10px 0px #f3c873;
        }
        .title {
          color: #3d3d3d;
          font-size: 24rpx;
          font-weight: bold;
          line-height: 40rpx;
          margin-bottom: 8rpx;
        }
        .money {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a81414;
          .unit {
            font-size: 16rpx;
            font-weight: bold;
            line-height: 40rpx;
            margin-right: 4rpx;
          }
          .number {
            font-size: 28rpx;
            font-weight: bold;
            line-height: 40rpx;
          }
        }
        .old {
          color: #f3c873;
          font-size: 12rpx;
          font-weight: bold;
          position: relative;
          &::before {
            content: '';
            width: 24rpx;
            height: 2rpx;
            background-color: #f3c873;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -12rpx;
            margin-top: -2rpx;
          }
        }
        .nextMonth {
          color: #979797;
          font-size: 18rpx;
          font-weight: bold;
          line-height: 40rpx;
          height: 40rpx;
        }
        .u-transition {
          width: fit-content;
          position: absolute;
          top: -26rpx;
          left: -2rpx;
        }
      }
      .li-item {
        width: 100%;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 32rpx;
        color: #333;
        font-size: 24rpx;
        font-weight: bold;
        .u-transition {
          margin-right: 16rpx;
        }
        .item-text {
          display: flex;
          align-items: center;
        }
        .message {
          color: #db9204;
        }
      }
      .hint {
        color: #9e9e9e;
        font-size: 20rpx;
        font-weight: 400;
        line-height: 40rpx;
        margin-top: 28rpx;
      }
    }
    .vip-btn {
      width: 80%;
      height: auto;
      color: #fff;
      margin: 0 auto;
      margin-top: 46rpx;
      text-align: center;
      padding: 12rpx 0rpx;
      border-radius: 16rpx;
      background: #f3c873;
      &.disabled {
        background: rgba(243, 200, 115, 0.5);
      }
    }
    .u-checkbox-group {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20rpx;
    }
  }
  .model-content {
    width: 100%;
    text-align: center;
    .model-title {
      color: #3d3d3d;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 44rpx;
    }
    .model-text {
      color: #9e9e9e;
      font-size: 28rpx;
    }
  }
  .model-btn {
    width: 100%;
    color: #865a07;
    font-size: 28rpx;
    font-weight: bold;
    text-align: center;
    border-radius: 16rpx;
    padding: 18rpx 0rpx;
    background-color: #f3c873;
  }
}
</style>
