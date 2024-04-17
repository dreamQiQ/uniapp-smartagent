<template>
  <view class="video-list">
    <view class="nav-list-wrap">
      <view class="wrap-item" :class="{ active: activeNav === nav }" v-for="nav in videoNav" :key="nav" @click="activeColNav(nav)">{{ nav }}</view>
    </view>

    <view class="nav-list">
      <view class="nav-item" :class="{ activeItem: activeItem === item }" v-for="item in navList[activeNav]" :key="item" @click="activeNavItem(item)">{{ item }}</view>
    </view>
    <view class="type-list">
      <view :class="{ 'type-item': true, activeType: activeType === '热门视频' }" @click="activeVideoType('热门视频')">热门视频</view>
      <view :class="{ 'type-item': true, activeType: activeType === '最近更新' }" @click="activeVideoType('最近更新')">最近更新</view>
    </view>
    <!-- 视频列表 -->
    <u-list height="calc(100% - 216rpx)" @scrolltolower="scrolltolower" v-if="videoList && videoList.length">
      <u-list-item v-for="(item, index) in videoList" :key="item.Id" style="margin-bottom: 36rpx">
        <view class="list-item" @click="onPlayer(item)">
          <view class="item-left">
            <view class="item-img">
              <u-image :src="getVideoImg(item)" width="200rpx" height="128rpx" radius="14rpx" />
              <view class="date">{{ item.CreatedAt | timeFormat }}</view>
            </view>

            <view class="item-content">
              <view class="title">{{ item.Title }}</view>
              <view>{{ item.view_count || 0 }} 次播放</view>
              <view>{{ item.forward_count || 0 }} 次转发</view>
            </view>
          </view>
        </view>
      </u-list-item>
    </u-list>
    <view class="emity-data" v-if="!(videoList && videoList.length)">
      <view class="emity-icon"><img src="@/static/svg/rss-fill.svg" /></view>
      <view>暂无搜索结果</view>
    </view>
  </view>
</template>
<script>
import { list } from '@/api/video.js'

export default {
  data() {
    const that = this
    return {
      activeNav: '保险',
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
      activeType: '热门视频',
      videoList: [],
      page: 1,
      pageSize: 20,
      totle: 0
    }
  },
  onShow() {
    const videoMenu = uni.getStorageSync('videoMenu')
    this.activeNav = (videoMenu && videoMenu.level1) || this.videoNav[0]
    this.activeItem = (videoMenu && videoMenu.level2) || this.navList[this.videoNav][0]

    this.videoList = []
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

      this.videoList = []
      this.getVideos()
    },
    // 选中导航栏项
    activeNavItem(item) {
      this.activeItem = item
      this.activeType = '热门视频'

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
        const { page, pageSize, activeType, activeNav, activeItem } = this

        let where = `(primary_type,eq,${activeNav})`
        if (activeItem !== '全部') where += `~and(secondary_type,eq,${activeItem})`

        const params = {
          limit: pageSize,
          offset: (page - 1) * pageSize,
          where
        }
        const result = await list(params)
        this.videoList.push(...result.list)
        this.totle = result.pageInfo.totalRows
        // 缓存视频
        this.storageVideoList(this.videoList)
        // 缓存菜单数据
        const menuVal = { level1: activeNav, level2: activeItem }
        uni.setStorageSync('videoMenu', menuVal)

        uni.stopPullDownRefresh()
        uni.hideLoading()
      } catch (error) {
        this.videoList = []
        uni.hideLoading()
      }
    },
    storageVideoList(list) {
      console.log('🚀 ~ storageVideoList ~ list:', list)
      const videoUrlList = list.map((i) => i.video_file[0].url).filter((i) => i)
      console.log('🚀 ~ storageVideoList ~ videoUrlList:', videoUrlList)
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
      uni.navigateTo({ url: `/pages/video/player` })
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
  .nav-list-wrap {
    width: 100%;
    height: 80rpx;
    display: flex;
    gap: 46rpx;
    overflow: auto;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .wrap-item {
      height: 84%;
      color: #666;
      font-size: 32rpx;
      white-space: nowrap;
      display: flex;
      align-items: flex-end;
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
          // margin-right: -44rpx;
        }
      }
    }
  }

  .nav-list {
    width: 100%;
    height: auto;
    margin: 30rpx 0 14rpx;
    display: flex;
    align-items: center;
    gap: 22rpx;
    overflow: auto;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
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
