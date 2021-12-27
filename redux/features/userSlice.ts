import { IAuthUserData } from './../../pages/api/users/auth'
import { RootState } from '@redux/store'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import Axios from 'axios'
import { backendUrl } from 'config/config'
import router from 'next/router'

Axios.defaults.baseURL = backendUrl
Axios.defaults.withCredentials = true // front, backend 간 쿠키공유

export interface IUserState {
  isLogin: boolean
  userData: IAuthUserData | null
  storage: {
    likes: string[]
  }
}

// Async Action
export const userAuth = createAsyncThunk(
  `userAuth`, // 액션 이름을 정의해 주도록 합니다.
  async (token: { token: string } | null = null, { rejectWithValue }) => {
    // 비동기 호출 함수를 정의합니다.
    try {
      const response = !token
        ? await Axios.post('/api/users/auth')
        : await Axios.post('/api/users/auth', token)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userLogin = createAsyncThunk(
  `userLogin`,
  async (
    loginData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await Axios.post('/api/users/login', loginData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userLogout = createAsyncThunk(`userLogout`, async () => {
  const response = await Axios.get('/api/users/logout')
  router.push('/')
  return response.data
})

export const userClickLike = createAsyncThunk(
  `userClickLike`,
  async (pid: string, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/like', { pid })
      return response.data.userLikes
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// Slice
const initialState: IUserState = {
  isLogin: false,
  userData: null,
  storage: {
    likes: [],
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getStorageLikes(state) {
      if (state.isLogin && state.userData) {
        state.storage.likes = state.userData.likes
      } else {
        const getItems = sessionStorage.getItem('piic_likes')
        const getLikes: string[] = !getItems ? [] : JSON.parse(getItems)
        state.storage.likes = getLikes
      }
    },
    updateStorageLikes(state, action: PayloadAction<string>) {
      const newLikes = !state.storage.likes.includes(action.payload)
        ? [...state.storage.likes, action.payload]
        : state.storage.likes.filter((pid) => pid !== action.payload)

      newLikes.length !== 0
        ? sessionStorage.setItem('piic_likes', JSON.stringify(newLikes))
        : sessionStorage.removeItem('piic_likes')
      state.storage.likes = newLikes
    },
  },
  extraReducers: {
    // userAuth
    [userAuth.fulfilled.type]: (state, action) => {
      state.isLogin = true
      state.userData = action.payload
      state.storage.likes = action.payload.likes
    },
    [userAuth.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = null
    },
    // userLogin
    [userLogin.fulfilled.type]: (state) => {
      state.isLogin = true
    },
    [userLogin.rejected.type]: (state) => {
      state.isLogin = false
    },
    // userLogout
    [userLogout.pending.type]: (state) => {
      state.isLogin = false
      state.userData = null
    },
    // userClickLike
    [userClickLike.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.likes = action.payload
        state.storage.likes = action.payload
      }
    },
  },
})

export const { getStorageLikes, updateStorageLikes } = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
