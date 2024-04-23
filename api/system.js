import { get, post, requestUpload, patch, put } from '@/common/utils/request'

// 登录
export async function login(params) {
  return post('/gomk/system/login', params)
}

// 登录
export async function register(params) {
  return post('/gomk/system/user/smart-agent-register', params)
}

// 获取用户信息
export async function getUserInfo(params) {
  return get('/gomk/system/smart-agent/user/get-info', params)
}
