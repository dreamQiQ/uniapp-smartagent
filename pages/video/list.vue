<template>
  <div>
    <u-list @scrolltolower="scrolltolower">
      <u-list-item v-for="(item, index) in datas" :key="index">
        <div class="video-item" @click="player(item)">
          <u--image :showLoading="true" :src="getVideoImg(item)" width="100px" height="100px" radius="10px"></u--image>
          <div class="video-item_content">
            <div class="title">{{ item.Title }}</div>
            <div class="count">
              <div class="count-item">
                <u-icon name="eye" size="20"></u-icon>
                {{ item.view_count || 0 }}播放
              </div>
              <div class="count-item">
                <u-icon name="share-square" size="20"></u-icon>
                {{ item.forward_count || 0 }}转发
              </div>
            </div>
            <!-- <div class="time">{{ item.CreatedAt | timeFormat }}</div> -->
          </div>
          <view @click.stop="toShare(item)">
            <u-icon name="share-square" size="40"></u-icon>
          </view>
        </div>
      </u-list-item>
    </u-list>
    <div class="btn-upload">
      <u-button type="primary" text="上传" @click="upload"></u-button>
    </div>
  </div>
</template>

<script>
import { list } from '@/api/video.js'

export default {
  data() {
    return {
      datas: [],
    }
  },
  async mounted() {
    // this.getVideos()
  },
  onShow() {
    console.log('onshow')
    this.getVideos()
  },
  onPullDownRefresh() {
    this.getVideos()
  },
  methods: {
    async getVideos() {
      console.log('111')
      const result = await list()
      this.datas = result.list
      uni.stopPullDownRefresh()
    },

    getVideoImg(item) {
      if (item.video_img && item.video_img.length) {
        return item.video_img[0].url
      }
      return ''
    },
    scrolltolower() {},
    upload() {
      uni.navigateTo({
        url: '/pages/video/upload',
      })
    },
    player(item) {
      uni.setStorageSync('video', item)
      uni.navigateTo({
        url: '/pages/video/player',
      })
    },
    toShare(item) {
      console.log(item)
      /** 
			 * 
uni.shareWithSystem({
        summary: item.Title,
        href: 'https://baidu.com',
      })
			*/
      plus.share.sendWithSystem(
        {  href: 'https://www.dcloud.io/' },
        function () {
          console.log('分享成功')
        },
        function (e) {
          console.log('分享失败：' + JSON.stringify(e))
        },
      )
    },
  },
}
</script>

<style lang="scss">
.video-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px $uni-border-color solid;
}
.video-item_content {
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .title {
    font-size: 16px;
  }
  .count {
    display: flex;
    flex-direction: column;
    gap: 2px;
    .count-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100px;
    }
  }
  .time {
    font-size: 14px;
  }
}

.btn-upload {
  position: fixed;
  bottom: 50px;
  right: 20px;
  width: 50px;
}
</style>
