import AuthCheck from 'hoc/authCheck'
import styles from './AdminPage.module.css'
import Link from 'next/link'
import PreNav from './sections/PreNav'

export interface ITab {
  label: string
  href: string
}

interface IAdminPageProps {
  tabs: ITab[]
}

const AdminPage = ({ tabs }: IAdminPageProps) => {
  return (
    <>
      <div className={styles.container}>
        <PreNav sx={{ fontSize: '0.9rem', textAlign: 'right' }} />

        <div className={styles.nav}>
          <ul>
            {tabs.map((tab, index) => (
              <li key={index}>
                <Link href={tab.href}>{tab.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default AuthCheck(AdminPage, true, true)
