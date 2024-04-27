import { get, post, requestUpload, put } from '@/common/utils/request'

export async function list(params) {
  return get('/gomk/dcs/smart-agent/video', params)
}

export async function detail(id, params) {
  return get(`/gomk/dcs/smart-agent/video/info/${id}`, params)
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

export async function videoType(params) {
  return get(`/gomk/dcs/smart-agent/video-classification/tree`, params)
}

export async function videoCount() {
  return get(`/gomk/dcs/smart-agent/video/list-classification-latest`)
}

export async function videoSearch(params) {
  return get(`/gomk/dcs/smart-agent/video/search`, params)
}

export async function videoHotTag() {
  return get(`/gomk/dcs/smart-agent/video/list-hot-label`)
}
