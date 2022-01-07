import styles from './LoginPage.module.css'
import LoginModal from '@components/utils/LoginModal/LoginModal'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@redux/hooks'
import { selectUser, IUserState } from '@redux/features/userSlice'
import { useRouter } from 'next/router'

const LoginPage = () => {
  const [open, setOpen] = useState(false)
  const user: IUserState = useAppSelector(selectUser)
  const router = useRouter()

  useEffect(() => {
    if (user.isLogin) {
      router.back()
    }
  }, [user.isLogin])

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.container}>
          <p className={styles.content}>로그인하여 쇼핑을 계속하세요!</p>
          <h1 className={styles.title}>
            <span className={styles.logo}>PIIC</span> 로그인
          </h1>
          <button onClick={() => setOpen(true)} className={styles.btn}>
            로그인/회원가입
          </button>
        </div>
      </section>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default LoginPage
