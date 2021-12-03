import RegisterPage from '@components/RegisterPage/RegisterPage'
import AuthCheck from 'hoc/authCheck'

const register = () => {
  return (
    <>
      <RegisterPage />
    </>
  )
}

export default AuthCheck(register, false)
