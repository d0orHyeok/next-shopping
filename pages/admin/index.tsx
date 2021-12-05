import AuthCheck from 'hoc/authCheck'
import AdminPage from '@components/AdminPage/AdminPage'

const AdminIndex = () => {
  return (
    <>
      <AdminPage />
    </>
  )
}

export default AuthCheck(AdminIndex, true, true)
