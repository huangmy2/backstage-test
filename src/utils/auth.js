import Cookies from 'js-cookie'

// const PasswordKey = 'vue_admin_template_password'
const NameKey = 'vue_admin_template_name'
const TokenKey = 'vue_admin_template_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function getName () {
  return Cookies.get(NameKey)
}

export function setName (name) {
  return Cookies.set(NameKey, name)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeName () {
  return Cookies.remove(NameKey)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
