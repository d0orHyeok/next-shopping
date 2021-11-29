import Axios from 'axios'
import { LOGIN_USER, LOGOUT_USER, AUTH_USER } from '@redux/actions/action_types'

export const loginUserApi = (loginData) => {
  return Axios.post('/api/users/login', loginData)
}

export const logoutUser = () => {
  const req = Axios.get('/api/users/logout').then((res) => res.data)

  return {
    type: LOGOUT_USER,
    payload: req,
  }
}

export const authUser = () => {
  const req = Axios.get('/api/users/auth').then((res) => res.data)

  return {
    type: AUTH_USER,
    payload: req,
  }
}

function* loginUser
