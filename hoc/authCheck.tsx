import React, { useEffect, useState } from 'react'
import { userAuth } from '@redux/features/userSlice'
import { useAppDispatch } from '@redux/hooks'
import { useRouter } from 'next/router'
import Loading from '@components/utils/Loading/Loading'

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
          router.push('/')
        } else {
          if (option === false) {
            // 로그인 했을때 접근할 수 없는 경우 (ex: 로그인, 회원가입 페이지)
            router.push('/')
          } else {
            setIsLoading(false)
          }
        }
      } catch (err) {
        if (option) {
          // 로그인 필요
          router.push('/')
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
