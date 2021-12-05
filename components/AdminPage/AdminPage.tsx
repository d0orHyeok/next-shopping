import AuthCheck from 'hoc/authCheck'
import styles from './AdminPage.module.css'
import Link from 'next/link'

const AdminPage = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.nav}>
          <ul>
            <li>
              <Link href="/admin/users">유저관리</Link>
            </li>
            <li>
              <Link href="/admin/products">상품관리</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default AuthCheck(AdminPage, true, true)
