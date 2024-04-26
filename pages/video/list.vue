<template>
  <view class="video-list">
    <scroll-view id="nav-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false" @touchmove.stop>
      <view class="nav-bar-list">
        <view class="nav-ul">
          <view
            :class="{ 'bar-item': true, active: activeNav == nav }"
            v-for="(nav, index) in videoNav"
            :key="nav"
            :id="nav"
            :ref="'tabitem' + index"
            :data-id="index"
            :data-current="index"
            @tap="activeColNav(nav)"
          >
            {{ nav }}
          </view>
        </view>
      </view>
    </scroll-view>

    <scroll-view style="margin: 14rpx 0" id="nav-list" :scroll="false" :scroll-x="true" :show-scrollbar="false" @touchmove.stop>
      <view class="nav-bar-list">
        <view class="nav-ul" style="gap: 22rpx; height: auto">
          <view
            :class="{ 'nav-item': true, activeItem: activeItem == item }"
            v-for="(item, index) in navList[activeNav]"
            :key="item"
            :id="item"
            :ref="'tabitem' + index"
            :data-id="index"
            :data-current="index"
            @tap="activeNavItem(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="type-list">
      <view :class="{ 'type-item': true, activeType: activeType === 1 }" @tap="activeVideoType(1)">热门视频</view>
      <view :class="{ 'type-item': true, activeType: activeType === 2 }" @tap="activeVideoType(2)">最近更新</view>
    </view>
    <!-- 视频列表 -->
    <view class="list" v-for="(item, index) in videoList" :key="item.id" style="margin-bottom: 36rpx">
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
import { list } from '@/api/video.js'
import { getUserInfo } from '@/api/system.js'

export default {
  data() {
    const that = this
    return {
      activeNav: '',
      videoNav: ['保险', '法律', '房产置业', '移民', '财税', '工作创业', '生活'],
      activeItem: '全部',
      navList: {
        保险: ['全部', '金融理财', '人寿保险', '医疗保险', '汽车保险', '房屋保险', '旅游保险'],
        法律: ['全部', '刑事', '家庭', '交通', '意外伤害', '商业', '知识产权', '房地产'],
        房产置业: ['全部', '住宅', '商业', '工业', '土地', '其他'],
        移民: ['全部', '婚姻', '亲属', '职业', '家暴', '非移民签证', '其他'],
        财税: ['全部', '贷款', '个人财税', '公司财税', '财产信托规划'],
        工作创业: ['全部', '创业', '工作', '公司服务', '生意买卖'],
        生活: ['全部', '理财', '交通', '安全', '医疗', '交通']
      },
      activeType: 1,
      videoList: [],
      page: 1,
      pageSize: 20,
      totle: 0
    }
  },
  async onLoad() {
    const { result } = await getUserInfo()
    if (result.industry) {
      const index = this.videoNav.findIndex((item) => item === result.industry)
      this.videoNav.splice(index, 1)
      this.videoNav.unshift(result.industry)
      this.activeNav = result.industry
    }
  },
  onShow() {
    this.init()
  },
  onPullDownRefresh() {
    console.log('1111111')
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
      this.activeType = 1

      this.videoList = []
      this.getVideos()
    },
    // 选中导航栏项
    activeNavItem(item) {
      this.activeItem = item
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
        console.log('🚀 ~ getVideos ~ result:', res.result)

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
