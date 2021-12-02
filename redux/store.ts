import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createWrapper, MakeStore } from 'next-redux-wrapper'
import slice from './features/index'

const store = configureStore({
  reducer: slice,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setupStore = (context: any): EnhancedStore => store
const makeStore: MakeStore<any> = (context) => setupStore(context)

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default wrapper
