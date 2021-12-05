import AuthCheck from 'hoc/authCheck'
import Link from 'next/link'

const ProductIndex = () => {
  return (
    <>
      <div>
        <Link href="/admin/products/add">상품 추가</Link>
      </div>
    </>
  )
}

export default AuthCheck(ProductIndex, true, true)
