import { RootState } from '@redux/store'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Axios from 'axios'
import { backendUrl } from 'appConfig/config'
import { IPayment } from '@models/Payment'

Axios.defaults.baseURL = backendUrl

// interfaces

export interface IPaymentState {
  state: boolean | null
  payments: IPayment[]
  number: {
    ready: number
    delivery: number
    complete: number
    cancel: number
    change: number
    back: number
  }
}

// Async Action
export const getPayments = createAsyncThunk(
  `getPayments`,
  async (user_id: string, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/payment/findPayments', {
        user_id,
      })
      const { payments } = response.data

      return payments
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Slice
const initialState: IPaymentState = {
  state: null,
  payments: [],
  number: {
    ready: 0,
    delivery: 0,
    complete: 0,
    cancel: 0,
    change: 0,
    back: 0,
  },
}

export const paymentSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: {
    [getPayments.pending.type]: (state) => {
      state.state = null
      state.number = {
        ready: 0,
        delivery: 0,
        complete: 0,
        cancel: 0,
        change: 0,
        back: 0,
      }
    },
    [getPayments.fulfilled.type]: (state, action) => {
      state.state = true
      const payments: IPayment[] = action.payload
      payments.forEach((payment) => {
        if (payment.refund_state === null) {
          switch (payment.order_state) {
            case 'ready':
              state.number.ready += 1
              break
            case 'delivery':
              state.number.delivery += 1
              break
            case 'complete':
              state.number.complete += 1
              break
          }
        } else {
          switch (payment.refund_state) {
            case 'cancel':
              state.number.cancel += 1
              break
            case 'change':
              state.number.change += 1
              break
            case 'back':
              state.number.back += 1
              break
          }
        }
      })
    },
    [getPayments.rejected.type]: (state) => {
      state.state = false
    },
  },
})

// export const {} = paymentSlice.actions
export const selectPayment = (state: RootState) => state.payment

export default paymentSlice.reducer
