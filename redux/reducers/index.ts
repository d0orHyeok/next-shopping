import { combineReducers, Reducer, AnyAction } from 'redux'
import user from './user_reducer'
import { IRootState } from '@interfaces/iRedux/iReducers.interfaces'

const rootReducer: Reducer<IRootState, AnyAction> = combineReducers<IRootState>(
  {
    user,
  }
)

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>
