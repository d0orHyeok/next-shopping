import React, { useState } from 'react'
import Link from 'next/link'
import Axios from 'axios'
import { useRouter } from 'next/router'

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
  const router = useRouter()

  const [check, setCheck] = useState({
    check1: false,
    check2: false,
  })

  const [inputValue, setInputValue] = useState<inputValue>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })
  const [isValidate, setIsValidate] = useState<isValidate>({
    email: 0,
    password: 0,
    confirmPassword: 0,
    name: 0,
  })

  const { name, email, password, confirmPassword } = inputValue
  const {
    email: v_email,
    password: v_password,
    confirmPassword: v_confirmPassword,
    name: v_name,
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

  const onChangeBoolean = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.currentTarget
    setCheck({
      ...check,
      [id]: checked,
    })
  }

  const onClickRegister = (): void => {
    // 유효성을 전부 통과하지 못했다면 return
    if (Object.values(isValidate).filter((valid) => valid !== 1).length !== 0) {
      const keys = Object.keys(isValidate)
      const values = Object.values(isValidate)

      let newValidate = {}
      let focus = false

      // 유효성을 통과하지 못한 항목을 error 처리
      values.forEach((value, index) => {
        if (value !== 1) {
          newValidate = {
            ...newValidate,
            [keys[index]]: 2,
          }
          if (focus === false) {
            // 통과하지못한 첫번째 항목을 focus
            document.getElementById(keys[index])?.focus()
            focus = true
          }
        }
      })
      setIsValidate({ ...isValidate, ...newValidate })
      return
    } else if (
      // 항목을 체크하지 않았다면 리턴
      Object.values(check).filter((ischecked) => ischecked === false).length !==
      0
    ) {
      alert('항목을 체크해주세요')
      return
    }

    // 서버에 회원가입 요청
    const body = {
      name,
      email,
      password,
    }
    Axios.post('/api/users/register', body).then((res) => {
      if (res.data.success === false) {
        alert(res.data.message)
        return
      }
      router.push('/')
      alert('가입되었습니다')
    })
  }

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
          <form
            onSubmit={(e: React.FormEvent<HTMLElement>) => e.preventDefault()}
            className={cx('form')}
          >
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
              autoComplete="on"
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
              autoComplete="on"
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
                  <input
                    required
                    id="check1"
                    type="checkbox"
                    checked={check.check1}
                    onChange={onChangeBoolean}
                  />
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
                  <input
                    required
                    id="check2"
                    type="checkbox"
                    checked={check.check2}
                    onChange={onChangeBoolean}
                  />
                  <label htmlFor="check2">[필수] 개인정보 수집.이용동의</label>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClickRegister}
              className={cx('registerBtn')}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
