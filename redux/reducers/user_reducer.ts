import { IUserState } from '../../interfaces/iRedux/iReducers.interfaces'
import * as actions from '@redux/actions/action_types'
import { AnyAction } from 'redux'
import { HYDRATE } from 'next-redux-wrapper'

const initialState = {
  userData: {},
}

const user_reducer = (state: IUserState = initialState, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload }
    case actions.USER_LOGIN:
      return {
        ...state,
        payload: action.payload,
      }
    default:
      return state
  }
}

export default user_reducer
