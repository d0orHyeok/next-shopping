import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import styles from './LoginBox.module.css'
import Link from 'next/link'
import { useState } from 'react'

interface LoginPageProops {
  onClose?: () => void
}

interface inputValue {
  email: string
  password: string
}

const LoginPage = ({ onClose }: LoginPageProops) => {
  const [inputValue, setInputValue] = useState<inputValue>({
    email: '',
    password: '',
  })

  const { email, password } = inputValue

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget
    setInputValue({
      ...inputValue,
      [id]: value,
    })
  }

  return (
    <>
      <div className={styles.wrapper}>
        <IconButton
          className={styles.closeBtn}
          type="button"
          color="inherit"
          sx={{ p: '5px' }}
          onClick={() => onClose && onClose()}
        >
          <CloseIcon />
        </IconButton>
        <div className={styles.container}>
          <h1 className={styles.title}>
            <span className={styles.logo}>PIIC</span> 로그인
          </h1>
          <form className={styles.form}>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="email"
                style={{
                  display: email && email.length !== 0 ? 'none' : 'block',
                }}
              >
                Email
              </label>
              <input
                required
                onChange={onChangeValue}
                id="email"
                type="text"
                value={email}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="password"
                style={{
                  display: password && password.length !== 0 ? 'none' : 'block',
                }}
              >
                Password
              </label>
              <input
                required
                onChange={onChangeValue}
                id="password"
                type="password"
                value={password}
              />
            </div>
            <div className={styles.buttonWrapper}>
              <input className={styles.button} type="submit" value="로그인" />
            </div>
          </form>
          <h2 className={styles.subtitle}>
            회원이 아니신가요? <Link href="/register">회원가입</Link>
          </h2>
        </div>
      </div>
    </>
  )
}

export default LoginPage
