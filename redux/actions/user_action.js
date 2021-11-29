import * as type from '@redux/actions/action_types'

export const userLogin = (payload) => {
  return {
    type: type.USER_LOGIN,
    payload: payload,
  }
}

export const userLoginSuccess = (data) => {
  return {
    type: type.USER_LOGIN,
    data: data,
  }
}

export const userLoginFail = (data) => {
  return {
    type: type.USER_LOGIN,
    error: data,
  }
}
