import styles from './SecessionPage.module.css'
import classNames from 'classnames/bind'
import { TextField } from '@mui/material'
import React, { useState } from 'react'
import Axios from 'axios'
import { useAppDispatch } from '@redux/hooks'
import { userSecession } from '@redux/features/userSlice'
import { useRouter } from 'next/router'

const cx = classNames.bind(styles)

const SecessionPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [isUser, setIsUser] = useState(false)

  const comparePassword = () => {
    Axios.post('/api/users/checkUser', { password })
      .then(() => {
        setPassword('')
        setIsUser(true)
      })
      .catch((error) => {
        const { message } = error.response.data
        alert(message ? message : '사용자 인증에 실패하였습니다.')
      })
  }

  const secessionUser = () => {
    if (!confirm('회원탈퇴를 진행하시겠습니까?')) return

    dispatch(userSecession())
      .unwrap()
      .then(() => {
        alert('탈퇴 되었습니다.')
        router.push('/')
      })
      .catch(() => alert('실패하였습니다.'))
  }

  return !isUser ? (
    <div className={cx('userCheck')}>
      <div className={cx('inputBox')}>
        <TextField
          className={cx('input')}
          required
          id="password"
          label="Password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          autoComplete="on"
          onKeyPress={(event) => event.key === 'Enter' && comparePassword()}
        />

        <button className={cx('btn', 'checkBtn')} onClick={comparePassword}>
          확인
        </button>
      </div>
    </div>
  ) : (
    <div className={cx('wrapper')}>
      <button
        className={cx('btn', 'blackBtn', 'secessionBtn')}
        onClick={secessionUser}
      >
        회원탈퇴
      </button>
    </div>
  )
}

export default SecessionPage
