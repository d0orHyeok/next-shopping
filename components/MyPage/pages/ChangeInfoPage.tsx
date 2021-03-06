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
        alert(message ? message : '????????? ????????? ?????????????????????.')
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
      return alert('????????? ?????? ???????????? ?????????.')
    }

    if (v_confirmPassword !== 1) {
      document.getElementById('confirmPassword')?.focus()
      setConfirmPassword('')
      setIsValidate({ ...isValidate, confirmPassword: 0 })
      return alert('??????????????? ???????????? ????????????.')
    }

    if (confirm('????????? ?????????????????????????')) {
      dispatch(userChangeInfo({ password }))
        .unwrap()
        .then(() => {
          alert('?????????????????????.')
          resetInput()
          return showChangePassword(false)
        })
        .catch((error) => {
          const { message } = error
          return alert(message ? message : '?????????????????????.')
        })
    }
  }

  const handleChangeProfileImage = () => {
    if (!confirm('????????? ?????????????????????????')) return

    if (profileImage === '') {
      if (!confirm('????????? ????????? ????????????. ?????????????????? ?????????????????????????'))
        return
    }
    dispatch(userChangeInfo({ image: profileImage }))
      .unwrap()
      .then(() => {
        alert('?????????????????????.')
        setProfileImage('')
        return setShowChangeImage(false)
      })
      .catch((error) => {
        const { message } = error

        return alert(message ? message : '?????????????????????.')
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
          ??????
        </button>
      </div>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <div className={cx('imageBox')}>
          {user.userData?.image && (
            <img
              loading="lazy"
              src={user.userData.image}
              alt={user.userData.name}
            />
          )}
        </div>
        <div className={cx('inputBox', 'flexBox')}>
          <div className={cx('nameBox')}>
            <span className={cx('label')} style={{ margin: 0 }}>
              {user.userData?.name} ???
            </span>
          </div>
          <button
            className={cx('btn', 'changeBtn')}
            onClick={() => {
              showChangePassword(false)
              setShowChangeImage(true)
            }}
          >
            ????????????
          </button>
          <button
            className={cx('btn', 'changeBtn')}
            onClick={() => showChangePassword(true)}
          >
            ??????????????????
          </button>
        </div>
      </div>

      {/* ?????????????????? */}
      <div ref={changePasswordDivRef} className={cx('change', 'pw')}>
        <h3>??????????????????</h3>
        <TextField
          className={cx('input')}
          required
          id="password"
          label="Password"
          type="password"
          error={v_password !== 0 && v_password === 2 ? true : false}
          helperText={
            v_password === 2 ? '????????? ????????? ????????? 6 ~ 20 ??????' : ''
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
            v_confirmPassword === 2 ? '??????????????? ???????????? ????????????' : ''
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
          ????????????
        </button>
        <button
          className={cx('btn', 'passwordChangeBtn', 'blackBtn')}
          onClick={() => {
            showChangePassword(false)
            resetInput()
          }}
        >
          ??????
        </button>
      </div>

      {/* ???????????? */}
      {showChangeImage && (
        <div className={cx('change', 'image')}>
          <div className={cx('change-imageBox')}>
            <UploadImages maxNum={1} onChangeHandler={setProfileImage} />
          </div>
          <button
            className={cx('btn', 'passwordChangeBtn', 'blackBtn')}
            onClick={handleChangeProfileImage}
          >
            ????????????
          </button>
          <button
            className={cx('btn', 'passwordChangeBtn', 'blackBtn')}
            onClick={() => setShowChangeImage(false)}
          >
            ??????
          </button>
        </div>
      )}
    </div>
  )
}

export default ChangeInfoPage
