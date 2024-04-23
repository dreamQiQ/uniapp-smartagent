<template>
  <view class="form">
    <u--input class="mb-16" placeholder="视频名称" border="surround" v-model="name"></u--input>
    <u--input class="mb-16" placeholder="视频描述" border="surround" v-model="description"></u--input>
    <u-upload class="mb-16" :fileList="fileList" @afterRead="afterRead" @delete="deletePic" maxCount="1" accept="video"></u-upload>
    <u-button type="primary" text="创建视频" @tap="createVideo"></u-button>
  </view>
</template>

<script>
import { upload, add } from '@/api/video.js'

export default {
  data() {
    return {
      name: '',
      description: '',
      fileList: [],
    }
  },
  async mounted() {},
  methods: {
    scrolltolower() {},
    async afterRead(event) {
      this.fileList.push(event.file)
    },
    deletePic(event) {
      this.fileList.splice(event.index, 1)
    },
    async createVideo() {
      let errMsg = ''
      if (this.fileList.length == 0) {
        errMsg = '请先选择视频'
      }
      if (!this.name) {
        errMsg = '请填写视频标题'
      }
      if (!this.description) {
        errMsg = '请填写视频描述'
      }

      if (errMsg) {
        uni.showToast({ icon: 'none', title: errMsg })
      } else {
        uni.showLoading({ title: '上传中...' })
        const file = this.fileList[0]
        console.log(file)

        // return
        const result = await upload({ name: file.name, file: file.url })
        console.log(result[0])

        const params = {
          Title: this.name,
          desc: this.description,
          duration: file.duration,
          video_size: file.size,
          video_file_type: file.type || file.tempFile?.type,
          video_file: result,
        }

        const res = await add(params)
        uni.hideLoading()
        uni.showToast({ icon: 'none', title: '视频创建成功' })
      }
    },
  },
}
</script>

<style lang="scss">
.form {
  display: flex;
  flex-direction: column;
  padding: 16px;
}
</style>
