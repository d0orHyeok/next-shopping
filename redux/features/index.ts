import { combineReducers, AnyAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import user, { IUserState } from './userSlice'

export interface State {
  user: IUserState
}
const rootReducer = (state: State | undefined, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // console.log('HYDRATE', action.payload)
      return state
    default: {
      const combineReducer = combineReducers({
        user,
      })
      return combineReducer(state, action)
    }
  }
}

export default rootReducer
