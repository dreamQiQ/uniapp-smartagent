<template>
  <view class="home">
    <view class="search"><searchInput></searchInput></view>
    <u-swiper :list="bannerList" height="296rpx" circular indicator indicatorMode="line" @change="(i) => (current = i.current)" @click="toRecommend">
      <view slot="indicator" class="indicator">
        <view class="indicator-item" v-for="(v, i) in bannerList" :key="i" :class="{ 'indicator-current': i == current }"></view>
      </view>
    </u-swiper>
    <view class="video-card-list" v-for="item in videoList" :key="item.id">
      <view class="card-header">
        <view class="card-title">{{ item.classificationName }}相关</view>
        <view class="card-more" @click="toVideoList(item.id)"> 更多</view>
      </view>
      <view class="card-list">
        <view class="card-item" v-for="v in item.videoVOList" :key="v.id" @click="toVideoDetail(v)">
          <view class="item-img">
            <u-image :src="v.videoImg[0].url" width="100%" height="200rpx" mode="aspectFill" />
          </view>
          <view class="item-label">{{ v.title }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { videoCount } from '@/api/video.js'
import searchInput from '@/pages/components/searchInput.vue'

export default {
  data() {
    return {
      current: 0,
      bannerList: ['https://cdn.uviewui.com/uview/swiper/swiper3.png', 'https://cdn.uviewui.com/uview/swiper/swiper2.png', 'https://cdn.uviewui.com/uview/swiper/swiper1.png'],
      videoList: []
    }
  },
  onShow() {
    this.getVideoList()
  },
  methods: {
    async getVideoList() {
      const { result } = await videoCount()
      this.videoList = result || []
    },
    // 跳转视频列表
    toVideoList(id) {
      uni.setStorageSync('video_type', id)
      uni.switchTab({
        url: `/pages/video/list`
      })
    },
    // 跳转视频详情
    toVideoDetail(item) {
      uni.setStorageSync('video', item)
      //#ifdef H5
      uni.navigateTo({ url: `/pages/video/player?id=${item.id}` })
      //#endif
      //#ifdef APP-PLUS
      uni.navigateTo({ url: `/pages/video/nplayer?id=${item.id}` })
      //#endif
    },
    // 跳转推荐
    toRecommend(index) {}
  },
  components: { searchInput }
}
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10rpx 0rpx 20rpx;
  background-color: #f1f3f8;
  .search {
    width: 100%;
    height: auto;
    background: #fff;
    padding: 16rpx 30rpx;
    margin-bottom: 20rpx;
  }
  .u-swiper {
    overflow: visible;
    margin-bottom: 58rpx;
    padding: 0 20rpx;
    .indicator {
      position: relative;
      top: 56rpx;
      display: flex;
      .indicator-item {
        width: 16rpx;
        height: 16rpx;
        background-color: #d8d8d8;
        margin: 0 10rpx;
        transform: rotate(45deg);
        &.indicator-current {
          background-color: #f3c873;
        }
      }
    }
  }
  .video-card-list {
    width: 100%;
    height: auto;
    margin-bottom: 30rpx;
    padding: 0 20rpx;
    .card-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #9e9e9e;
      font-size: 24rpx;
      margin-bottom: 12rpx;
      .card-title {
        height: 26rpx;
        line-height: 26rpx;
        color: #f0a105;
        font-size: 36rpx;
        font-weight: bold;
      }
    }
    .card-list {
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: repeat(2, 50%);
      grid-column-gap: 8rpx;
      .card-item {
        width: 100%;
        max-width: 100%;
        height: auto;
        margin-bottom: 12rpx;
        .item-img {
          width: 100%;
          height: 200rpx;
          margin-bottom: 16rpx;
          border-radius: 14rpx;
          overflow: hidden;
        }
        .item-label {
          width: 100%;
          max-width: 100%;
          color: #3d3d3d;
          font-size: 20rpx;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
