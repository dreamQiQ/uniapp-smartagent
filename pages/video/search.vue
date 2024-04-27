<template>
  <view class="search">
    <view class="nav-header"></view>
    <view class="search-header">
      <u-icon name="arrow-left" color="#9E9E9E" size="38rpx" @tap="toBack"></u-icon>
      <u-search
        v-model="search"
        :placeholder="placeholder"
        @search="onSearch"
        @custom="onSearch"
        shape="square"
        bgColor="#F3F3F3"
        :actionStyle="{ color: '#DB9204', fontSize: '28rpx', fontWeight: 'bold', marginLeft: '30rpx' }"
      ></u-search>
    </view>
    <view v-show="!showList">
      <view class="search-history" v-if="searchHistory.length">
        <view class="history-title">
          <view> 历史记录 </view>
          <u-icon name="trash-fill" color="#D8D8D8" size="48rpx" @tap="closeHistory"></u-icon>
        </view>
        <view class="history-list">
          <view class="item" v-for="(item, index) in searchHistory" :key="index" @tap="historySearch(item)">{{ item }}</view>
        </view>
      </view>
      <view class="search-history" v-if="hotSearch.length">
        <view class="history-title">
          <view> 热门搜索 </view>
        </view>
        <view class="history-list">
          <view class="item" v-for="(item, index) in hotSearch" :key="index" @tap="historySearch(item)">{{ item }}</view>
        </view>
      </view>
    </view>
    <view v-show="showList" class="search-video-list">
      <view class="list-header">
        <view :class="{ active: searchType === 0 }" @click="checkSearchType(0)"> 视频 </view>
        <!-- <view :class="{ active: searchType === 1 }" @click="checkSearchType(1)"> 推荐 </view> -->
      </view>

      <video-list class="list" :list="videoList" emity="暂无搜索结果，换个词试试吧" :showShare="false" :showEmity="showEmity"></video-list>
    </view>
  </view>
</template>
<script>
import { videoSearch } from '@/api/video.js'
import videoList from '@/pages/components/videoList.vue'

export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  data() {
    return {
      showEmity: true,
      search: '',
      searchHistory: [],
      hotSearch: [],
      videoList: [],
      searchType: 0,
      showList: false
    }
  },
  onShow() {
    this.searchHistory = uni.getStorageSync('search-history')
    if (!this.searchHistory) this.searchHistory = []
  },
  watch: {
    search() {
      if (!this.search) this.showList = Boolean(this.search)
    }
  },
  methods: {
    // 返回上一页
    toBack() {
      const { videoList } = this
      if (videoList.length) {
        this.search = ''
        this.videoList = []
        this.showList = false
      } else {
        uni.navigateBack({ data: 1 })
      }
    },
    // 历史记录
    historySearch(item) {
      this.search = item
      this.onSearch(item)
    },
    // 关闭历史记录
    closeHistory() {
      uni.setStorageSync('search-history', [])
      this.searchHistory = []
    },
    onSearch(val) {
      if (this.searchHistory.includes(val)) this.searchHistory.splice(this.searchHistory.indexOf(val), 1)
      this.searchHistory.unshift(val)
      uni.setStorageSync('search-history', this.searchHistory)
      this.getVideoList()
    },
    async getVideoList() {
      try {
        uni.showLoading()
        this.showList = true
        this.showEmity = false
        const { search, searchType } = this
        const params = {
          searchValue: search
        }
        const { result } = await videoSearch(params)
        this.videoList = result || []
        this.showEmity = true
        uni.hideLoading()
      } catch (error) {
        this.videoList = []
        this.showEmity = true
        uni.hideLoading()
      }
    },
    checkSearchType(type) {
      this.searchType = type
      this.getVideoList()
    }
  },
  components: { videoList }
}
</script>
<style lang="scss" scoped>
.search {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20rpx 40rpx;
  background-color: #fff;
  .search-header {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 48rpx;
    .u-icon {
      font-weight: bold;
      margin-right: 40rpx;
    }
    .u-search /deep/ .u-search__content {
      border-radius: 12rpx !important;
    }
  }
  .search-history {
    width: 100%;
    height: auto;
    margin-bottom: 36rpx;
    .history-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #9e9e9e;
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 30rpx;
    }
    .history-list {
      width: 100%;
      height: auto;
      max-height: 240rpx;
      overflow: hidden;
      display: flex;
      gap: 30rpx 20rpx;
      flex-wrap: wrap;
      align-items: center;
      .item {
        width: auto;
        height: auto;
        color: #db9204;
        font-size: 20rpx;
        font-weight: 400;
        padding: 12rpx 20rpx;
        border-radius: 12rpx;
        background: rgba(243, 213, 155, 0.27);
      }
    }
  }
  .search-video-list {
    width: 100%;
    height: calc(100% - 120rpx);
    .list-header {
      width: 100%;
      height: auto;
      color: #979797;
      font-size: 24rpx;
      margin-bottom: 45rpx;
      display: flex;
      gap: 24rpx;
      align-items: center;
      .active {
        color: #db9204;
        position: relative;
        &::before {
          content: '';
          width: 70%;
          height: 4rpx;
          position: absolute;
          bottom: -6rpx;
          left: 50%;
          margin-left: -35%;
          background-color: #db9204;
        }
      }
    }
    .list {
      height: calc(100% - 80rpx);
    }
  }
}
</style>
