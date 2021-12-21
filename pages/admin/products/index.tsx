import AuthCheck from 'hoc/authCheck'
import AdminPage, { ITab } from '@components/AdminPage/AdminPage'

const tabs: ITab[] = [
  { label: '상품등록', href: '/admin/products/add' },
  { label: '상품조회/편집', href: '/admin/products/list' },
]

const ProductIndex = () => {
  return (
    <>
      <AdminPage tabs={tabs} />
    </>
  )
}

export default AuthCheck(ProductIndex, true, true)
