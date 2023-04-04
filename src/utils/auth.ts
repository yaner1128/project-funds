import Cookies from 'js-cookie'
import Config from '@/config'

console.log('Config', Config)

const TokenKey = Config.TokenKey

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token: any, rememberMe: boolean) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
