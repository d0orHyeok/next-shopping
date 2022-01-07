import LoginPage from '@components/LoginPage/LoginPage'
import AuthCheck from 'hoc/authCheck'

const login = () => {
  return <LoginPage />
}

export default AuthCheck(login, false)
