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
import DaumPostCodeModal from '@components/utils/DaumPostCodeModal/DaumPostCodeModal'

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

  const [open, setOpen] = useState(false)
  const [showTextarea, setShowTextarea] = useState(false)
  const [isShow, setIsShow] = useState([true, true, false, true, true])
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: { email_id: '', email_domain: '' },
    phone: { phone1: '', phone2: '', phone3: '' },
  })
  const [addrInfo, setAddrInfo] = useState({
    name: '',
    address: { zonecode: '', baseAddress: '', extraAddress: '' },
    phone: { phone1: '', phone2: '', phone3: '' },
    message: '',
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

  const handleAddrInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = event.currentTarget

    if (name === 'name') {
      setAddrInfo({ ...addrInfo, [name]: value })
    } else {
      if (name === 'address') {
        setAddrInfo({
          ...addrInfo,
          [name]: { ...addrInfo.address, [id]: value },
        })
      } else {
        setAddrInfo({
          ...addrInfo,
          [name]: { ...addrInfo.phone, [id]: value },
        })
      }
    }
  }

  const handleAddrMessageSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target

    if (value === 'type') {
      setAddrInfo({ ...addrInfo, message: '' })
      setShowTextarea(true)
      return
    }

    setShowTextarea(false)
    if (value === 'none') {
      setAddrInfo({ ...addrInfo, message: '' })
    } else {
      setAddrInfo({ ...addrInfo, message: value })
    }
  }

  const handleAddrRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id } = event.target

    if (id === 'addr-new') {
      setAddrInfo({
        ...addrInfo,
        name: '',
        phone: { phone1: '', phone2: '', phone3: '' },
      })
    } else {
      setAddrInfo({ ...addrInfo, name: orderInfo.name, phone: orderInfo.phone })
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
    <>
      <DaumPostCodeModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(zonecode: string, baseAddress: string) =>
          setAddrInfo({
            ...addrInfo,
            address: { zonecode, baseAddress, extraAddress: '' },
          })
        }
      />
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
              <div className={cx('content', !isShow[1] && 'hide')}>
                <div className={cx('delivery')}>
                  <h3>배송방법선택</h3>
                  <div className={cx('delivery-method')}>
                    <input
                      type="radio"
                      name="delivery"
                      checked
                      onChange={() => {
                        return
                      }}
                    />
                    <label>택배</label>
                  </div>
                </div>
                <div className={cx('address')}>
                  <div className={cx('address-radio')}>
                    <ul>
                      <li>
                        <input
                          id="addr-user"
                          name="addr"
                          type="radio"
                          onChange={handleAddrRadioChange}
                        />
                        <label htmlFor="addr-user">주문자 정보와 동일</label>
                      </li>
                      <li>
                        <input
                          id="addr-new"
                          name="addr"
                          type="radio"
                          onChange={handleAddrRadioChange}
                        />
                        <label htmlFor="addr-new">새로운 배송지</label>
                      </li>
                    </ul>
                  </div>
                  <div className={cx('address-info')}>
                    <div className={cx('infoBox')}>
                      <span className={cx('label')}>받는사람 *</span>
                      <div className={cx('inputBox')}>
                        <input
                          type="text"
                          name="name"
                          value={addrInfo.name}
                          onChange={handleAddrInfoChange}
                        />
                      </div>
                    </div>
                    <div className={cx('infoBox', 'addr')}>
                      <span className={cx('label')}>주소 *</span>
                      <div className={cx('inputBox')}>
                        <div className={cx('addr-search')}>
                          <input
                            type="text"
                            placeholder="우편번호"
                            id="zonecode"
                            name="address"
                            value={addrInfo.address.zonecode}
                            onChange={handleAddrInfoChange}
                          />
                          <button onClick={() => setOpen(true)}>
                            주소검섹
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="기본주소"
                          id="baseAddress"
                          name="address"
                          value={addrInfo.address.baseAddress}
                          onChange={handleAddrInfoChange}
                        />
                        <input
                          type="text"
                          placeholder="나머지주소"
                          id="extraAddress"
                          name="address"
                          value={addrInfo.address.extraAddress}
                          onChange={handleAddrInfoChange}
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
                          value={addrInfo.phone.phone1}
                          onChange={handleAddrInfoChange}
                        />
                        <span>-</span>
                        <input
                          type="text"
                          id="phone2"
                          name="phone"
                          value={addrInfo.phone.phone2}
                          onChange={handleAddrInfoChange}
                        />
                        <span>-</span>
                        <input
                          type="text"
                          id="phone3"
                          name="phone"
                          value={addrInfo.phone.phone3}
                          onChange={handleAddrInfoChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={cx(
                  'content',
                  'topline',
                  'addr-select',
                  !isShow[1] && 'hide'
                )}
              >
                <select
                  name="delivery_message"
                  id="delivery_message"
                  onChange={handleAddrMessageSelect}
                >
                  <option value="none">--- 메세지 선택 (선택사항) ---</option>
                  <option value="배송전에 미리 연락바랍니다.">
                    배송전에 미리 연락바랍니다.
                  </option>
                  <option value="부재시 경비실에 맡겨주세요.">
                    부재시 경비실에 맡겨주세요.
                  </option>
                  <option value="부재시 문 앞에 놓아주세요.">
                    부재시 문 앞에 놓아주세요.
                  </option>
                  <option value="빠른 배송 부탁드립니다.">
                    빠른 배송 부탁드립니다.
                  </option>
                  <option value="택배함에 보관해 주세요.">
                    택배함에 보관해 주세요.
                  </option>
                  <option value="type">직접입력</option>
                </select>
                <textarea
                  className={cx(!showTextarea && 'hide')}
                  name="delivery_message_type"
                  rows={4}
                  value={addrInfo.message}
                  onChange={(event) =>
                    setAddrInfo({ ...addrInfo, message: event.target.value })
                  }
                ></textarea>
              </div>
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
    </>
  )
}

export default OrderPage
