<template>
  <view class="video-list">
    <scroll-view id="nav-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false" @touchmove.stop>
      <view class="nav-bar-list">
        <view class="nav-ul">
          <view
            :class="{ 'bar-item': true, active: activeNav == nav.classificationName }"
            v-for="(nav, index) in videoNav"
            :key="nav.id"
            :id="nav.id"
            :ref="'tabitem' + index"
            :data-id="nav.id"
            :data-current="nav.id"
            @tap="activeColNav(nav)"
          >
            {{ nav.classificationName }}
          </view>
        </view>
      </view>
    </scroll-view>

    <scroll-view style="margin: 14rpx 0" id="nav-list" :scroll="false" :scroll-x="true" :show-scrollbar="false" @touchmove.stop>
      <view class="nav-bar-list">
        <view class="nav-ul" style="gap: 22rpx; height: auto">
          <view
            :class="{ 'nav-item': true, activeItem: activeItem == item.classificationName }"
            v-for="(item, index) in navList"
            :key="item.id"
            :id="item.id"
            :ref="'tabitem' + item.id"
            :data-id="item.id"
            :data-current="item.id"
            @tap="activeNavItem(item)"
          >
            {{ item.classificationName }}
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="type-list">
      <view :class="{ 'type-item': true, activeType: activeType === 1 }" @tap="activeVideoType(1)">热门视频</view>
      <view :class="{ 'type-item': true, activeType: activeType === 2 }" @tap="activeVideoType(2)">最近更新</view>
    </view>
    <!-- 视频列表 -->
    <view class="list">
      <view class="list-item" v-for="(item, index) in videoList" :key="item.id" style="margin-bottom: 36rpx" @tap="onPlayer(item)">
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
        <view class="item-right" @tap.stop="shareVideo(item)">
          <image class="u-img" src="@/static/images/share-box-fill.png"></image>
        </view>
        <!-- #endif -->
      </view>
    </view>

    <view class="emity-data" v-if="!(videoList && videoList.length)">
      <u-image src="@/static/svg/rss-fill.svg" width="180rpx" height="180rpx" />
      <view>暂无搜索结果</view>
    </view>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>
<script>
import { videoType, list } from '@/api/video.js'
import { getUserInfo } from '@/api/system.js'

export default {
  data() {
    const that = this
    return {
      activeNav: '',
      videoNav: [],
      activeItem: '全部',
      activeType: 1,
      videoList: [],
      page: 1,
      pageSize: 20,
      totle: 0
    }
  },
  computed: {
    navList() {
      const { videoNav, activeNav } = this
      const data = videoNav.find((i) => i.classificationName == activeNav)
      if (data && data.children && !data.children.some((i) => i.classificationName === '全部')) data.children.unshift({ classificationName: '全部' })
      return (data && data.children) || []
    }
  },
  async onLoad() {
    await this.getVideoType()
    const { result } = await getUserInfo()

    if (result.industry) {
      const index = this.videoNav.findIndex((item) => item.classificationName === result.industry)
      const data = this.videoNav.find((item) => item.classificationName === result.industry)
      this.videoNav.splice(index, 1)
      this.videoNav.unshift(data)
      this.activeNav = data.classificationName
    } else {
      this.activeNav = this.videoNav[0].classificationName
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
      this.activeNav = nav.classificationName
      this.activeItem = '全部'
      this.activeType = 1

      this.videoList = []
      this.getVideos()
    },
    // 选中导航栏项
    activeNavItem(item) {
      this.activeItem = item.classificationName
      this.activeType = 1

      this.videoList = []
      this.getVideos()
    },
    // 选中视频类型
    activeVideoType(type) {
      this.page = 1
      this.totle = 0
      this.videoList = []
      this.activeType = type
      this.getVideos()
    },
    // 获取视频分类
    async getVideoType() {
      const { result } = await videoType({ parentId: -1 })
      this.videoNav = result
    },
    // 获取视频列表
    async getVideos() {
      try {
        uni.showLoading()
        const { activeType, activeNav, activeItem } = this
        const params = {
          primaryType: activeNav,
          secondaryType: activeItem === '全部' ? '' : activeItem,
          sortScene: activeType
        }
        const res = await list(params)
        this.videoList = res.result || []

        uni.stopPullDownRefresh()
        uni.hideLoading()
      } catch (error) {
        this.videoList = []
        uni.hideLoading()
      }
    },
    // 获取视频封面
    getVideoImg(item) {
      if (item.videoImg && item.videoImg.length) {
        return item.videoImg[0].url
      }
      return ''
    },
    // 触底加载
    scrolltolower() {
      // const { page, pageSize } = this
      // if (page * pageSize >= this.totle) return
      // this.page += 1
      // this.getVideos()
    },
    // 播放
    onPlayer(item) {
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
  padding: 32rpx 28rpx;
  padding-bottom: 0rpx;
  box-sizing: border-box;
  background-color: #f1f3f8;

  .nav-bar-list {
    flex-direction: column;
    .nav-ul {
      height: 80rpx;
      display: flex;
      gap: 46rpx;
      align-items: flex-end;
      flex-direction: row;
    }
    .bar-item {
      /* #ifndef APP-PLUS */
      display: inline-block;
      /* #endif */
      flex-wrap: nowrap;
      /* #ifndef APP-PLUS */
      white-space: nowrap;
      /* #endif */
      width: fit-content !important;
      min-width: fit-content !important;
      color: #666;
      font-size: 32rpx;
      display: flex;
      align-items: flex-end;
      position: relative;
      top: -14rpx;
      &.active {
        color: #3d3d3d;
        font-size: 48rpx;
        font-weight: bold;
        position: relative;
        &::after {
          content: '';
          width: 44rpx;
          height: 8rpx;
          background-color: #f3c873;
          position: absolute;
          left: 50%;
          bottom: -12rpx;
          margin-left: -22rpx;
        }
      }
    }
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
      width: 100rpx;
      text-align: center;
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
          left: 50%;
          bottom: -12rpx;
          margin-left: -22rpx;
        }
      }
    }
  }

  .list {
    width: 100%;
    height: calc(100% - 240rpx);
    overflow: auto;
    padding-bottom: 32rpx;
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
    .emity-icon {
      width: 180rpx;
      height: 180rpx;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
