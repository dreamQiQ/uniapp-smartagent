<template>
  <view>
    <video class="player" id="myVideo" :src="videoSrc" controls></video>
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoSrc: '',
    }
  },
  mounted() {
    const video = uni.getStorageSync('video')
    this.videoSrc = video.video_file[0].url
    console.log(video)
  },
  methods: {},
}
</script>

<style>
.player {
  width: 100%;
  height: 100vh;
}
</style>
