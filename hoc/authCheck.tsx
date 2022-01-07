import React, { useEffect, useState } from 'react'
import { userAuth } from '@redux/features/userSlice'
import { useAppDispatch } from '@redux/hooks'
import { useRouter } from 'next/router'
import Loading from '@components/utils/Loading/Loading'
import cookies from 'next-cookies'
import { GetServerSidePropsContext } from 'next'

// CSR에서 auth check를 수행하는 HOC
export default function AuthCheck(
  SpecificComponent: any,
  option: null | boolean,
  adminRoute = false
) {
  function AuthenticationCheck(props: any) {
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const checkPass = async () => {
      try {
        const res = await dispatch(userAuth()).unwrap()
        if (adminRoute && !res.isAdmin) {
          // admin이 아닌데 adminRoute에 접근한 경우
          router.back()
        } else {
          if (option === false) {
            // 로그인 했을때 접근할 수 없는 경우 (ex: 로그인, 회원가입 페이지)
            router.back()
          } else {
            setIsLoading(false)
          }
        }
      } catch (err) {
        if (option) {
          // 로그인 필요
          router.back()
        } else {
          setIsLoading(false)
        }
      }
    }

    useEffect(() => {
      checkPass()
    }, [])

    return <>{isLoading ? <Loading /> : <SpecificComponent {...props} />}</>
  }
  return AuthenticationCheck
}

// SSR AuthCheck | redirect 옵션을 리턴값으로 준다
interface IRedirectNotAuth {
  permanent: boolean
  destination: string
}

export const authCheckServerSide = async (
  store: any, // redux store
  context: GetServerSidePropsContext, // context
  // null: all user | false: not login user | true: login user
  option: null | boolean,
  adminRoute = false, // default false | false: not admin | true: for admin
  destination = '/' // default '/' | redirect page path
): Promise<IRedirectNotAuth | null> => {
  const redirect = {
    permanent: false,
    destination: destination,
  }
  const { w_auth } = cookies(context)
  if (w_auth) {
    await store.dispatch(userAuth({ token: w_auth }))
  }
  const user = await store.getState().user
  if (!user.userData) {
    // Auth 실패
    if (option) {
      // 로그인 필요
      return redirect
    }
  } else {
    // Auth 성공
    if (adminRoute && !user.userData.isAdmin) {
      // admin이 아닌데 adminRoute에 접근한 경우
      return redirect
    } else {
      if (option === false) {
        return redirect
      }
    }
  }

  return null
}
