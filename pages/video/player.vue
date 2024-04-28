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
      @tap.stop="checkVideoPlay"
      @play="onPlay"
      @pause="onPause"
      @error="videoErrorCallback"
      @timeupdate="onTimeupdate"
    ></video>

    <!-- 播放header -->
    <view class="nav-header"></view>
    <view class="video-header">
      <u-image v-if="isToken" class="left-icon" src="@/static/svg/arrow-left-s-fill.svg" width="48rpx" height="48rpx" @tap="goBack" />
      <view v-if="isToken" class="search-input" @tap.stop="toSearch">
        <u-icon name="search" size="48rpx" color="#929292"></u-icon>
        <text class="search-placeholder"> 搜索你想看的视频 </text>
      </view>
      <!-- <u-input v-model="searchVal" placeholder="搜索你想看的视频" placeholderStyle="color: #fff;" @change="searchVideo">
        <img class="search" slot="prefix" src="@/static/svg/find-replace-fill.svg" />
      </u-input> -->
      <!-- <img class="right-icon" src="@/static/svg/more-2-fill.svg" /> -->
    </view>
    <!-- 播放按钮 -->
    <view v-show="showPlayBtn && videoSrc" class="video-play-btn" @tap.stop="checkVideoPlay">
      <u-icon name="play-right-fill" color="rgba(220, 223, 230, 0.56)" size="180rpx"></u-icon>
    </view>
    <!-- 视频信息 -->
    <view class="video-info">
      <view class="video-title">{{ videoDetail.title }}</view>
      <view class="video-desc" v-show="videoDetail.labelList.length">
        <view class="desc" :class="{ unfold: descUnfold }">
          <text style="margin-right: 16rpx" v-for="i in labelList" :key="i" @click="toSearch(i)">{{ i }}</text>
        </view>
        <view class="descBtn" @tap="descUnfold = !descUnfold">{{ descUnfold ? '收起' : '展开' }}</view>
      </view>
    </view>
    <!-- 工作栏 -->
    <view class="video-tools" v-if="isToken">
      <view class="video-icon">
        <u-image src="@/static/images/play-list-2-fill.png" width="60rpx" height="60rpx" />
        <view class="num">{{ videoDetail.viewCount || 0 }}</view>
      </view>
      <view class="video-icon">
        <u-icon name="heart-fill" size="60rpx" :color="videoDetail.isCollection ? '#F52929' : '#D8D8D8'" @tap="videoUpdate(2)" />
        <view class="num">{{ videoDetail.collectCount || 0 }}</view>
      </view>
      <view class="video-icon">
        <u-image src="@/static/images/share-forward-fill.png" width="60rpx" height="60rpx" @tap="shareVideo" />
        <view class="num">{{ videoDetail.forwardCount || 0 }}</view>
      </view>
    </view>
    <!-- vip提示 -->
    <shareVipMesModal ref="vipMsgRef"></shareVipMesModal>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>

<script>
import playerMixin from './player.mixin'

export default {
  mixins: [playerMixin],
  methods: {
    // 视频初始化
    videoInit() {
      this.$nextTick(() => {
        const buffered = document.getElementsByClassName('uni-video-progress-buffered')
        buffered[0].style['background-color'] = 'rgba(255, 255, 255, 0.4)'
      })
    },
    // 播放进度
    onTimeupdate(video) {
      const buffered = document.getElementsByClassName('uni-video-progress-buffered')
      const { currentTime, duration } = video.detail
      this.currentTime = currentTime
      const width = (currentTime / duration) * 100 + '%'
      buffered[0].style.width = width
      buffered[0].style['background-color'] = '#fff'
    },
    showMessage(msg, type) {
      this.$refs.uNotify.show({
        top: '0',
        type: type,
        message: msg,
        safeAreaInsetTop: true
      })
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
      margin-right: 24rpx;
    }
    .right-icon {
      width: 48rpx;
      height: 48rpx;
      margin-left: 24rpx;
    }
    .search-input {
      flex: 1;
      height: 80rpx;
      border-radius: 12rpx;
      background: rgba(216, 216, 216, 0.5);
      display: flex;
      align-items: center;
      padding: 16rpx 24rpx;
    }
    .search-placeholder {
      color: #929292;
      font-size: 26rpx;
      margin-left: 10rpx;
    }
  }

  .video-play-btn {
    position: fixed;
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
      word-wrap: break-word;
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
      color: rgba(255, 255, 255, 0.6);
      .num {
        color: #fff;
        font-size: 28rpx;
        font-weight: 600;
      }
    }
  }
}
</style>
