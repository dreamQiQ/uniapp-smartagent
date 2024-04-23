import { get, post, requestUpload, patch } from '@/common/utils/request'

// 获取VIP套餐
export async function getVipList(params) {
  return get('/gomk/nocodbv2/api/v1/db/data/noco/SMART_POWER/video_products', params)
}

// 开通VIP
export async function openVip(params) {
  return get(`/gomk/system/pay/stripe/goto-pay/${params}`)
}
