import RegisterPage from '@components/RegisterPage/RegisterPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const redirect = await authCheckServerSide(store, ctx, false)

    return redirect ? { redirect: redirect, props: {} } : { props: {} }
  }
)

const register = () => {
  return (
    <>
      <RegisterPage />
    </>
  )
}

export default register
