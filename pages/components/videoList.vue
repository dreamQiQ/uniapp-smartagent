<template>
  <view class="video-list">
    <u-list height="100%" @scrolltolower="scrolltolower" v-if="list && list.length">
      <u-list-item v-for="(item, index) in list" :key="item.id">
        <view class="list-item" @tap="onPlayer(item)">
          <view class="item-left">
            <view class="item-img">
              <u-image :src="getVideoImg(item)" loadingIcon="photo-fill" width="200rpx" height="128rpx" radius="14rpx" />
              <view class="date">{{ item.uploadDate | timeFormat }}</view>
            </view>

            <view class="item-content">
              <view class="title">{{ item.title }}</view>
              <view>{{ item.viewCount || 0 }} 次播放</view>
              <view>{{ item.forwardCount || 0 }} 次转发</view>
            </view>
          </view>
          <!-- #ifdef APP-PLUS -->
          <view v-if="showShare" class="item-right" @tap.stop="shareVideo(item)">
            <image class="u-img" src="@/static/images/share-box-fill.png"></image>
          </view>
          <!-- #endif -->
        </view>
      </u-list-item>
    </u-list>
    <view class="emity-data" v-if="!(list && list.length) && showEmity">
      <u-image src="@/static/svg/rss-fill.svg" width="180rpx" height="180rpx" />
      <view>{{ emity }}</view>
    </view>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    showShare: {
      type: Boolean,
      default: true
    },
    showEmity: {
      type: Boolean,
      default: true
    },
    emity: {
      type: String,
      default: '暂无搜索结果'
    }
  },
  data() {
    return {}
  },
  computed: {
    isVip() {
      return this.$store.state.userInfo.isVip
    }
  },
  methods: {
    // 获取视频封面
    getVideoImg(item) {
      if (item.videoImg && item.videoImg.length) {
        return item.videoImg[0].url
      }
      return ''
    },
    // 触底加载
    scrolltolower() {},
    // 播放
    onPlayer(item) {
      console.log('🚀 ~ onPlayer ~ item:', item)
      uni.setStorageSync('video', item)
      //#ifdef H5
      uni.navigateTo({ url: `/pages/video/player?id=${item.id}` })
      //#endif
      //#ifdef APP-PLUS
      uni.navigateTo({ url: `/pages/video/nplayer?id=${item.id}` })
      //#endif
    },
    // 分享
    shareVideo(item) {
      const { userId } = this.$store.state.userInfo
      uni.shareWithSystem({
        href: `http://123.6.102.119:8053/#/pages/video/player?id=${item.id}&uId=${userId}`
      })
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.video-list {
  width: 100%;
  height: 100%;
  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 18rpx;
    margin-bottom: 36rpx;
    .item-left {
      width: calc(100% - 54rpx);
      display: flex;
      align-items: center;
      .item-img {
        width: 200rpx;
        height: 128rpx;
        border-radius: 14rpx;
        position: relative;
        margin-right: 22rpx;
        .video-img {
          width: 200rpx;
          height: 128rpx;
          border-radius: 14rpx;
        }
        .date {
          position: absolute;
          right: 10rpx;
          bottom: 10rpx;
          color: #fff;
          font-size: 14rpx;
          font-weight: bold;
        }
      }
      .item-content {
        width: calc(100% - 248rpx);
        height: 128rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        view {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #3d3d3d;
          font-size: 20rpx;
          font-weight: 200;
        }
        .title {
          font-size: 24rpx;
          font-weight: 500;
        }
      }
    }
    .item-right {
      .u-img {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
  .emity-data {
    width: 100%;
    height: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #9e9e9e;
    font-size: 24rpx;
    .emity-icon {
      width: 140rpx;
      height: 140rpx;
      margin-bottom: 40rpx;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
