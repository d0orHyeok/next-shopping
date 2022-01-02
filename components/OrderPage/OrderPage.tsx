import styles from './OrderPage.module.css'
import classNames from 'classnames/bind'
import { useRouter } from 'next/router'
const cx = classNames.bind(styles)
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Badge } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAppSelector } from '@redux/hooks'
import { selectUser, IUserState } from '@redux/features/userSlice'
import React, { useState } from 'react'

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    top: 5,
    right: 3,
    padding: '10px 5px',
    fontSize: '14px',
    background: 'rgba(67, 67, 245, 1)',
    color: 'white',
    fontWeight: '600',
  },
}))

const OrderPage = () => {
  const router = useRouter()

  const user: IUserState = useAppSelector(selectUser)

  const [isShow, setIsShow] = useState([true, true, false, true, true])
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: {
      email_id: '',
      email_domain: '',
    },
    phone: {
      phone1: '',
      phone2: '',
      phone3: '',
    },
  })

  const handleOrderInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, name, value } = event.target

    if (id === name) {
      setOrderInfo({ ...orderInfo, [name]: value })
    } else {
      if (name === 'email') {
        setOrderInfo({
          ...orderInfo,
          [name]: { ...orderInfo.email, [id]: value },
        })
      } else {
        setOrderInfo({
          ...orderInfo,
          [name]: { ...orderInfo.phone, [id]: value },
        })
      }
    }
  }

  const handleClickShowButton = (selectIndex: number) => {
    const newIsShow = isShow.map((bol, index) =>
      index === selectIndex ? !bol : bol
    )
    setIsShow(newIsShow)
  }

  const drawShowButton = (index: number) => {
    const sx = { transform: 'translateY(4px)' }
    if (isShow[index]) {
      return (
        <button onClick={() => handleClickShowButton(index)}>
          <KeyboardArrowUpIcon sx={sx} />
        </button>
      )
    } else {
      return (
        <button onClick={() => handleClickShowButton(index)}>
          <KeyboardArrowDownIcon sx={sx} />
        </button>
      )
    }
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        {/* 헤더 */}
        <section className={cx('head')}>
          <button onClick={() => router.back()}>
            <ArrowBackIosNewIcon />
          </button>
          <h1 onClick={() => router.push('/')}>PIIC</h1>
          <div className={cx('user')}>
            <button onClick={() => router.push('/user/cart')}>
              <StyledBadge badgeContent={user.storage?.cart.length}>
                <ShoppingBagOutlinedIcon />
              </StyledBadge>
            </button>
            <button
              style={{ marginLeft: '1rem' }}
              onClick={() => router.push('/user/mypage')}
            >
              <PersonOutlineIcon sx={{ transform: 'translateY(4px)' }} />
            </button>
          </div>
        </section>
        {/* 주문 내용 */}
        <section className={cx('main')}>
          <h1>주문/결제</h1>
          {/* 주문자 정보 */}
          <div className={cx('box')}>
            <h2 className={cx('title')}>
              주문자정보
              {drawShowButton(0)}
            </h2>
            <div className={cx('content', 'orderInfo', !isShow[0] && 'hide')}>
              <div className={cx('infoBox')}>
                <span className={cx('label')}>주문자 *</span>
                <div className={cx('inputBox')}>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={orderInfo.name}
                    onChange={handleOrderInfoChange}
                  />
                </div>
              </div>
              <div className={cx('infoBox')}>
                <span className={cx('label')}>이메일 *</span>
                <div className={cx('email', 'inputBox')}>
                  <input
                    type="text"
                    id="email_id"
                    name="email"
                    value={orderInfo.email.email_id}
                    onChange={handleOrderInfoChange}
                  />
                  <span>@</span>
                  <input
                    type="text"
                    id="email_domain"
                    name="email"
                    value={orderInfo.email.email_domain}
                    onChange={handleOrderInfoChange}
                  />
                </div>
              </div>
              <div className={cx('infoBox')}>
                <span className={cx('label')}>휴대전화 *</span>
                <div className={cx('phone', 'inputBox')}>
                  <input
                    type="text"
                    id="phone1"
                    name="phone"
                    value={orderInfo.phone.phone1}
                    onChange={handleOrderInfoChange}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    id="phone2"
                    name="phone"
                    value={orderInfo.phone.phone2}
                    onChange={handleOrderInfoChange}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    id="phone3"
                    name="phone"
                    value={orderInfo.phone.phone3}
                    onChange={handleOrderInfoChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 배송방법 */}
          <div className={cx('box')}>
            <h2 className={cx('title')}>
              배송방법
              {drawShowButton(1)}
            </h2>
            <div className={cx('content', !isShow[1] && 'hide')}>afaasdf</div>
          </div>
          {/* 주문상품정보 */}
          <div className={cx('box')}>
            <h2 className={cx('title')}>
              주문상품
              {drawShowButton(2)}
            </h2>
            <div className={cx('content', !isShow[2] && 'hide')}>afaasdf</div>
          </div>
          {/* 결제정보 */}
          <div className={cx('box')}>
            <h2 className={cx('title')}>
              결제정보
              {drawShowButton(3)}
            </h2>
            <div className={cx('content', !isShow[3] && 'hide')}>afaasdf</div>
          </div>
          {/* 결제수단 */}
          <div className={cx('box')}>
            <h2 className={cx('title')}>
              결제수단
              {drawShowButton(4)}
            </h2>
            <div className={cx('content', !isShow[4] && 'hide')}>afaasdf</div>
          </div>
          {/* 약관 */}
          <div className={cx('box')}>
            <h2 className={cx('title')}>약관</h2>
            <div className={cx('content')}>afaasdf</div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default OrderPage
