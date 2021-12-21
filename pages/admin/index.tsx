import AuthCheck from 'hoc/authCheck'
import AdminPage, { ITab } from '@components/AdminPage/AdminPage'

const tabs: ITab[] = [
  { label: '유저관리', href: '/admin/users' },
  { label: '상품관리', href: '/admin/products' },
]

const AdminIndex = () => {
  return (
    <>
      <AdminPage tabs={tabs} />
    </>
  )
}

export default AuthCheck(AdminIndex, true, true)
