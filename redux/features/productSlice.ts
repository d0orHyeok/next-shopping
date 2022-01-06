import { RootState } from '@redux/store'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Axios from 'axios'
import { backendUrl } from 'appConfig/config'
import { IProduct } from '@models/Product'

Axios.defaults.baseURL = backendUrl

// interfaces
export interface IBestProduct {
  mainCategory: string
  products: IProduct[]
}

export interface IProductState {
  bestProducts: IBestProduct[]
}

// Async Action
export const getBestProducts = createAsyncThunk(`getBestProducts`, async () => {
  const response = await Axios.get('/api/product/getBestProducts')
  return response.data
})

// Slice
const initialState: IProductState = {
  bestProducts: [],
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: {
    [getBestProducts.fulfilled.type]: (state, action) => {
      state.bestProducts = action.payload.bestProducts
    },
    [getBestProducts.rejected.type]: (state) => {
      state.bestProducts = []
    },
  },
})

// export const {} = productSlice.actions
export const selectProduct = (state: RootState) => state.product

export default productSlice.reducer
