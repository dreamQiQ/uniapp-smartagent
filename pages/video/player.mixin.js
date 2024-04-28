import { detail, update } from '@/api/video.js'
import shareVipMesModal from '@/pages/components/shareVipMesModal.vue'
import searchInput from '@/pages/components/searchInput.vue'

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
      isPlay: false,
      showModal: false
    }
  },
  computed: {
    isVip() {
      return this.$store.state.userInfo.isVip
    },
    isToken() {
      return uni.getStorageSync('token')
    },
    labelList() {
      const { descUnfold } = this
      const { labelList } = this.videoDetail
      let data = []
      //#ifdef H5
      data = labelList.map((i) => `#${i.labelName}`)
      //#endif
      //#ifdef APP-PLUS
      if (descUnfold) {
        data = labelList.map((i) => `#${i.labelName}`)
      } else {
        const text = labelList
          .map((i) => `#${i.labelName}`)
          .join('')
          .slice(0, 16)
        data = text
          .split('#')
          .filter((i) => i)
          .map((i) => `#${i}`)
        data[data.length - 1] += '...'
      }
      //#endif
      return data
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
      if (!video?.videoFile.length) return false
      this.videoSrc = video?.videoFile && video.videoFile[0].url
      this.videoLoad = 2
    } else if (this.id) {
      await this.getDetail()
    }

    console.log('🚀 ~ onLoad ~ this.videoDetail:', this.videoDetail)

    //#ifdef APP-PLUS
    this.$nextTick(() => {
      this.checkVideoPlay()
    })
    //#endif
    uni.hideLoading()
  },
  onShow() {
    this.showModal = false
    this.$nextTick(() => {
      this.$refs.vipMsgRef.close()
    })
  },
  onHide() {
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
      uni.navigateBack({ data: 1 })
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
        this.showMessage('视频加载失败', 'error')
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
      const { id, videoPermission } = this.videoDetail
      const { userId, isVip } = this.$store.state.userInfo
      //#ifdef H5
      if (videoPermission === 2 && !isVip) {
        this.$refs.vipMsgRef.show()
      } else {
        this.videoUpdate(3)
      }
      //#endif
      //#ifdef APP-PLUS
      if (videoPermission === 2 && !isVip) {
        this.showModal = true
        setInterval(() => {
          this.showModal = false
        }, 3000)
      } else {
        uni.shareWithSystem({
          href: `http://123.6.102.119:8053/#/pages/video/player?id=${id}&uId=${userId}`,
          success: () => {
            this.videoUpdate(3)
          },
          fail: (err) => {
            this.showMessage('分享失败', 'error')
          }
        })
      }
      //#endif
    },
    // 数据记录
    async videoUpdate(type) {
      try {
        const { userId, isVip } = this.$store.state.userInfo
        const { id, videoPermission } = this.videoDetail
        console.log('🚀 ~ videoUpdate ~ videoPermission:', videoPermission, isVip)
        let params = {
          id: id,
          type
        }
        //#ifdef H5
        params.platform = 'h5'
        this.$refs.vipMsgRef.show()
        //#endif
        //#ifdef APP-PLUS
        params.platform = 'app'
        if (type === 2 && videoPermission === 2 && !isVip) {
          debugger
          this.showModal = true
          setInterval(() => {
            this.showModal = false
          }, 3000)
          return false
        }
        //#endif
        if (type === 3) params.shareUserId = this.$store.state.userInfo.userId
        const { result } = await update(params)
        switch (type) {
          case 1:
            this.videoDetail.viewCount = result
            break
          case 2:
            this.videoDetail.collectCount = result
            this.videoDetail.isCollection = !this.videoDetail.isCollection
            if (this.videoDetail.isCollection) {
              this.showMessage('收藏成功', 'success')
            } else {
              this.showMessage('已取消收藏', 'success')
            }
            break
          case 3:
            this.videoDetail.forwardCount = result
            break
        }
      } catch (error) {
        this.showMessage(error.message, 'error')
      }
    },
    toSearch(v) {
      let data = v
      v = v.replace('...', '')
      v = v.replace('#', '')
      const tag = this.videoDetail.labelList.find((i) => i.labelName.includes(v))
      if (tag) data = `#${tag.labelName}`

      console.log('🚀 ~ toSearch ~ data:', data)
      const token = uni.getStorageSync('token')
      if (token) {
        uni.navigateTo({ url: `/pages/video/search?val=${data}` })
      }
    },
    toVipPage() {
      uni.navigateTo({ url: '/pages/me/vip' })
    },
    searchVideo() {}
  },
  components: { shareVipMesModal, searchInput }
}
