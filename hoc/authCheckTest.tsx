import { userAuth } from '@redux/features/userSlice'
import wrapper from '@redux/store'
import cookies from 'next-cookies'

export default function AuthCheck(
  SpecificComponent: any,
  option: null | boolean,
  adminRoute = false
) {
  function AuthenticationCheck({ ...props }: any) {
    return <SpecificComponent {...props} />
  }
  AuthenticationCheck.getInitialProps = wrapper.getInitialPageProps(
    (store) => async (ctx) => {
      if (ctx?.req && ctx?.res) {
        const { w_auth } = cookies(ctx)
        if (w_auth) {
          await store.dispatch(userAuth({ token: w_auth }))
        }

        const user = store.getState().user
        if (!user.userData) {
          // Auth 실패
          if (option) {
            // 로그인 필요
            ctx.res.writeHead(302, { Location: '/' })
            ctx.res.end()
          }
        } else {
          // Auth 성공
          if (adminRoute && !user.userData.isAdmin) {
            // admin이 아닌데 adminRoute에 접근한 경우
            ctx.res.writeHead(302, { Location: '/' })
            ctx.res.end()
          } else {
            if (option === false) {
              // 로그인 했을때 접근할 수 없는 경우 (ex: 로그인, 회원가입 페이지)
              ctx.res.writeHead(302, { Location: '/' })
              ctx.res.end()
            }
          }
        }
      }
      if (SpecificComponent.getInitialProps) {
        const appProps = await SpecificComponent.getInitialProps(ctx)
        return appProps
      }
    }
  )

  return AuthenticationCheck
}
