import styles from './ChangeInfoPage.module.css'
import classNames from 'classnames/bind'
import React, { useRef, useState } from 'react'
import Axios from 'axios'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import {
  selectUser,
  IUserState,
  userChangeInfo,
} from '@redux/features/userSlice'
import { TextField } from '@mui/material'
import UploadImages from '@components/utils/UploadImages/UploadImages'

interface isValidate {
  //  0: empty string | 1: valid | 2: invalid
  password: 0 | 1 | 2
  confirmPassword: 0 | 1 | 2
}

const cx = classNames.bind(styles)

const ChangeInfoPage = () => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)

  const changePasswordDivRef = useRef<HTMLDivElement>(null)

  const [showChangeImage, setShowChangeImage] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isValidate, setIsValidate] = useState<isValidate>({
    password: 0,
    confirmPassword: 0,
  })
  const [profileImage, setProfileImage] = useState('')

  const { password: v_password, confirmPassword: v_confirmPassword } =
    isValidate

  const resetInput = () => {
    setPassword('')
    setConfirmPassword('')
    setIsValidate({ password: 0, confirmPassword: 0 })
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target

    if (isUser) {
      checkValidate(id, value)
    }

    if (id === 'password') {
      setPassword(value)
      return
    }
    if (id === 'confirmPassword') {
      setConfirmPassword(value)
      return
    }
  }

  const checkValidate = (id: string, value: string): void => {
    let validation = 0

    const regex_password = /^(?=.*[a-zA-Z])((?=.*\d)).{6,20}$/
    switch (id) {
      case 'password':
        regex_password.test(value) ? (validation = 1) : (validation = 2)
        break
      case 'confirmPassword':
        v_password === 1 && password === value
          ? (validation = 1)
          : (validation = 2)
        break
    }

    setIsValidate({ ...isValidate, [id]: validation })
  }

  const handlePasswordPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      comparePassword()
    }
  }

  const comparePassword = () => {
    Axios.post('/api/users/checkUser', { password })
      .then(() => {
        resetInput()
        setIsUser(true)
      })
      .catch((error) => {
        const { message } = error.response.data
        alert(message ? message : '사용자 인증에 실패하였습니다.')
      })
  }

  const showChangePassword = (isShow: boolean) => {
    if (changePasswordDivRef.current !== null) {
      setShowChangeImage(false)
      changePasswordDivRef.current.style.display = isShow ? 'flex' : 'none'
    }
  }

  const handleChangePassword = () => {
    if (v_password !== 1) {
      return alert('바르지 않은 비밀번호 입니다.')
    }

    if (v_confirmPassword !== 1) {
      document.getElementById('confirmPassword')?.focus()
      setConfirmPassword('')
      setIsValidate({ ...isValidate, confirmPassword: 0 })
      return alert('비밀번호가 일치하지 않습니다.')
    }

    if (confirm('정말로 변경하시겠습니까?')) {
      dispatch(userChangeInfo({ password }))
        .unwrap()
        .then(() => {
          alert('변경되었습니다.')
          resetInput()
          return showChangePassword(false)
        })
        .catch((error) => {
          const { message } = error
          return alert(message ? message : '실패하였습니다.')
        })
    }
  }

  const handleChangeProfileImage = () => {
    if (!confirm('정말로 변경하시겠습니까?')) return

    if (profileImage === '') {
      if (!confirm('선택된 사진이 없습니다. 기본이미지로 변경하시겠습니까?'))
        return
    }
    dispatch(userChangeInfo({ image: profileImage }))
      .unwrap()
      .then(() => {
        alert('변경되었습니다.')
        setProfileImage('')
        return setShowChangeImage(false)
      })
      .catch((error) => {
        const { message } = error

        return alert(message ? message : '실패하였습니다.')
      })
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
          onChange={handlePasswordChange}
          value={password}
          autoComplete="on"
          onKeyPress={handlePasswordPress}
        />

        <button className={cx('btn', 'checkBtn')} onClick={comparePassword}>
          확인
        </button>
      </div>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <div className={cx('imageBox')}>
          {user.userData?.image && (
            <img src={user.userData.image} alt={user.userData.name} />
          )}
        </div>
        <div className={cx('inputBox', 'flexBox')}>
          <div className={cx('nameBox')}>
            <span className={cx('label')} style={{ margin: 0 }}>
              {user.userData?.name} 님
            </span>
          </div>
          <button
            className={cx('btn', 'changeBtn')}
            onClick={() => {
              showChangePassword(false)
              setShowChangeImage(true)
            }}
          >
            사진변경
          </button>
          <button
            className={cx('btn', 'changeBtn')}
            onClick={() => showChangePassword(true)}
          >
            비밀번호변경
          </button>
        </div>
      </div>

      {/* 비밀번호변경 */}
      <div ref={changePasswordDivRef} className={cx('change', 'pw')}>
        <h3>비밀번호변경</h3>
        <TextField
          className={cx('input')}
          required
          id="password"
          label="Password"
          type="password"
          error={v_password !== 0 && v_password === 2 ? true : false}
          helperText={
            v_password === 2 ? '영문과 숫자를 포함한 6 ~ 20 자리' : ''
          }
          onChange={handlePasswordChange}
          value={password}
          autoComplete="on"
        />
        <TextField
          className={cx('input')}
          required
          id="confirmPassword"
          label="Comfirm Password"
          type="password"
          error={
            v_confirmPassword !== 0 && v_confirmPassword === 2 ? true : false
          }
          helperText={
            v_confirmPassword === 2 ? '비밀번호가 일치하지 않습니다' : ''
          }
          onChange={handlePasswordChange}
          value={confirmPassword}
          autoComplete="on"
          style={{ margin: '1rem 0' }}
        />
        <button
          className={cx('btn', 'passwordChangeBtn', 'blackBtn')}
          onClick={handleChangePassword}
        >
          변경하기
        </button>
        <button
          className={cx('btn', 'passwordChangeBtn', 'blackBtn')}
          onClick={() => {
            showChangePassword(false)
            resetInput()
          }}
        >
          취소
        </button>
      </div>

      {/* 사진변경 */}
      {showChangeImage && (
        <div className={cx('change', 'image')}>
          <div className={cx('change-imageBox')}>
            <UploadImages maxNum={1} onChangeHandler={setProfileImage} />
          </div>
          <button
            className={cx('btn', 'passwordChangeBtn', 'blackBtn')}
            onClick={handleChangeProfileImage}
          >
            변경하기
          </button>
          <button
            className={cx('btn', 'passwordChangeBtn', 'blackBtn')}
            onClick={() => setShowChangeImage(false)}
          >
            취소
          </button>
        </div>
      )}
    </div>
  )
}

export default ChangeInfoPage
