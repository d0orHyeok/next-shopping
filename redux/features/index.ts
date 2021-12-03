import { combineReducers, AnyAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import user, { IUserState } from './userSlice'

export interface State {
  user: IUserState
}

const rootReducer = (state: State, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // console.log('hydrate', action)
      return { ...state, ...action.payload }
    default: {
      const combineReducer = combineReducers({
        user,
      })
      return combineReducer(state, action)
    }
  }
}

export default rootReducer
