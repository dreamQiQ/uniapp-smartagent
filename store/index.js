// 页面路径：store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfo } from '@/api/system.js'

Vue.use(Vuex) //vue的插件机制

const store = new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    }
  },
  actions: {
    async getUserInfo({ commit }) {
      const { result } = await getUserInfo()
      console.log('🚀 ~ getUserInfo ~ result:', result)
      commit('setUserInfo', result)
    }
  }
})
export default store
