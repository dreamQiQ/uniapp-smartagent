<template>
  <view class="video-list">
    <scroll-view id="nav-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false" @touchmove.stop>
      <view class="nav-bar-list">
        <view class="nav-ul">
          <view
            :class="{ 'bar-item': true, active: activeNav == nav.id }"
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
            :class="{ 'nav-item': true, activeItem: activeItem == item.id }"
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

    <view class="type-list" v-if="videoNav.length">
      <view :class="{ 'type-item': true, activeType: activeType === 1 }" @tap="activeVideoType(1)">热门视频</view>
      <view :class="{ 'type-item': true, activeType: activeType === 2 }" @tap="activeVideoType(2)">最近更新</view>
    </view>
    <!-- 视频列表 -->
    <view style="width: 100%; height: calc(100% - 240rpx)">
      <video-list ref="videoList" :list="videoList"></video-list>
    </view>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>
<script>
import { videoType, list } from '@/api/video.js'
import { getUserInfo } from '@/api/system.js'
import videoList from '@/pages/components/videoList.vue'

export default {
  data() {
    const that = this
    return {
      activeNav: '',
      videoNav: [],
      activeItem: 0,
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
      const data = videoNav.find((i) => i.id == activeNav)
      if (data && data.children && !data.children.some((i) => i.id === 0)) data.children.unshift({ id: 0, classificationName: '全部' })
      return (data && data.children) || []
    }
  },
  async onLoad() {
    await this.getVideoType()
    const industry = this.$store.state.unserInfo?.industry || ''

    if (industry) {
      // const index = this.videoNav.findIndex((item) => item.classificationName === result.industry)
      const data = this.videoNav.find((item) => item.classificationName === result.industry)
      // this.videoNav.splice(index, 1)
      // this.videoNav.unshift(data)
      this.activeNav = data.id
    } else {
      this.activeNav = this.videoNav[0].id
    }
  },
  onShow() {
    this.$nextTick(() => {
      this.$refs.videoList.$refs.vipMsg.close()
    })
    const videoType = uni.getStorageSync('video_type')
    if (videoType) this.activeNav = videoType

    this.init()
  },
  onHide() {
    uni.hideLoading()
    uni.removeStorageSync('video_type')
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
      this.activeNav = nav.id
      this.activeItem = 0
      this.activeType = 1

      this.videoList = []
      this.getVideos()
    },
    // 选中导航栏项
    activeNavItem(item) {
      this.activeItem = item.id
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
          primaryClassificationId: activeNav,
          secondaryClassificationId: activeItem || undefined,
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
    }
  },
  components: { videoList }
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
}
</style>
