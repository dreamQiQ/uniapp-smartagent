<template>
  <view class="video-list">
    <u-row align="end">
      <u-col v-for="nav in videoNav" :key="nav" class="video-nav-col" :class="{ active: activeNav === nav }" justify="end" align="center" span="2" @click="activeColNav(nav)">{{ nav }}</u-col>
    </u-row>
    <view class="nav-list">
      <view class="nav-item" :class="{ activeItem: activeItem === item }" v-for="item in navList[activeNav]" :key="item" @click="activeNavItem(item)">{{ item }}</view>
    </view>
    <view class="type-list">
      <view :class="{ 'type-item': true, activeType: activeType === '热门视频' }" @click="activeVideoType('热门视频')">热门视频</view>
      <view :class="{ 'type-item': true, activeType: activeType === '最近更新' }" @click="activeVideoType('最近更新')">最近更新</view>
    </view>
    <!-- 视频列表 -->
    <u-list height="calc(100% - 216rpx)" @scrolltolower="scrolltolower">
      <u-list-item v-for="(item, index) in videoList" :key="item.Id" style="margin-bottom: 36rpx">
        <view class="list-item" @click="onPlayer(item)">
          <view class="item-left">
            <view class="item-img">
              <u-image :src="getVideoImg(item)" width="200rpx" height="128rpx" radius="14rpx" />
              <view class="date">{{ item.CreatedAt | timeFormat }}</view>
            </view>

            <view class="item-content">
              <view class="title">{{ item.Title }}</view>
              <view>{{ item.view_count || 0 }} 万播放</view>
              <view>{{ item.forward_count || 0 }} 万转发</view>
            </view>
          </view>
        </view>
      </u-list-item>
    </u-list>
  </view>
</template>
<script>
import { list } from '@/api/video.js'

export default {
  data() {
    return {
      activeNav: '移民',
      videoNav: ['移民', '法律', '地产', '保险', '财税', '其他'],
      activeItem: '全部',
      navList: {
        移民: ['全部', '婚姻绿卡', '亲属绿卡', '职业绿卡', '签证'],
        法律: ['全部'],
        地产: ['全部'],
        保险: ['全部'],
        财税: ['全部'],
        其他: ['全部']
      },
      activeType: '热门视频',
      videoList: [],
      page: 1,
      pageSize: 20,
      totle: 0
    }
  },
  onShow() {
    this.init()
  },
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    init() {
      this.page = 1
      this.totle = 0
      this.videoList = []
      this.getVideos()
    },
    // 选中导航栏
    activeColNav(nav) {
      this.activeNav = nav
      this.activeItem = '全部'
      this.activeType = '热门视频'
    },
    // 选中导航栏项
    activeNavItem(item) {
      this.activeItem = item
      this.activeType = '热门视频'
    },
    // 选中视频类型
    activeVideoType(type) {
      this.page = 1
      this.totle = 0
      this.videoList = []
      this.activeType = type
      this.getVideos()
    },
    // 获取视频列表
    async getVideos() {
      const { page, pageSize, activeType } = this
      const params = {
        limit: pageSize,
        offset: (page - 1) * pageSize
      }
      const result = await list(params)
      this.videoList.push(...result.list)
      this.totle = result.pageInfo.totalRows
      uni.stopPullDownRefresh()
    },
    // 获取视频封面
    getVideoImg(item) {
      if (item.video_img && item.video_img.length) {
        return item.video_img[0].url
      }
      return ''
    },
    // 触底加载
    scrolltolower() {
      const { page, pageSize } = this
      if (page * pageSize >= this.totle) return
      this.page += 1
      this.getVideos()
    },
    // 播放
    onPlayer(item) {
      uni.setStorageSync('video', item)
      uni.navigateTo({ url: '/pages/video/player' })
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.video-list {
  width: 100%;
  height: 100%;
  padding: 32rpx 28rpx;
  box-sizing: border-box;
  background-color: #f1f3f8;
  .video-nav-col {
    color: #666;
    font-size: 32rpx;
  }
  .active {
    color: #3d3d3d;
    font-size: 48rpx;
    font-weight: bold;
    position: relative;
    &::after {
      content: '';
      width: 44rpx;
      height: 8rpx;
      background-color: #f3c873;
      margin: 0 auto;
      position: absolute;
      bottom: -12rpx;
    }
  }

  .nav-list {
    width: 100%;
    height: auto;
    margin: 30rpx 0 14rpx;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 22rpx;
    .nav-item {
      width: 122rpx;
      min-width: 122rpx;
      height: 52rpx;
      text-align: center;
      line-height: 52rpx;
      color: #3d3d3d;
      font-size: 20rpx;
      border-radius: 12rpx;
      background-color: #fff;
      &.activeItem {
        color: #fff;
        background-color: #f3c873;
      }
    }
  }

  .type-list {
    width: 100%;
    height: auto;
    margin: 28rpx 0;
    display: flex;
    align-items: center;
    color: #3d3d3d;
    font-size: 20rpx;
    font-weight: bold;
    gap: 30rpx;
    .type-item {
      width: 92rpx;
      padding: 4rpx 8rpx;
      &.activeType {
        color: #f3c873;
        position: relative;
        &::after {
          content: '';
          width: 44rpx;
          height: 8rpx;
          background-color: #f3c873;
          position: absolute;
          left: 28rpx;
          bottom: -12rpx;
        }
      }
    }
  }

  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 18rpx;
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
  }
}
</style>
