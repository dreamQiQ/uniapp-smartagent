<template>
  <view class="search-input" @tap="toSearch">
    <u-icon name="search" size="48rpx" color="#929292"></u-icon>
    <view class="placeholder"> {{ placeholder }} </view>
  </view>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  data() {
    return {}
  },
  methods: {
    toSearch() {
      uni.navigateTo({
        url: '/pages/video/search'
      })
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.search-input {
  width: 100%;
  height: 80rpx;
  border-radius: 12rpx;
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  .placeholder {
    color: #929292;
    font-size: 26rpx;
    margin-left: 10rpx;
  }
}
</style>
