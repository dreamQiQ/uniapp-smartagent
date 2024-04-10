import env from '@/common/utils/env.js'
class Request {
	constructor(baseUrl = "", header = {}) {
		this.baseUrl = baseUrl
		this.header = header
		uni.onNetworkStatusChange(function(res) {
			console.log("网络连接正常", res.isConnected)
			this.isConnected = res.isConnected
			console.log("网络状态", res)
		})
	}
	isDev = false
	isConnected = true

	instance(baseUrl = "", header = {}) {
		return new Request(baseUrl, header)
	}

	request = (url, method, data, header = null) => {
		uni.getNetworkType({
			success: function(res) {
				if (res.networkType == 'none') {
					this.isConnected = false;
				} else {
					this.isConnected = true;
				}
				if (!this.isConnected) {
					uni.showToast({
						title: "网络未连接",
						duration: 1000,
						icon: "none",
					})
					return null
				}
			}
		});
		// 向 header 写入 token
		const token = uni.getStorageSync("token")
		let tempHeader = {
			Authorization: "Bearer " + token,
			"Content-Type": "application/json",
		}
		if (data.contentType) {
			tempHeader = {
				Authorization: "Bearer " + token,
				"Content-Type": data.contentType
			}
		}
		if (header) {
			tempHeader = {
				...tempHeader,
				...header,
			}
		}
		if (this.header) {
			tempHeader = {
				...tempHeader,
				...this.header,
			}
		}
		// 根据配置来设置域名和端口号
		const host = uni.getStorageSync("host") || env.host
		const port = uni.getStorageSync("port") || env.port
		const protocl = uni.getStorageSync("ishttps") ? "https://" : "http://";

		this.baseUrl = protocl + host
		if (port) {
			this.baseUrl += ':' + port
		}
		console.log(this.baseUrl)

		if (data.url) {
			this.baseUrl = protocl + data.url
		}

		let requestUrl = url
		//#ifdef H5
		// requestUrl = this.baseUrl + url
		//#endif
		//#ifdef APP-PLUS
		requestUrl = this.baseUrl + url
		//#endif

		return new Promise((resolve, reject) => {
			uni.request({
				url: requestUrl,
				header: tempHeader,
				method: method,
				sslVerify: false,
				data: data,
				timeout: data.timeout ? data.timeout : 10000,
				success: function(response) {
					if (response.statusCode === 200) {
						if (response.data.code === 200 || response.data.code == undefined) {
							resolve(response.data)
						} else if (response.data.code === 501 || response.data.code === 999) {
							uni.hideLoading()
							// 跳转到登录页面
							uni.reLaunch({
								url: "/pages/login/index",
								success(res) {
									//存在则关闭启动页进入首页
									plus.navigator.closeSplashscreen();
								},
								fail(res) {
									console.log(res)
								},
							})

						} else {
							uni.hideLoading()
							setTimeout(() => {
								// uni.showToast({
								// 	title: response.data.message,
								// 	icon: "none",
								// })
							}, 500)
							// 处理业务
							reject(response.data)
						}
					}
					// else if (response.statusCode === 400) {
					//                   uni.hideLoading()
					//                   // 跳转到登录页面
					//                   uni.reLaunch({
					//                       url: "/pages/login/index",
					//                   })
					//               }
					else {
						uni.hideLoading();
						setTimeout(() => {
							// uni.showToast({
							// 	title: response.data.message,
							// 	icon: "none",
							// });
						}, 500)
						reject(response.data)
					}
				},
				fail: function(err) {
					console.log(err)
					uni.hideLoading()
					setTimeout(() => {
						// uni.showToast({
						// 	title: err.errMsg,
						// 	icon: "none",
						// })
					}, 500)
					reject(err)
				},
				complete: function() {},
			})
		})
	}

	requestUpload = (url, name, file, data, header = null) => {
		if (!this.isConnected) {
			uni.showToast({
				title: "网络未连接",
				duration: 1000,
				icon: "none",
			})
			return null
		}
		// 向cookie写入token
		const token = uni.getStorageSync("token")
		let tempHeader = {
			Authorization: "Bearer " + token,
		}
		if (header) {
			tempHeader = {
				...tempHeader,
				...header,
			}
		}
		if (this.header) {
			tempHeader = {
				...tempHeader,
				...this.header,
			}
		}

		return new Promise((resolve, reject) => {
			console.log(this.baseUrl + url)
			console.log(file)
			uni.uploadFile({
				url: this.baseUrl + url,
				header: tempHeader,
				filePath: file,
				name: name,
				formData: data,
				success: function(response) {
					console.log('uploadFileResponse', response)
					let data = JSON.parse(response.data);
					if (response.statusCode === 200) {
						if (data.error === 0 || data.error === undefined) {
							resolve(data)
						} else {
							if (data.error === 401) {
								// 跳转到登录页面
								replaceToPage("/pages/bindPhone/index")
							}
							uni.showToast({
								title: data.message,
								icon: "none",
							})
							// 处理业务
							reject(data)
						}
					} else {
						uni.showToast({
							title: data.message,
							icon: "none",
						})
					}
				},
				fail: function(err) {
					console.log(err)
				},
				complete: function() {},
			})
		})
	}

	get = (url, data = {}, header) => {
		return this.request(url, "GET", data, header)
	}

	post = (url, data, header) => {
		return this.request(url, "POST", data, header)
	}

	put = (url, data, header) => {
		return this.request(url, "PUT", data, header)
	}

	patch = (url, data, header) => {
		const _params = {
			...data,
			_method: "PATCH",
		}
		return this.request(url, "PATCH", _params, header)
	}
}

const instance = new Request("") //测试
const get = instance.get
const post = instance.post
const put = instance.put
const patch = instance.patch
const requestUpload = instance.requestUpload

export default instance
export {
	get,
	post,
	put,
	patch,
	requestUpload
}