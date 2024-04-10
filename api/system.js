import {
	get,
	post,
	requestUpload,
	patch,
	put
} from '@/common/utils/request';


// 登录
export async function login(params) {
	return post('/gomk/system/login', params)
}

// 获取用户信息
export async function getUserInfo(params) {
	return get('/gomk/system/user/profile', params)
} 