<template>
  <view class="video-list" :class="{ 'checkbox-bar': showCheckbox }">
    <u-list height="100%" @scrolltolower="scrolltolower" v-if="list && list.length">
      <u-checkbox-group :value="checkedList" placement="column" @change="checboxChange">
        <u-list-item v-for="(item, index) in list" :key="item.id">
          <view class="list-item" @tap="onPlayer(item)">
            <view class="item-left">
              <u-checkbox v-if="showCheckbox" :name="item.id" :customStyle="{ marginRight: '58rpx' }" shape="circle" size="28rpx" activeColor="#DB9204" />
              <view class="item-img">
                <u-image :src="getVideoImg(item)" loadingIcon="photo-fill" width="200rpx" height="128rpx" radius="14rpx" />
                <view class="date">{{ item.uploadDate | timeFormat }}</view>
              </view>

              <view class="item-content" :class="{ checkbox: showCheckbox }">
                <view class="title">{{ item.title }}</view>
                <view>{{ item.viewCount || 0 }} 次播放</view>
                <view>{{ item.forwardCount || 0 }} 次转发</view>
              </view>
            </view>
            <!-- #ifdef APP-PLUS -->
            <view v-if="showShare" class="item-right" @tap.stop="shareVideo(item)">
              <image class="u-img" src="@/static/images/share-box-fill.png"></image>
            </view>
            <!-- #endif -->
          </view>
        </u-list-item>
      </u-checkbox-group>
    </u-list>
    <view class="emity-data" v-if="!(list && list.length) && showEmity">
      <u-image src="@/static/svg/rss-fill.svg" width="180rpx" height="180rpx" />
      <view>{{ emity }}</view>
    </view>
    <view v-if="showCheckbox" class="checkbox-bar">
      <view class="bar-left">
        <u-checkbox-group :value="allChecked" @change="checkAll">
          <u-checkbox label="全选" name="all" labelSize="24rpx" labelColor="#979797" shape="circle" size="28rpx" activeColor="#DB9204" />
        </u-checkbox-group>
        <!-- <view> 全选 </view> -->
      </view>
      <view class="bar-right" :class="{ active: checkedList.length }" @click="closeCollect">{{ closeBtnName }}</view>
    </view>
    <!-- 分享提示 -->
    <shareVipMesModal ref="vipMsg" />
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </view>
</template>
<script>
import shareVipMesModal from '@/pages/components/shareVipMesModal.vue'

export default {
  props: {
    videoId: {
      type: String,
      default: 'id'
    },
    list: {
      type: Array,
      default: []
    },
    showShare: {
      type: Boolean,
      default: true
    },
    showEmity: {
      type: Boolean,
      default: true
    },
    emity: {
      type: String,
      default: '暂无搜索结果'
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    closeBtnName: {
      type: String,
      default: '删除'
    }
  },
  data() {
    return {
      allChecked: [],
      checkedList: []
    }
  },
  computed: {
    isVip() {
      return this.$store.state.userInfo.isVip
    }
  },
  methods: {
    // 获取视频封面
    getVideoImg(item) {
      const video = item.videoInfo || item

      if (video.videoImg && video.videoImg.length) {
        return video.videoImg[0].url
      }
      return ''
    },
    // 触底加载
    scrolltolower() {},
    // 播放
    onPlayer(item) {
      const { videoId } = this
      const video = item.videoInfo || item
      uni.setStorageSync('video', video)
      //#ifdef H5
      uni.navigateTo({ url: `/pages/video/player?id=${video[videoId]}` })
      //#endif
      //#ifdef APP-PLUS
      uni.navigateTo({ url: `/pages/video/nplayer?id=${video[videoId]}` })
      //#endif
    },
    // 分享
    shareVideo(item) {
      const { isVip, videoId } = this

      const video = item.videoInfo || item
      if (video.videoPermission === 2 && !isVip) {
        this.$refs.vipMsg.show()
      } else {
        const { userId } = this.$store.state.userInfo
        uni.shareWithSystem({
          href: `http://123.6.102.119:8053/#/pages/video/player?id=${video[videoId]}&uId=${userId}`
        })
      }
    },
    checboxChange(v) {
      const { list } = this
      this.checkedList = v
      let checkAllCheckbox = true
      list.forEach((i) => {
        if (!this.checkedList.includes(i.id)) checkAllCheckbox = false
      })
      if (checkAllCheckbox) {
        this.allChecked = ['all']
      } else {
        this.allChecked = []
      }
    },
    // 全选
    checkAll(status) {
      const { list, checkedList } = this
      this.allChecked = status
      if (status.length) {
        list.forEach((i) => {
          if (!checkedList.includes(i.id)) this.checkedList.push(i.id)
        })
      } else {
        this.checkedList = []
      }
    },
    refresh() {
      this.checkedList = []
      this.allChecked = []
    },
    // 取消收藏
    closeCollect() {
      const { checkedList } = this
      this.$emit('closeEdit', checkedList, () => {
        this.checkedList = []
        this.allChecked = []
      })
    }
  },
  components: { shareVipMesModal }
}
</script>
<style lang="scss" scoped>
.video-list {
  width: 100%;
  height: 100%;
  &.checkbox-bar {
    padding-bottom: 108rpx;
  }
  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 18rpx;
    margin-bottom: 36rpx;
    .item-left {
      width: 100%;
      max-width: 100%;
      // #ifdef APP-PLUS
      width: calc(100% - 54rpx);
      max-width: calc(100% - 54rpx);
      // #endif
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
        &.checkbox {
          width: calc(100% - 318rpx);
        }
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
  .checkbox-bar {
    width: 100%;
    height: 108rpx;
    position: fixed;
    bottom: 0rpx;
    left: 0rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    .bar-left {
      display: flex;
      align-items: center;
      color: #979797;
      font-size: 24rpx;
    }
    .bar-right {
      width: 108rpx;
      height: 40rpx;
      border-radius: 10rpx;
      border: 2rpx solid #979797;
      color: #9e9e9e;
      font-size: 20rpx;
      text-align: center;
      line-height: 38rpx;
      &.active {
        color: #db9204;
        border: 2rpx solid #db9204;
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
    color: #9e9e9e;
    font-size: 24rpx;
    .emity-icon {
      width: 140rpx;
      height: 140rpx;
      margin-bottom: 40rpx;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
