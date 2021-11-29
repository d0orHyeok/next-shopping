import { applyMiddleware, createStore, Middleware, StoreEnhancer } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import ReduxThunk from 'redux-thunk'

import rootReducer from './reducers/index'

const bindMiddleware = (middleware: Middleware[]): StoreEnhancer => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

export const makeStore = () => {
  const store = createStore(rootReducer, bindMiddleware([ReduxThunk]))

  return store
}

export const wrapper = createWrapper(makeStore, { debug: true })
