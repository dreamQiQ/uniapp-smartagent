<template>
  <div class="order">
    <u-list @scrolltolower="scrolltolower">
      <u-list-item v-for="(item, index) in listData" :key="index">
        <u-cell
          :title="`按${item.remark}`"
          :label="dateFormat(item.createdAt)"
          :value="`-${item.payAmount || 0}`"
          icon="../../static/images/vipBanner.png"
          :titleStyle="titleStyle"
          :iconStyle="iconStyle"
        />
      </u-list-item>
    </u-list>
    <!-- 提示 -->
    <u-notify ref="uNotify"></u-notify>
  </div>
</template>
<script>
import { getUserOrder } from '@/api/me.js'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      titleStyle: {
        color: '#3D3D3D',
        fontSize: '24rpx',
        fontWeight: 'bold'
      },
      iconStyle: {
        width: '160rpx',
        height: '86rpx',
        'margin-right': '20rpx',
        'border-radius': '6rpx'
      },
      listData: []
    }
  },
  onLoad() {},
  onShow() {
    this.getListData()
  },
  // 下拉刷新
  async onPullDownRefresh() {
    await this.getListData()
    uni.stopPullDownRefresh()
  },
  methods: {
    dateFormat(date) {
      return dayjs(date).format('YYYY/MM/DD HH:mm')
    },
    // 触底加载
    scrolltolower() {},
    // 获取列表数据
    async getListData() {
      try {
        const { result } = await getUserOrder({ orderStatus: 1 })
        this.listData = result || []
      } catch (error) {
        this.$refs.uNotify.show({
          type: 'error',
          message: '获取订单列表失败',
          fontSize: '24rpx'
        })
      }
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.order {
  width: 100%;
  height: 100%;
  padding-top: 50rpx;
}
</style>
