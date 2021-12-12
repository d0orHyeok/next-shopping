import { combineReducers, AnyAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import user, { IUserState } from './userSlice'
import porduct, { IProductState } from './productSlice'

export interface State {
  user: IUserState
  porduct: IProductState
}

const rootReducer = (state: State, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // console.log('hydrate', action)
      return { ...state, ...action.payload }
    default: {
      const combineReducer = combineReducers({
        user,
        porduct,
      })
      return combineReducer(state, action)
    }
  }
}
export type ReducerType = ReturnType<typeof rootReducer>
export default rootReducer
