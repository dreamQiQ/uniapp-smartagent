import { get, post, requestUpload, patch } from '@/common/utils/request'

export async function list(params) {
  return get('/gomk/dcs/smart-agent/video', params)
}

export async function detail(params) {
  return get(`/gomk/dcs/smart-agent/video/info/${params}`)
}

export async function upload(params) {
  const url = '/gomk/nocodbv2/api/v1/db/storage/upload?path=' + encodeURIComponent('noco/SMART_POWER/video/attachment')
  return requestUpload(url, params.name, params.file, params)
}

export async function add(params) {
  return post('/gomk/nocodbv2/api/v1/db/data/noco/SMART_POWER/video', params)
}

export async function update(params) {
  return post(`/gomk/dcs/smart-agent/video/count`, params)
}
