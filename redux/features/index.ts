import { combineReducers, AnyAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import user, { IUserState } from './userSlice'
import product, { IProductState } from './productSlice'
import payment, { IPaymentState } from './paymentSlice'

export interface State {
  user: IUserState
  product: IProductState
  payment: IPaymentState
}

const rootReducer = (state: State, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // console.log('hydrate', action)
      return { ...state, ...action.payload }
    default: {
      const combineReducer = combineReducers({
        user,
        product,
        payment,
      })
      return combineReducer(state, action)
    }
  }
}
export type ReducerType = ReturnType<typeof rootReducer>
export default rootReducer
