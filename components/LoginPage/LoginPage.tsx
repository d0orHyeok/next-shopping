import styles from './LoginPage.module.css'
import LoginModal from '@components/utils/LoginModal/LoginModal'
import { useState } from 'react'

const LoginPage = () => {
  const [open, setOpen] = useState(false)

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
