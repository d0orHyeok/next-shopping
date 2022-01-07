import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Modal from '@mui/material/Modal'

import styles from './LoginModal.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { useAppDispatch } from '@redux/hooks'
import { userLogin, userAuth } from '@redux/features/userSlice'

interface inputValue {
  email: string
  password: string
}

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const dispatch = useAppDispatch()

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

  const onClickLogin = () => {
    if (email.trim().length === 0) {
      document.getElementById('email')?.focus()
      return
    }
    if (password.trim().length === 0) {
      document.getElementById('password')?.focus()
      return
    }

    dispatch(userLogin(inputValue))
      .unwrap()
      .then(() => {
        dispatch(userAuth())
        onClose()
      })
      .catch((err) => {
        err.message ? alert(err.message) : alert('로그인에 실패했습니다.')
      })
  }

  return (
    <>
      <Modal open={open} onClose={onClose} disableScrollLock={true}>
        <div className={styles.wrapper}>
          <IconButton
            className={styles.closeBtn}
            type="button"
            color="inherit"
            sx={{ p: '5px' }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          <div className={styles.container}>
            <h1 className={styles.title}>
              <span className={styles.logo}>PIIC</span> 로그인
            </h1>
            <form
              className={styles.form}
              onSubmit={(e: React.FormEvent<HTMLElement>) => e.preventDefault()}
            >
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
                    display:
                      password && password.length !== 0 ? 'none' : 'block',
                  }}
                >
                  Password
                </label>
                <input
                  required
                  onChange={onChangeValue}
                  id="password"
                  type="password"
                  autoComplete="on"
                  value={password}
                />
              </div>
              <div className={styles.buttonWrapper}>
                <input
                  onClick={onClickLogin}
                  className={styles.button}
                  type="button"
                  value="로그인"
                />
              </div>
            </form>
            <h2 className={styles.subtitle}>
              회원이 아니신가요? <Link href="/register">회원가입</Link>
            </h2>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default LoginModal
