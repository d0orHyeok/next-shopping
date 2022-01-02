import { IUpdateCartBody } from './../../pages/api/users/updateCart'
import { IUserCart } from '@models/User'
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
    cart: IUserCart[]
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

export const userAddLike = createAsyncThunk(
  `userAddLike`,
  async (pid: string[], { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/addLike', { pid })
      return response.data.userLikes
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userDeleteLike = createAsyncThunk(
  `userDeleteLike`,
  async (pid: string[], { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/deleteLike', { pid })
      return response.data.userLikes
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userAddCart = createAsyncThunk(
  `userAddCart`,
  async (orders: IUserCart[], { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/addCart', { orders })
      return response.data.userCart
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userUpdateCart = createAsyncThunk(
  `userUpdateCart`,
  async (body: IUpdateCartBody, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/updateCart', body)
      return response.data.userCart
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userDeleteCart = createAsyncThunk(
  `userDeleteCart`,
  async (dropIndex: number[], { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/deleteCart', { dropIndex })
      return response.data.userCart
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
    cart: [],
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 위시리스트 가져오기
    getStorageLikes(state) {
      if (state.isLogin && state.userData) {
        state.storage.likes = state.userData.likes
      } else {
        const getItems = localStorage.getItem('piic_likes')
        const getLikes: string[] = !getItems ? [] : JSON.parse(getItems)
        state.storage.likes = getLikes
      }
    },
    // 위시리스트 업데이트
    addStorageLikes(state, action: PayloadAction<string[]>) {
      const newLikes = Array.from(
        new Set(state.storage.likes.concat(action.payload))
      )
      localStorage.setItem('piic_likes', JSON.stringify(newLikes))
      state.storage.likes = newLikes
    },
    deleteStorageLikes(state, action: PayloadAction<string[]>) {
      const newLikes = state.storage.likes.filter(
        (pid) => !action.payload.includes(pid)
      )
      newLikes.length
        ? localStorage.setItem('piic_likes', JSON.stringify(newLikes))
        : localStorage.removeItem('piic_likes')
      state.storage.likes = newLikes
    },
    // 장바구니 가져오기
    getStorageCart(state) {
      if (state.isLogin && state.userData) {
        state.storage.cart = state.userData.cart
      } else {
        const getItems = localStorage.getItem('piic_cart')
        const getCart: IUserCart[] = !getItems ? [] : JSON.parse(getItems)
        state.storage.cart = getCart
      }
    },
    // 장바구니 업데이트
    addStorageCart(state, action: PayloadAction<IUserCart[]>) {
      const newCart = [...state.storage.cart, ...action.payload]
      localStorage.setItem('piic_cart', JSON.stringify(newCart))
      state.storage.cart = newCart
    },
    updateStorageCart(state, action: PayloadAction<IUpdateCartBody>) {
      const { index, update } = action.payload
      const newCart = state.storage.cart.map((order, i) => {
        if (i === index) {
          return update
        } else {
          return order
        }
      })
      localStorage.setItem('piic_cart', JSON.stringify(newCart))
      state.storage.cart = newCart
    },
    deleteStorageCart(state, action: PayloadAction<number[]>) {
      const newCart = state.storage.cart.filter(
        (_, index) => !action.payload.includes(index)
      )
      newCart.length
        ? localStorage.setItem('piic_cart', JSON.stringify(newCart))
        : localStorage.removeItem('piic_cart')
      state.storage.cart = newCart
    },
  },
  extraReducers: {
    // userAuth
    [userAuth.fulfilled.type]: (state, action) => {
      state.isLogin = true
      state.userData = action.payload
      state.storage.likes = action.payload.likes
      state.storage.cart = action.payload.cart
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
    [userAddLike.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.likes = action.payload
        state.storage.likes = action.payload
      }
    },
    [userDeleteLike.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.likes = action.payload
        state.storage.likes = action.payload
      }
    },
    // userAddCart
    [userAddCart.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.cart = action.payload
        state.storage.cart = action.payload
      }
    },
    [userUpdateCart.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.cart = action.payload
        state.storage.cart = action.payload
      }
    },
    [userDeleteCart.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.cart = action.payload
        state.storage.cart = action.payload
      }
    },
  },
})

export const {
  getStorageLikes,
  addStorageLikes,
  deleteStorageLikes,
  getStorageCart,
  addStorageCart,
  updateStorageCart,
  deleteStorageCart,
} = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
