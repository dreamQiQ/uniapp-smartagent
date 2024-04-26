import { detail, update } from '@/api/video.js'

module.exports = {
  data() {
    return {
      id: '',
      uId: '',
      videoId: String(new Date().getTime()),
      videoSrc: '',
      searchVal: '',
      showPlayBtn: true,
      videoDetail: {},
      currentTime: 0,
      lineStyle: {
        width: '0%'
      },
      descUnfold: false,
      videoLoad: 0,
      windowWidth: 0,
      windowHeight: 0,
      progressWidth: 0,
      isPlay: false
    }
  },
  computed: {
    isVip() {
      return this.$store.state.userInfo.isVip
    },
    isToken() {
      return uni.getStorageSync('token')
    }
  },
  async onLoad({ id, uId }) {
    const systeminfo = uni.getSystemInfoSync()
    this.windowHeight = systeminfo.windowHeight
    this.windowWidth = systeminfo.windowWidth
    this.id = id
    this.uId = uId
    this.videoInit()
    uni.showLoading()
    // 获取视频地址
    const video = uni.getStorageSync('video')
    if (video) {
      this.videoDetail = video
      this.videoSrc = video.videoFile[0].url
      this.videoLoad = 2
    } else if (this.id) {
      await this.getDetail()
    }

    //#ifdef APP-PLUS
    this.$nextTick(() => {
      this.checkVideoPlay()
    })
    //#endif
    uni.hideLoading()
  },
  methods: {
    // 获取详情
    async getDetail() {
      this.videoLoad = 1
      const { result } = await detail(this.id, { uId: this.uId })
      this.videoDetail = result
      this.videoSrc = result.videoFile[0].url
      this.videoLoad = 2
    },
    // 返回
    goBack() {
      uni.switchTab({
        url: '/pages/video/list'
      })
    },
    // 视频播放暂停
    async checkVideoPlay() {
      const { isPlay } = this
      if (isPlay) {
        this.$refs.videoRef.pause()
      } else {
        this.$refs.videoRef.play()
        if (this.isToken) await this.videoUpdate(1)
      }
      this.isPlay = !isPlay
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
      if (!this.videoLoad) {
        uni.showToast({
          icon: 'error',
          title: '视频加载失败'
        })
      }
    },
    // 播放进度
    onTimeupdate(video) {
      const { currentTime, duration } = video.detail
      this.currentTime = currentTime
      this.progressWidth = (currentTime / duration) * this.windowWidth
    },
    // 分享视频
    shareVideo() {
      const { id, title } = this.videoDetail
      const { userId } = this.$store.state.userInfo
      //#ifdef H5
      this.videoUpdate(3)
      //#endif
      //#ifdef APP-PLUS
      uni.shareWithSystem({
        href: `http://123.6.102.119:8053/#/pages/video/player?id=${id}&uId=${userId}`,
        success: () => {
          this.videoUpdate(3)
        },
        fail: (err) => {
          console.log('🚀 ~ shareVideo ~ err:', err)
          uni.showToast({
            icon: 'error',
            title: '分享失败'
          })
        }
      })
      //#endif
    },
    // 数据记录
    async videoUpdate(type) {
      const { id } = this.videoDetail

      const params = {
        id: id,
        type
      }
      const { result } = await update(params)
      switch (type) {
        case 1:
          this.videoDetail.viewCount = result
          break
        case 2:
          this.videoDetail.collectCount = result
          this.videoDetail.isCollection = !this.videoDetail.isCollection
          break
        case 3:
          this.videoDetail.forwardCount = result
          break
      }
    },
    searchVideo() {}
  }
}
