import { RootState } from '@redux/store'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { IUserCart, IUserHistory } from '@models/User'
import Axios from 'axios'

// interfaces

interface UserData {
  _id?: string
  isAdmin?: boolean
  email?: string
  name?: string
  role?: number
  image?: string
  cart?: IUserCart[]
  history?: IUserHistory[]
}

export interface IUserState {
  userData: UserData
}

const initialState: IUserState = {
  userData: {},
}

// Slice
export const userAuth = createAsyncThunk(
  `userAuth`, // 액션 이름을 정의해 주도록 합니다.
  async () => {
    // 비동기 호출 함수를 정의합니다.
    const response = await Axios.post('/api/users/auth')
    return response.data
  }
)

export const userLogout = createAsyncThunk(
  `userLogout`, // 액션 이름을 정의해 주도록 합니다.
  async () => {
    // 비동기 호출 함수를 정의합니다.
    const response = await Axios.get('/api/users/logout')
    return response.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [userAuth.fulfilled.type]: (state, action) => {
      state.userData = action.payload
    },
    [userAuth.rejected.type]: (state) => {
      state.userData = {}
    },
    [userLogout.pending.type]: (state) => {
      state.userData = {}
    },
  },
})

// export const {} = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
