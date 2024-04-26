import { detail, update } from '@/api/video.js'

module.exports = {
  data() {
    return {
      id: '',
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
      progressWidth: 0
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
  async onLoad({ id }) {
    const systeminfo = uni.getSystemInfoSync()
    this.windowHeight = systeminfo.windowHeight
    this.windowWidth = systeminfo.windowWidth
    this.id = id
    this.videoInit()
    uni.showLoading()
    // 获取视频地址
    const video = uni.getStorageSync('video')
    if (!video) {
      this.videoDetail = video
      this.videoSrc = video.videoFile[0].url
      this.videoLoad = 2
    } else if (this.id) {
      await this.getDetail()
    }

    //#ifdef APP-PLUS
    this.$nextTick(() => {
      this.videoPlay()
    })
    //#endif
    uni.hideLoading()
  },
  methods: {
    // 获取详情
    async getDetail() {
      this.videoLoad = 1
      const { result } = await detail(this.id)
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
    // 播放视频
    // 记录播放量
    async videoPlay() {
      this.$refs.videoRef.play()
      if (this.isToken) await this.videoUpdate(1)
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
    // 数据记录
    async videoUpdate(type) {
      const { id, title } = this.videoDetail

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
          uni.shareWithSystem({
            summary: title,
            href: `http://123.6.102.119:8053/#/pages/video/player?id=${id}`,
            success: () => {
              this.videoDetail.forwardCount = result
            }
          })
          break
      }
    },
    searchVideo() {}
  }
}
