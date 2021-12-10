import AuthCheck from 'hoc/authCheck'
import Link from 'next/link'
import PreNav from '@components/utils/PreNav/PreNav'

const ProductIndex = () => {
  return (
    <>
      <div style={{ width: '80%', margin: '3rem auto' }}>
        <PreNav sx={{ fontSize: '0.9rem', textAlign: 'right' }} />
        <Link href="/admin/products/add">상품 등록</Link>
      </div>
    </>
  )
}

export default AuthCheck(ProductIndex, true, true)
