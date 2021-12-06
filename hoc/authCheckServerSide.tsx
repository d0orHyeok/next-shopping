import { userAuth } from '@redux/features/userSlice'
import cookies from 'next-cookies'

import { GetServerSidePropsContext } from 'next'

const authCheckServerSide = async (
  store: any,
  ctx: GetServerSidePropsContext,
  option: null | boolean,
  adminRoute = false
) => {
  const { w_auth } = cookies(ctx)
  console.log('authCheckServerside')
  if (w_auth) {
    const res = await store.dispatch(userAuth({ token: w_auth }))
    console.log(res.payload)
  }
  const user = store.getState().user

  if (!user.userData) {
    // Auth 실패
    if (option) {
      // 로그인 필요
      return false
    }
  } else {
    // Auth 성공
    if (adminRoute && !user.userData.isAdmin) {
      // admin이 아닌데 adminRoute에 접근한 경우
      return false
    } else {
      if (option === false) {
        return false
      }
    }
  }
  return true
}

export default authCheckServerSide
