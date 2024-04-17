<template>
  <view class="video-play">
    <video
      ref="videoRef"
      class="player"
      :id="videoId"
      :src="videoSrc"
      :loop="true"
      :controls="true"
      :show-center-play-btn="false"
      @click.stop="videoPause"
      @play="onPlay"
      @pause="onPause"
      @error="videoErrorCallback"
      @timeupdate="onTimeupdate"
    ></video>
    <!-- 播放header -->
    <view class="video-header">
      <img class="left-icon" src="@/static/svg/arrow-left-s-fill.svg" @click="goBack" />
      <u-input v-model="searchVal" placeholder="搜索你想看的视频" placeholderStyle="color: #979797;" @change="searchVideo">
        <img class="search" slot="prefix" src="@/static/svg/find-replace-fill.svg" />
      </u-input>
      <img class="right-icon" src="@/static/svg/more-2-fill.svg" />
    </view>
    <!-- 播放按钮 -->
    <view v-show="showPlayBtn" class="video-play-btn" @click.stop="videoPlay">
      <u-icon name="play-right-fill" color="rgba(220, 223, 230, 0.56)" size="180rpx"></u-icon>
    </view>
    <!-- 视频信息 -->
    <view class="video-info">
      <view class="video-title">{{ videoDetail.Title }}</view>
      <view class="video-desc" v-show="videoDetail.desc">
        <view class="desc" :class="{ unfold: descUnfold }">{{ videoDetail.desc }}</view>
        <view class="descBtn" @click="descUnfold = !descUnfold">{{ descUnfold ? '收起' : '展开' }}</view>
      </view>
    </view>
    <!-- 工作栏 -->
    <view class="video-tools">
      <view class="video-icon">
        <img class="left-icon" src="@/static/svg/play-list-2-fill.svg" />
        <view class="num">{{ videoDetail.view_count || 0 }}</view>
      </view>
      <view class="video-icon">
        <u-icon name="heart-fill" size="60rpx" color="#D8D8D8"></u-icon>
        <view class="num">{{ videoDetail.collect_count || 0 }}</view>
      </view>
      <view class="video-icon">
        <img class="left-icon" src="@/static/svg/share-forward-fill.svg" />
        <view class="num">{{ videoDetail.forward_count || 0 }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { detail, update } from '@/api/video.js'

export default {
  data() {
    return {
      id: '',
      videoId: String(new Date().getTime()),
      videoSrc: '',
      searchVal: '',
      showPlayBtn: true,
      videoDetail: {},
      currentTime: 0,
      lineStyle: { width: '0%' },
      descUnfold: false
    }
  },
  onShow() {
    // 获取视频地址
    const video = uni.getStorageSync('video')
    this.videoSrc = video.video_file[0].url
    this.videoDetail = video
  },
  methods: {
    // 返回
    goBack() {
      uni.switchTab({
        url: '/pages/video/list'
      })
    },
    // 播放视频
    async videoPlay() {
      this.$refs.videoRef.play()
      // 记录播放量
      await this.videoUpdate('play')
    },
    // 暂停视频
    videoPause() {
      this.$refs.videoRef.pause()
    },
    // 开始播放
    onPlay() {
      this.showPlayBtn = false
    },
    // 暂停播放
    onPause() {
      this.showPlayBtn = true
    },
    // 播放失败
    videoErrorCallback(error) {
      console.log('🚀 ~ videoErrorCallback ~ error:', error)
      uni.showToast({
        icon: 'error',
        title: '视频加载失败'
      })
    },
    // 播放进度
    onTimeupdate(video) {
      const buffered = document.getElementsByClassName('uni-video-progress-buffered')
      const { currentTime, duration } = video.detail
      this.currentTime = currentTime
      const width = (currentTime / duration) * 100 + '%'
      buffered[0].style.width = width
    },
    // 数据记录
    async videoUpdate(type) {
      const typeMap = {
        play: 'view_count', // 播放量
        collect: 'collect_count', // 收藏量
        forward: 'forward_count' // 分享量
      }

      const { Id, view_count } = this.videoDetail
      const count = this.videoDetail[typeMap[type]] || 0
      await update(Id, { [typeMap[type]]: Number(count) + 1 })
      this.videoDetail[typeMap[type]] = Number(count) + 1
    }
  }
}
</script>

<style lang="scss">
.video-play {
  width: 100%;
  height: calc(100% - 8rpx);
  position: relative;
  box-sizing: border-box;
  .player {
    width: 100%;
    height: 100%;
    color: #dcdfe6;
  }

  .video-header {
    width: 100%;
    height: 68rpx;
    padding: 0px 20rpx;
    box-sizing: border-box;
    position: absolute;
    top: 24rpx;
    left: 0;

    display: flex;
    align-items: center;
    .left-icon {
      width: 48rpx;
      height: 48rpx;
      margin-right: 24rpx;
    }
    .right-icon {
      width: 48rpx;
      height: 48rpx;
      margin-left: 24rpx;
    }
    .u-input {
      flex: 1;
      background: rgba(216, 216, 216, 0.5);
    }
    .search {
      opacity: 0.5;
    }
  }

  .video-play-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -90rpx;
    margin-top: -90rpx;
  }

  .progress {
    position: absolute;
    bottom: 80rpx;
    left: 0;
    width: 100%;
    height: 6rpx;
    cursor: pointer;
    background-color: rgba(204, 204, 204, 0.5);
    .line {
      height: 6rpx;
      background-color: #fff;
    }
    &:hover {
      height: 12rpx;
      .line {
        height: 12rpx;
      }
    }
  }

  .video-info {
    width: 85%;
    height: auto;
    position: absolute;
    bottom: 140rpx;
    color: #fff;
    padding: 0 20rpx;
    .video-title {
      width: 100%;
      max-width: 100%;
      font-size: 36rpx;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 12rpx;
    }
    .video-desc {
      width: 100%;
      display: flex;
      padding: 0 6rpx;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 24rpx;
      .desc {
        width: calc(100% - 78rpx);
        height: fit-content;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.unfold {
          white-space: wrap;
          word-wrap: break-word;
        }
      }
      .descBtn {
        width: 72rpx;
        min-width: 72rpx;
        margin-left: 6rpx;
      }
    }
  }

  .video-tools {
    width: 60rpx;
    height: 420rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 140rpx;
    right: 28rpx;
    .video-icon {
      width: 60rpx;
      height: auto;
      text-align: center;
      img {
        width: 60rpx;
        height: 60rpx;
      }
      .num {
        color: #fff;
        font-size: 28rpx;
        font-weight: 600;
      }
    }
  }
}
</style>
