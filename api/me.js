import { get, post, requestUpload, patch, put } from '@/common/utils/request'

// 获取VIP套餐
export async function getVipList(params) {
  return get('/gomk/nocodbv2/api/v1/db/data/noco/SMART_POWER/video_products', params)
}

// 开通VIP
export async function openVip(params) {
  return get(`/gomk/system/pay/stripe/goto-pay/${params}`)
}

// 获取用户订单
export async function getUserOrder(params) {
  return get('/gomk/system/smart-agent/order/list-by-user', params)
}

// 编辑用户信息
export async function editUserInfo(params) {
  return put('/gomk/system/smart-agent/user', params)
}

// 上传头像
export async function uploadAvatar(params) {
  return post('/gomk/system/common/file/upload/avatar', params)
}
