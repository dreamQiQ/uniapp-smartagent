<template>
  <view class="user-page">
    <view class="user-info">
      <view class="user-avatar-name">
        <u-avatar :src="avatar" mode="aspectFill" shape="circle" size="120rpx" style="margin-right: 30rpx"></u-avatar>
        <view class="user-name-id">
          <view class="user-name-vip">
            <view class="user-name"> {{ userInfo.nickName }} </view>
            <view class="user-vip" :class="{ none: !userInfo.isVip }"> VIP </view>
          </view>
          <view class="user-id"> ID: {{ userInfo.userId }} </view>
        </view>
      </view>
      <view class="user-button" @tap="toUserData"> 编辑个人资料 </view>
    </view>
    <view class="user-vip-card">
      <view class="vip-card-content">
        <view class="vip-content">
          <view class="vip-name-date">
            <view class="user-vip" style="color: #666666"> VIP </view>
            <view class="vip-name"> SMART AGENT会员 </view>
          </view>
          <view v-if="userInfo.isVip" class="vip-date">有效期至：{{ expirationTime }}</view>
          <view v-else class="vip-date">开通会员尊享16项权益</view>
        </view>
        <view class="user-button vip-btn" @tap="toVipPage"> {{ userInfo.isVip ? '查看权益' : '了解更多' }} </view>
      </view>
      <view class="user-content">
        <view>
          <view class="number">{{ videoNum.today || 0 }}</view>
          <view class="label">今日浏览</view>
        </view>
        <view>
          <view class="number">{{ videoNum.sevenDay || 0 }}</view>
          <view class="label">近7日浏览</view>
        </view>
        <view>
          <view class="number">{{ videoNum.thirtyDay || 0 }}</view>
          <view class="label">近30日浏览</view>
        </view>
      </view>
      <u-notice-bar v-if="checkNotice" mode="closable" text="请尽快更新个人名片，避免潜在客户无法联系您~" speed="60" fontSize="20rpx" @close="closeNotice" />
    </view>
    <view class="card" style="padding: 14rpx 22rpx">
      <view class="card-title">推荐服务</view>
      <u-grid col="4">
        <u-grid-item v-for="item in serveList" :key="item.name" :name="item.name" @tap="handleServe(item)">
          <u-image :src="`../../static/images/${item.img}.png`" width="60rpx" height="60rpx" />
          <text class="grid-text">{{ item.name }}</text>
        </u-grid-item>
      </u-grid>
    </view>

    <view class="logout" @tap="logout"> 退出登录 </view>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { videoViewNum } from '@/api/me.js'
import defaultAvatar from '@/static/images/defaultAvatar.png'

export default {
  data() {
    return {
      serveList: [
        {
          name: '观看历史',
          img: 'history'
        },
        {
          name: '我的收藏',
          img: 'collect'
        },
        // {
        //   name: '数据中心',
        //   img: 'statistics'
        // },
        // {
        //   name: '联系客服',
        //   img: 'service'
        // },
        {
          name: '我的订单',
          img: 'order'
        }
      ],
      checkNotice: true,
      videoNum: {}
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    avatar() {
      const { avatar } = this.userInfo
      return avatar || defaultAvatar
    },
    expirationTime() {
      const { vipRecord } = this.userInfo
      return new dayjs(vipRecord.expirationTime).format('YYYY-MM-DD')
    }
  },
  watch: {
    userInfo: {
      handler() {
        const { companyName, companyPosition } = this.userInfo
        this.checkNotice = !(companyName && companyPosition)
      },
      deep: true
    }
  },
  onShow() {
    const { companyName, companyPosition } = this.userInfo
    this.checkNotice = !(companyName && companyPosition)
    this.getVideoViewNum()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.$store.dispatch('getUserInfo')
    uni.stopPullDownRefresh()
  },
  methods: {
    async getVideoViewNum() {
      const { result } = await videoViewNum()
      console.log('🚀 ~ getVideoViewNum ~ res:', result)
      this.videoNum = result
    },
    // 跳转vip
    toVipPage() {
      if (this.userInfo.isVip) {
        // uni.navigateTo({ url: '/pages/me/vip' })
      } else {
        uni.navigateTo({ url: '/pages/me/vip' })
      }
    },
    // 跳转服务
    handleServe(item) {
      uni.navigateTo({ url: `/pages/me/${item.img}?name=${item.name}` })
    },
    // 个人资料
    toUserData() {
      uni.navigateTo({ url: `/pages/me/userData` })
    },
    // 退出登录
    logout() {
      uni.setStorageSync('token', '')
      uni.setStorageSync('user_id', '')
      uni.reLaunch({ url: '/pages/me/login' })
    },
    closeNotice() {
      this.checkNotice = false
    }
  }
}
</script>

<style lang="scss" scoped>
.user-page {
  width: 100%;
  height: auto;
  padding: 60rpx 20rpx;
  .user-info {
    width: 100%;
    padding-left: 32rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-avatar-name {
      flex: 1;
      max-width: calc(100% - 150rpx);
      display: flex;
      align-items: center;
      .user-name-id {
        width: calc(100% - 160rpx);
        max-width: calc(100% - 160rpx);
      }
      .user-name-vip {
        width: 100%;
        display: flex;
        align-items: center;

        .user-name {
          width: auto;
          max-width: 100%;
          color: #3d3d3d;
          font-size: 36rpx;
          font-weight: bold;
          line-height: 52rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .user-id {
        color: #3d3d3d;
        font-size: 24rpx;
        line-height: 52rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .user-vip {
    width: auto;
    height: auto;
    padding: 4rpx 8rpx;
    text-align: center;
    line-height: 36rpx;
    color: #fff;
    font-size: 20rpx;
    font-weight: bold;
    background-color: #f3c873;
    margin-left: 20rpx;
    border-radius: 4rpx;
    &.none {
      background-color: #979797;
    }
  }
  .user-button {
    width: auto;
    margin: 0;
    color: #666;
    font-size: 20rpx;
    padding: 8rpx 6rpx;
    border-radius: 8rpx;
    border: 1px solid #ccc;
    background-color: transparent;
  }
  .user-vip-card {
    width: 100%;
    height: auto;
    margin-bottom: 20rpx;
    .vip-card-content {
      width: 100%;
      height: 174rpx;
      border-radius: 14rpx 14rpx 0 0;
      background-color: #fff;
      background-image: url('@/static/images/banner1.png');
      background-size: 100% 100%;
      margin-bottom: 30rpx;
      padding: 24rpx 44rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .vip-content {
        color: #f3c873;
        width: calc(100% - 120rpx);
        .vip-name-date {
          width: calc(100% - 70rpx);
          display: flex;
          align-items: center;
          margin-bottom: 8rpx;
          .user-vip {
            margin-left: 0rpx;
            margin-right: 20rpx;
          }
          .vip-name {
            font-size: 28rpx;
            font-weight: bold;
            line-height: 52rpx;
          }
        }
        .vip-date {
          font-size: 24rpx;
          line-height: 52rpx;
          margin-left: 70rpx;
        }
      }
      .vip-btn {
        color: #f3c873;
        padding: 8rpx 18rpx;
        border: 1px solid #f3c873;
        background-color: transparent;
      }
    }
    .user-content {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      padding: 0rpx 60rpx;
      margin-bottom: 30rpx;
      .number {
        color: #000;
        font-size: 36rpx;
        font-weight: bold;
        line-height: 52rpx;
        margin-bottom: 10rpx;
      }
      .label {
        color: #979797;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 52rpx;
      }
    }
    .u-notice-bar {
      padding: 10rpx 20rpx;
      border-radius: 14rpx;
    }
  }
  .card-title {
    color: #3d3d3d;
    font-size: 28rpx;
    font-weight: bold;
    line-height: 52rpx;
    margin-bottom: 16rpx;
  }
  .u-grid {
    .u-grid-item {
      margin-bottom: 26rpx;
    }
    .grid-text {
      color: #3d3d3d;
      font-size: 18rpx;
      font-weight: bold;
      line-height: 40rpx;
      margin-top: 12rpx;
    }
  }
}
.logout {
  width: 80%;
  height: auto;
  color: rgb(255, 80, 80);
  font-size: 36rpx;
  text-align: center;
  border: 1px solid rgb(248, 135, 135);
  border-radius: 14rpx;
  padding: 12rpx 0rpx;
  margin: 0 auto;
  margin-top: 60rpx;
}
</style>
