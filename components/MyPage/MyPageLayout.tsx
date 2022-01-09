import styles from './MyPageLayout.module.css'
import UserNav from './section/UserNav'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface IMyPageProps {
  title?: string
  children?: React.ReactNode
}

const MyPageLayout = ({ children, title = '마이페이지' }: IMyPageProps) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.nav}>
          <h2 className={cx('subTitle', 'underline')}>마이페이지</h2>
          <UserNav sx={{ paddingTop: '1rem' }} />
        </div>
        <div>{children}</div>
      </div>
    </section>
  )
}

export default MyPageLayout
