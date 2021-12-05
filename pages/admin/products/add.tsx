import AddProductPage from '@components/AddProductPage/AddProductPage'
import AuthCheck from 'hoc/authCheck'

const Add = () => {
  return <AddProductPage />
}

export default AuthCheck(Add, true, true)
