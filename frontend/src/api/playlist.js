/**
 * 轮播管理相关 API
 */
import request from './http'

/**
 * 获取轮播组列表
 */
export function getPlaylists() {
  return request.get('/playlists')
}

/**
 * 获取轮播组详情
 * @param {number} id
 */
export function getPlaylistDetail(id) {
  return request.get(`/playlists/${id}`)
}

/**
 * 创建轮播组
 * @param {Object} data - { name, description, resolution, slides }
 */
export function createPlaylist(data) {
  return request.post('/playlists', data)
}

/**
 * 更新轮播组
 * @param {number} id
 * @param {Object} data
 */
export function updatePlaylist(id, data) {
  return request.patch(`/playlists/${id}`, data)
}

/**
 * 删除轮播组
 * @param {number} id
 */
export function deletePlaylist(id) {
  return request.delete(`/playlists/${id}`)
}

/**
 * 更新轮播项列表
 * @param {number} id
 * @param {Array} slides
 */
export function updateSlides(id, slides) {
  return request.post(`/playlists/${id}/slides`, { slides })
}

/**
 * 添加轮播项
 * @param {number} id
 * @param {Object} slide
 */
export function addSlide(id, slide) {
  return request.post(`/playlists/${id}/slides/add`, slide)
}

/**
 * 删除轮播项
 * @param {number} id
 * @param {number} slideId
 */
export function removeSlide(id, slideId) {
  return request.delete(`/playlists/${id}/slides/${slideId}`)
}

/**
 * 更新播放状态
 * @param {number} id
 * @param {string} status - 'idle' | 'playing'
 */
export function updatePlaylistStatus(id, status) {
  return request.post(`/playlists/${id}/status`, { status })
}
