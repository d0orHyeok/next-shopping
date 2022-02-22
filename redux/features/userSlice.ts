import { IUserData } from 'types/next-auth.d'
import { IUpdateCartBody } from './../../pages/api/users/updateCart'
import { IUserCart, IDeliveryAddr } from '@models/User'
import { IAuthUserData } from './../../pages/api/users/auth'
import { RootState } from '@redux/store'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import Axios from 'axios'
import { backendUrl } from 'appConfig/config'

Axios.defaults.baseURL = backendUrl
// Axios.defaults.withCredentials = true // front, backend 간 쿠키공유

export interface IUserState {
  isLogin: boolean
  userData: IAuthUserData | null
}

// Async Action
export const userAuth = createAsyncThunk(`userAuth`, async () => {
  try {
    const response = await Axios.get('/api/users/auth')
    return response.data
  } catch (err) {
    return null
  }
})

export const userAddLike = createAsyncThunk(
  `userAddLike`,
  async (pid: string[], { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/addLike', { pid })
      const { userLikes } = response.data

      return userLikes
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
      const { userLikes } = response.data

      return userLikes
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
      const { userCart } = response.data

      return userCart
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
      const { userCart } = response.data

      return userCart
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
      const { userCart } = response.data

      return userCart
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userChangeInfo = createAsyncThunk(
  'userChangeInfo',
  async (changeData: {}, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/changeInfo', changeData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userSecession = createAsyncThunk('userSecession', async () => {
  try {
    const response = await Axios.get('/api/users/secession')
    return response.data
  } catch (err) {
    return err
  }
})

export const userUpdateDeliveryAddrs = createAsyncThunk(
  'userUpdateDeliveryAddrs',
  async (newDeliveryAddrs: IDeliveryAddr[], { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/updateDeliveryAddrs', {
        update: newDeliveryAddrs,
      })
      return response.data.newDeliveryAddrs
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// Slice
const initialState: IUserState = {
  isLogin: false,
  userData: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    auth(state, action: PayloadAction<IUserData | null>) {
      state.isLogin = action.payload !== null
      state.userData = action.payload
    },
    userLogout(state) {
      state.userData = null
      state.isLogin = false
    },
  },
  extraReducers: {
    // userAuth
    [userAuth.fulfilled.type]: (state, action) => {
      state.isLogin = true
      state.userData = action.payload
    },
    [userAuth.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = null
    },
    // userClickLike
    [userAddLike.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.likes = action.payload
      }
    },
    [userDeleteLike.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.likes = action.payload
      }
    },
    // userAddCart
    [userAddCart.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.cart = action.payload
      }
    },
    [userUpdateCart.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.cart = action.payload
      }
    },
    [userDeleteCart.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.cart = action.payload
      }
    },
    [userChangeInfo.fulfilled.type]: (state, action) => {
      const { image } = action.payload
      if (image && state.userData) {
        state.userData.image = image
      }
    },
    [userSecession.fulfilled.type]: (state) => {
      state.isLogin = false
      state.userData = null
    },
    [userUpdateDeliveryAddrs.fulfilled.type]: (state, action) => {
      if (state.userData) state.userData.deliveryAddrs = action.payload
    },
  },
})

export const { auth, userLogout } = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
