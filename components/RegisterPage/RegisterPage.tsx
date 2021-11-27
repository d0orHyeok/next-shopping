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

interface isValidate {
  //  0: empty string | 1: valid | 2: invalid
  name: 0 | 1 | 2
  email: 0 | 1 | 2
  password: 0 | 1 | 2
  confirmPassword: 0 | 1 | 2
}

const cx = classnames.bind(styles)

const RegisterPage = () => {
  const [inputValue, setInputValue] = useState<inputValue>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isValidate, setIsValidate] = useState<isValidate>({
    name: 0,
    email: 0,
    password: 0,
    confirmPassword: 0,
  })

  const { name, email, password, confirmPassword } = inputValue
  const {
    name: v_name,
    email: v_email,
    password: v_password,
    confirmPassword: v_confirmPassword,
  } = isValidate

  const checkValidate = (id: string, value: string): void => {
    let validation = 0

    const regex_email =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
    const regex_password = /^(?=.*[a-zA-Z])((?=.*\d)).{6,20}$/
    const regex_name = /^[가-힣|a-z|A-Z|\s]+$/
    switch (id) {
      case 'email':
        regex_email.test(value) ? (validation = 1) : (validation = 2)
        break
      case 'password':
        regex_password.test(value) ? (validation = 1) : (validation = 2)
        break
      case 'confirmPassword':
        v_password === 1 && password === value
          ? (validation = 1)
          : (validation = 2)
        break
      case 'name':
        value.trim().length > 1 && regex_name.test(value.trim())
          ? (validation = 1)
          : (validation = 2)
        break
    }

    setIsValidate({ ...isValidate, [id]: validation })
  }

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget
    setInputValue({
      ...inputValue,
      [id]: value.trim(),
    })
    checkValidate(id, value)
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
              error={v_email !== 0 && v_email === 2 ? true : false}
              helperText={v_email === 2 ? '알 수 없는 이메일 형식입니다.' : ''}
              onChange={onChangeValue}
              value={email}
            />
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
              onChange={onChangeValue}
              value={password}
            />
            <TextField
              className={cx('input')}
              required
              id="confirmPassword"
              label="Comfirm Password"
              type="password"
              error={
                v_confirmPassword !== 0 && v_confirmPassword === 2
                  ? true
                  : false
              }
              helperText={
                v_confirmPassword === 2 ? '비밀번호가 일치하지 않습니다' : ''
              }
              onChange={onChangeValue}
              value={confirmPassword}
            />
            <TextField
              className={cx('input')}
              required
              id="name"
              label="name"
              error={v_name !== 0 && v_name === 2 ? true : false}
              helperText={v_name === 2 ? '이름은 문자여야 합니다.' : ''}
              onChange={onChangeValue}
              value={name}
            />
            <div className={cx('terms')}>
              <div className={cx('terms-item')}>
                <h2 className={cx('terms-title')}>
                  이용약관
                  <Link href="/scenter/policy">전문보기</Link>
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
                  <input required id="check1" type="checkbox" />
                  <label htmlFor="check1">[필수] 약관에 동의 합니다.</label>
                </div>
              </div>
              <div className={cx('terms-item')}>
                <h2 className={cx('terms-title')}>
                  개인정보처리방침
                  <Link href="/scenter/privacyAndTerms">전문보기</Link>
                </h2>
                <div className={cx('terms-content')}>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Asperiores illum obcaecati necessitatibus accusantium natus
                  aperiam deserunt ex aut voluptas ea, saepe optio in placeat,
                  odio recusandae nesciunt dolor! Veniam, deleniti!
                </div>
                <div className={cx('terms-checkfield')}>
                  <input required id="check2" type="checkbox" />
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
