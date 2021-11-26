import React, { useState } from 'react'
import Link from 'next/link'
// import Axios from 'axios'

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

// interface isValidate {
//   isName: 0 | 1 | 2
//   isEmail: 0 | 1 | 2
//   isPassword: 0 | 1 | 2
//   isConfirmPassword: 0 | 1 | 2
// }

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
              className={cx('input')}
              required
              id="email"
              label="Email"
              helperText="Incorrect entry."
              onChange={onChangeValue}
              value={email}
            />
            <TextField
              className={cx('input')}
              required
              id="password"
              label="Password"
              helperText="Incorrect entry."
              onChange={onChangeValue}
              value={password}
            />
            <TextField
              className={cx('input')}
              required
              error
              id="confirmPassword"
              label="Comfirm Password"
              helperText="Passwords do not match."
              onChange={onChangeValue}
              value={confirmPassword}
            />
            <TextField
              className={cx('input')}
              required
              id="name"
              label="name"
              helperText="Name must be string"
              onChange={onChangeValue}
              value={name}
            />
            <div className={cx('terms')}>
              <div className={cx('terms-item')}>
                <h2 className={cx('terms-title')}>
                  이용약관
                  <Link href="#">전문보기</Link>
                </h2>
                <div className={cx('terms-content')}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
                  odit sed labore praesentium dolore amet, iure, debitis laborum
                  animi incidunt dignissimos ullam a consequuntur tempore,
                  repellat illo! Accusantium illo magnam facere dolor placeat
                  quasi inventore laborum magni adipisci repudiandae modi
                  doloremque fugiat maxime odit assumenda neque veniam ipsa
                  consequuntur, tempore aspernatur quos sequi id non nulla.
                  Porro, necessitatibus quam ipsam ea, nulla animi minima
                  commodi nesciunt voluptatem vitae consequatur harum enim
                  maxime. Et modi dicta nisi facere quibusdam officiis nobis
                  ipsam, dolorem asperiores adipisci reiciendis laudantium
                  veniam ullam officia? Omnis ullam praesentium alias ut ea
                  magni tempore ipsam cumque ad.
                </div>
                <div className={cx('terms-checkfield')}>
                  <input id="check1" type="checkbox" />
                  <label htmlFor="check1">[필수] 약관에 동의 합니다.</label>
                </div>
              </div>
              <div className={cx('terms-item')}>
                <h2 className={cx('terms-title')}>
                  개인정보처리방침
                  <Link href="#">전문보기</Link>
                </h2>
                <div className={cx('terms-content')}>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Asperiores illum obcaecati necessitatibus accusantium natus
                  aperiam deserunt ex aut voluptas ea, saepe optio in placeat,
                  odio recusandae nesciunt dolor! Veniam, deleniti!
                </div>
                <div className={cx('terms-checkfield')}>
                  <input id="check2" type="checkbox" />
                  <label htmlFor="check2">[필수] 개인정보 수집.이용동의</label>
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
