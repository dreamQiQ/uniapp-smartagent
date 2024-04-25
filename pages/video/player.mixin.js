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
			videoLoad: false,
			windowWidth: 0,
			windowHeight: 0,
			progressWidth: 0,
		}
	},
	onLoad({
		id
	}) {
		const systeminfo = uni.getSystemInfoSync()
		this.windowHeight = systeminfo.windowHeight
		this.windowWidth = systeminfo.windowWidth
		this.id = id
		this.videoInit()
	},
	async onShow() {
		uni.showLoading()
		// 获取视频地址
		const video = uni.getStorageSync('video')
		if (video) {
			this.videoDetail = video
			this.videoSrc = video.video_file[0].url
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
			this.videoLoad = true
			const params = {
				where: `(Id,eq,${this.id})`
			}
			const video = await detail(params)
			this.videoDetail = video
			const videoFile = JSON.parse(video.video_file)
			this.videoSrc = videoFile[0].url
			this.videoLoad = false
		},
		// 返回
		goBack() {
			uni.switchTab({
				url: '/pages/video/list',
			})
		},
		// 播放视频
		// 记录播放量
		async videoPlay() {
			this.$refs.videoRef.play()
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
			if (!this.videoLoad) {
				uni.showToast({
					icon: 'error',
					title: '视频加载失败',
				})
			}
		},
		// 播放进度
		onTimeupdate(video) {
			const {
				currentTime,
				duration
			} = video.detail
			this.currentTime = currentTime
			this.progressWidth = (currentTime / duration) * this.windowWidth
		},
		// 数据记录
		async videoUpdate(type) {
			const typeMap = {
				play: 'view_count', // 播放量
				collect: 'collect_count', // 收藏量
				forward: 'forward_count', // 分享量
			}

			const {
				Id,
				view_count
			} = this.videoDetail
			const count = this.videoDetail[typeMap[type]] || 0
			await update(Id, {
				[typeMap[type]]: Number(count) + 1
			})
			this.videoDetail[typeMap[type]] = Number(count) + 1
		},
		searchVideo() {},
	},
}