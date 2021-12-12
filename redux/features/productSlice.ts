import categoryData from 'public/data/category.json'
import { RootState } from '@redux/store'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Axios from 'axios'
import { backendUrl } from 'config/config'
import { IProduct } from '@models/Product'

Axios.defaults.baseURL = backendUrl

const mainCategorys = categoryData.map((item) => item.name)

// interfaces
export interface IBestProducts {
  mainCategory: string
  products: IProduct[]
}

export interface IProductState {
  products: IProduct[]
  bestProducts: IBestProducts[]
}

// Async Action
export const getProducts = createAsyncThunk(`getProducts`, async () => {
  const response = await Axios.get('/api/product/products')
  return response.data
})

export const getBestProducts = createAsyncThunk(
  `getBestProducts`,
  async (option?: string) => {
    let categorys = ''
    switch (option) {
      case undefined:
        break
      case 'all':
        categorys = mainCategorys.join(',')
        break
      default:
        categorys = option
    }

    const params = {
      categorys: categorys,
    }
    const response = await Axios.get('/api/product/getBestProducts', {
      params: params,
    })
    return response.data
  }
)

// Slice
const initialState: IProductState = {
  products: [],
  bestProducts: [],
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: {
    [getProducts.fulfilled.type]: (state, action) => {
      state.products = action.payload.products
    },
    [getProducts.rejected.type]: (state) => {
      state.products = []
    },
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
