import request from '@/utils/request'

export function login (data) {
  const baseAxiosUrl = location.hostname.includes('localhost') ? '//api.dongqiudi.com' : location.hostname.includes('test') ? '//test1-api.dongqiudi.com' : location.hostname.includes('beta') ? '//beta-api.dongqiudi.com' : '//api.dongqiudi.com'
  return request({
    url: `${baseAxiosUrl}/v3/sportsvideo/Pc/Admin/Login`,
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
