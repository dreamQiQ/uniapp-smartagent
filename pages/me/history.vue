<template>
  <view class="history">
    <view class="nav-header"></view>
    <view class="history-header">
      <u-image src="@/static/images/wihte-to-back.png" width="24rpx" height="24rpx" @tap="goBack" />
      <view class="page-title">{{ pageTitle }}</view>
      <view class="header-tools">
        <u-icon name="search" size="44rpx" color="#979797" @tap="toSearch"></u-icon>
        <view class="btn" @click="setEdit"> {{ editStatus ? '完成' : '管理' }} </view>
      </view>
    </view>
    <view class="list-tab">
      <view :class="{ active: searchType === 0 }" @click="checkSearchType(0)"> 视频 </view>
      <!-- <view :class="{ active: searchType === 1 }" @click="checkSearchType(1)"> 推荐 </view> -->
    </view>
    <video-list ref="videoList" class="video-list" :list="videoList" :showCheckbox="editStatus" closeBtnName="删除记录" @closeEdit="closeEdit"></video-list>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>
<script>
import { videoRecord, deleteRecord } from 'api/me.js'
import videoList from '@/pages/components/videoList.vue'

export default {
  components: { videoList },
  data() {
    return {
      pageTitle: '',
      videoList: [],
      searchType: 0,
      editStatus: false
    }
  },
  onLoad(options) {
    this.pageTitle = options.name || ''
  },
  onShow() {
    this.getWatchRecord()
  },
  methods: {
    setEdit() {
      this.editStatus = !this.editStatus
      this.$refs.videoList.refresh()
    },
    // 返回
    goBack() {
      uni.navigateBack({ data: 1 })
    },
    toSearch() {
      uni.navigateTo({
        url: '/pages/video/search'
      })
    },
    checkSearchType(type) {
      this.searchType = type
      this.getWatchRecord()
    },
    async getWatchRecord() {
      const { result } = await videoRecord()
      this.videoList = result.map((i) => {
        return {
          ...i.videoInfo,
          id: i.id,
          platform: i.platform,
          playTime: i.playTime,
          videoId: i.videoInfo.id
        }
      })
    },
    // 取消操作
    async closeEdit(ids, callback) {
      try {
        uni.showLoading()
        const res = await deleteRecord({ ids: ids.join(',') })
        await this.getWatchRecord()
        callback()
        this.$refs.uNotify.show({
          top: 0,
          type: 'success',
          message: '删除成功',
          safeAreaInsetTop: true
        })
        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
        this.$refs.uNotify.show({
          top: 0,
          type: 'error',
          message: '删除失败',
          safeAreaInsetTop: true
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.history {
  width: 100%;
  height: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  .history-header {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40rpx;
    .page-title {
      color: #3d3d3d;
      font-size: 28rpx;
      font-weight: bold;
    }
    .header-tools {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .u-icon {
        position: relative;
        top: 4rpx;
      }
      .btn {
        color: #db9204;
        font-size: 28rpx;
        font-size: bold;
        margin-left: 16rpx;
        .operate {
          color: #979797;
        }
      }
    }
  }
  .list-tab {
    width: 100%;
    height: auto;
    color: #979797;
    font-size: 24rpx;
    margin-bottom: 50rpx;
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
  .video-list {
    width: 100%;
    height: calc(100% - 204rpx);
  }
}
</style>
