
import { getToken, getName, setName, removeName, setToken, removeToken } from '@/utils/auth'
import axios from 'axios'

let baseAxiosUrl = (location.hostname.indexOf('test') > -1 || location.hostname.indexOf('host') > -1) ? 'http://test-admin-dstock.dongqiudi.net' : (location.hostname.indexOf('beta') > -1 ? 'https://beta-admin-dstock.doujinchaogu.com' : 'https://admin.doujinchaogu.com')
axios.defaults.baseURL = baseAxiosUrl
const getDefaultState = () => {
  return {
    token: getToken(),
    name: getName()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
    console.log('RESET_STATE--wwy', state)
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  // user login
  Login ({ commit }, userInfo) {
    console.log('commit----wwy', commit)
    console.log('commit----wwy', userInfo)
    return new Promise((resolve, reject) => {
      axios.get(`/admin/login?phone=${userInfo.phoneNumber}&code=${userInfo.codeNumber}`).then(response => { // todo  替换请求url
        console.log('登录请求====', response)
        let data = response.data
        if (data.code === 0) {
          commit('SET_TOKEN', data.data.access_token)
          commit('SET_NAME', data.data.username)
          setName(data.data.username)
          setToken(data.data.access_token)
          sessionStorage.setItem('usertoken', data.data.access_token)
          resolve('loginSuccess')
        } else {
          resolve(data.message)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('/admin/logout').then(response => { // todo 替换请求url
        console.log('退出登录请求====', response)
        let data = response.data
        if (data.code === 0) {
          removeToken()
          removeName()
          commit('RESET_STATE')
          resolve()
        } else {
          console.log('登出失败')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
    //   removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
