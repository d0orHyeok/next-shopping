import React, { useState } from 'react'
import Axios from 'axios'

import styles from './RegisterPage.module.css'
import classnames from 'classnames/bind'

import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'

interface inputValue {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface isValidate {
  isName: 0 | 1 | 2
  isEmail: 0 | 1 | 2
  isPassword: 0 | 1 | 2
  isConfirmPassword: 0 | 1 | 2
}

const cx = classnames.bind(styles)

const RegisterPage = () => {
  const [inputValue, setInputValue] = useState<inputValue>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  //   const [isValidate, setIsValidate] = useState<isValidate>({
  //     isName: 0,
  //     isEmail: 0,
  //     isPassword: 0,
  //     isConfirmPassword: 0,
  //   })

  const { name, email, password, confirmPassword } = inputValue

  //   const checkValidate = (id: string, value: string): void => {
  //     console.log(id, value)
  //   }

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget
    setInputValue({
      ...inputValue,
      [id]: value,
    })
  }

  //   const onClickRegister = (): void => {}

  return (
    <>
      <div className={cx('wrap')}>
        <div className={cx('container')}>
          <div className={cx('content')}>
            <h1>Welcome, Join PIIC !</h1>
            <p>
              PIIC에 회원가입하여
              <br />
              최고의 제품과 혜택을 만나보세요.
            </p>
          </div>
          <Divider className={cx('divider')}>Register</Divider>
          <form className={cx('form')}>
            <TextField
              required
              id="email"
              label="Email"
              helperText="Incorrect entry."
              onChange={onChangeValue}
              value={email}
            />
            <TextField
              required
              id="password"
              label="Password"
              helperText="Incorrect entry."
              onChange={onChangeValue}
              value={password}
            />
            <TextField
              required
              error
              id="confirmPassword"
              label="Comfirm Password"
              helperText="Passwords do not match."
              onChange={onChangeValue}
              value={confirmPassword}
            />
            <TextField
              required
              id="name"
              label="name"
              helperText="Name must be string"
              onChange={onChangeValue}
              value={name}
            />
            <div className={cx('')}>
              <div>
                <h2>이용약관</h2>
                <div>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Asperiores illum obcaecati necessitatibus accusantium natus
                  aperiam deserunt ex aut voluptas ea, saepe optio in placeat,
                  odio recusandae nesciunt dolor! Veniam, deleniti!
                </div>
                <div>
                  <input id="check" type="checkbox" />
                  <label htmlFor="check">[필수] 약관에 동의 합니다.</label>
                </div>
              </div>
              <div>
                <h2>개인정보처리방침</h2>
                <div>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Asperiores illum obcaecati necessitatibus accusantium natus
                  aperiam deserunt ex aut voluptas ea, saepe optio in placeat,
                  odio recusandae nesciunt dolor! Veniam, deleniti!
                </div>
                <div>
                  <input id="check" type="checkbox" />
                  <label htmlFor="check">[필수] 개인정보 수집.이용동의</label>
                </div>
              </div>
            </div>
            <button className={cx('registerBtn')}>Sign Up</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
