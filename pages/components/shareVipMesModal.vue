<template>
  <u-modal class="share-vip-mes-modal" :show="showModal" width="376rpx" :showConfirmButton="false" closeOnClickOverlay>
    <view class="vip-msg">
      <view class="msg-content">
        <!-- checkbox-mark -->
        <view class="msg-text">
          <view class="text-title"> 开通会员可享受 </view>
          <view class="text-item">
            <u-image class="item-img" src="@/static/images/checkbox.png" width="20rpx" height="16rpx" />
            <view> 海量正版视频素材收藏转发 </view>
          </view>
          <view class="text-item">
            <u-image class="item-img" src="@/static/images/checkbox.png" width="20rpx" height="16rpx" />
            <view> 无水印海报下载 </view>
          </view>
          <view class="text-item">
            <u-image class="item-img" src="@/static/images/checkbox.png" width="20rpx" height="16rpx" />
            <view> 个人营销精准数据分析 </view>
          </view>
        </view>
        <view class="msg-btn">
          <view class="btn" @click="toVipPage">订阅会员畅享定制功能</view>
          <view class="btn-close" @click="close"> 不了，先逛逛 </view>
        </view>
      </view>
      <view class="msg-title">当前功能为会员专属内容</view>
    </view>
  </u-modal>
</template>
<script>
export default {
  data() {
    return {
      showModal: false
    }
  },
  onShow() {
    this.showModal = false
  },
  methods: {
    show() {
      this.showModal = true
    },
    close() {
      this.showModal = false
    },
    toVipPage() {
      uni.navigateTo({ url: '/pages/me/vip' })
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.share-vip-mes-modal /deep/ {
  .u-popup__content {
    background-color: transparent;
  }
  .u-modal {
    .u-modal__content {
      padding: 0rpx !important;
    }
    .u-line {
      display: none;
    }
  }
}
.vip-msg {
  width: 100%;
  height: auto;
  padding-top: 21rpx;
  position: relative;
  // border: 1px solid red;
  .msg-title {
    width: 214rpx;
    height: 42rpx;
    padding: 0 8rpx;
    border-radius: 14rpx;
    background-color: #f3c873;
    color: #666;
    font-size: 18rpx;
    font-weight: bold;
    line-height: 40rpx;
    margin: 0 auto;
    position: absolute;
    top: 0rpx;
    left: 50%;
    margin-left: -107rpx;
  }
  .msg-content {
    width: 100%;
    height: 396rpx; // 125+73
    position: relative;
    top: 0rpx;
    border-radius: 14rpx;
    background-color: #fff;
    .msg-text {
      width: 100%;
      height: 250rpx;
      overflow: hidden;
      border-radius: 14rpx;
      background-color: #fff;
      background-image: url('@/static/images/vipMsg.png');
      background-size: cover;
      background-position: center;
      padding: 56rpx 38rpx;
      .text-title {
        color: #f3c873;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 40rpx;
        margin-bottom: 18rpx;
      }
      .text-item {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 16rpx;
        line-height: 20rpx;
        margin-bottom: 10rpx;
        .item-img {
          margin-right: 18rpx;
        }
      }
    }
    .msg-btn {
      width: 100%;
      height: 146rpx;
      padding: 26rpx 54rpx;
      background-color: #fff;
      text-align: center;
      .btn {
        width: 100%;
        height: 52rpx;
        color: #8d5f06;
        font-size: 20rpx;
        font-weight: bold;
        line-height: 52rpx;
        border-radius: 20rpx;
        background: rgba(243, 200, 115, 0.49);
        margin-bottom: 16rpx;
      }
      .btn-close {
        color: #979797;
        font-size: 16rpx;
        text-decoration: underline;
      }
    }
  }
}
</style>
