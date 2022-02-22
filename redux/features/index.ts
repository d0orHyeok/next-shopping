import { combineReducers, AnyAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import user, { IUserState } from './userSlice'
import product, { IProductState } from './productSlice'

export interface State {
  user: IUserState
  product: IProductState
}

const rootReducer = (state: State, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload }
    default: {
      const combineReducer = combineReducers({
        user,
        product,
      })
      return combineReducer(state, action)
    }
  }
}
export type ReducerType = ReturnType<typeof rootReducer>
export default rootReducer
