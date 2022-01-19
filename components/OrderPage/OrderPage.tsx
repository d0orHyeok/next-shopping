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
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import {
  selectUser,
  IUserState,
  getLikesCart,
  userUpdateDeliveryAddrs,
  userDeleteCart,
} from '@redux/features/userSlice'
import React, { useEffect, useRef, useState } from 'react'
import DaumPostCodeModal from '@components/utils/DaumPostCodeModal/DaumPostCodeModal'
import Axios from 'axios'
import { IUserProduct } from 'pages/api/product/findProductsByOrders'
import { IUserCart } from '@models/User'
import OrderCard from './section/OrderCard'
import * as delivery from 'public/data/delivery'
import Payment from './section/Payment'
import { ParsedUrlQuery } from 'querystring'
import CheckIcon from '@mui/icons-material/Check'

interface IOrderPageQuery extends ParsedUrlQuery {
  orders: string
  cartIndex: 'all' | string | string[]
}

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
  const numberRegex = /[^0-9]/g

  const router = useRouter()
  const dispatch = useAppDispatch()

  const user: IUserState = useAppSelector(selectUser)

  const orderInfoRef = useRef<HTMLDivElement>(null)
  const addrInfoRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [showTextarea, setShowTextarea] = useState(false)
  const [isShow, setIsShow] = useState([true, true, false, true])
  const [switchTab, setSwitchTab] = useState(true)
  const [showAddrList, setShowAddrList] = useState(false)
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: { email_id: '', email_domain: '' },
    phone: { phone1: '', phone2: '', phone3: '' },
  })
  const [selectAddrIndex, setSelectAddrIndex] = useState(-1)
  const [addrInfo, setAddrInfo] = useState({
    name: '',
    address: { zonecode: '', baseAddress: '', extraAddress: '' },
    phone: { phone1: '', phone2: '', phone3: '' },
    message: '',
  })
  const [radioCheck, setRadioCheck] = useState([true, false])
  const [termsCheck, setTermsCheck] = useState([false, false, false])
  const [userProducts, setUserProducts] = useState<IUserProduct[]>([])
  const [paymentPrice, setPaymentPrice] = useState({
    totalPrice: 0,
    deliveryPrice: delivery.delivery,
    deliveryAddPrice: 0,
  })

  useEffect(() => {
    dispatch(getLikesCart())
  }, [])

  useEffect(() => {
    if (user.isLogin && user.userData) {
      const email = user.userData.email.split('@')
      setOrderInfo({
        ...orderInfo,
        name: user.userData.name,
        email: { email_id: email[0], email_domain: email[1] },
      })
      const fixAddr = user.userData.deliveryAddrs.findIndex(
        (addr) => addr.fix === true
      )

      const userOrderInfo = {
        name: user.userData.name,
        email: { email_id: email[0], email_domain: email[1] },
      }

      if (fixAddr !== -1) {
        const existPhone = user.userData.deliveryAddrs[fixAddr].phone.split('-')
        setOrderInfo({
          ...orderInfo,
          ...userOrderInfo,
          phone: {
            phone1: existPhone[0],
            phone2: existPhone[1],
            phone3: existPhone[2],
          },
        })
      } else {
        setOrderInfo({ ...orderInfo, ...userOrderInfo })
      }

      fixAddr !== -1 ? setSwitchTab(false) : setSwitchTab(true)
      setSelectAddrIndex(fixAddr)
    }
  }, [user.userData])

  useEffect(() => {
    const { cartIndex, orders } = router.query as IOrderPageQuery

    let reqOrders: IUserCart[] = []

    if (orders !== undefined) {
      reqOrders = JSON.parse(orders)
    } else if (cartIndex !== undefined) {
      if (cartIndex === 'all') {
        reqOrders = user.storage.cart
      } else {
        reqOrders = user.storage.cart.filter((_, index) =>
          Array.isArray(cartIndex)
            ? cartIndex.includes(index.toString())
            : cartIndex === index.toString()
        )
      }
    } else {
      alert('잘못된 접근입니다.')
      return router.back()
    }

    Axios.post('/api/product/findProductsByOrders', { orders: reqOrders })
      .then((res) => setUserProducts(res.data.userProducts))
      .catch((error) => {
        console.log(error)
        alert('오류가 발생하여 결제를 진행할 수 없습니다.')
        router.back()
      })
  }, [router.query, user.storage])

  useEffect(() => {
    let price = 0
    userProducts.forEach((userProduct) => {
      price += userProduct.qty * userProduct.product.price
    })
    setPaymentPrice({
      ...paymentPrice,
      totalPrice: price,
      deliveryPrice: price < delivery.free_base ? delivery.delivery : 0,
    })
  }, [userProducts])

  useEffect(() => {
    delivery.isAdd(parseInt(addrInfo.address.zonecode)) &&
      setPaymentPrice({
        ...paymentPrice,
        deliveryAddPrice: delivery.delivery_add,
      })
  }, [addrInfo])

  const handleOrderInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, name, value } = event.target

    if (id === name) {
      setOrderInfo({ ...orderInfo, [name]: value })
      if (radioCheck[0]) {
        setAddrInfo({ ...addrInfo, [name]: value })
      }
    } else {
      if (name === 'email') {
        setOrderInfo({
          ...orderInfo,
          [name]: { ...orderInfo.email, [id]: value },
        })
      } else {
        if (!numberRegex.test(value)) {
          setOrderInfo({
            ...orderInfo,
            [name]: { ...orderInfo.phone, [id]: value },
          })
          if (radioCheck[0]) {
            setAddrInfo({
              ...addrInfo,
              [name]: { ...addrInfo.phone, [id]: value },
            })
          }
        }
      }
    }
  }

  const handleAddrInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = event.currentTarget

    if (name === 'name') {
      setAddrInfo({ ...addrInfo, [name]: value })
    } else {
      if (name === 'address') {
        if (id === 'zonecode' && numberRegex.test(value)) {
          return
        }
        setAddrInfo({
          ...addrInfo,
          [name]: { ...addrInfo.address, [id]: value },
        })
      } else {
        !numberRegex.test(value) &&
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
      setRadioCheck([false, true])
      setAddrInfo({
        ...addrInfo,
        name: '',
        phone: { phone1: '', phone2: '', phone3: '' },
      })
    } else {
      setRadioCheck([true, false])
      setAddrInfo({ ...addrInfo, name: orderInfo.name, phone: orderInfo.phone })
    }
  }

  const handleChangeTermsCheck = (changeIndex: number) => {
    setTermsCheck(
      termsCheck.map((checked, index) =>
        index === changeIndex ? !checked : checked
      )
    )
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

  const handleAddrSearchSubmit = (zonecode: string, baseAddress: string) => {
    setAddrInfo({
      ...addrInfo,
      address: { zonecode, baseAddress, extraAddress: '' },
    })
  }

  const checkPaymentData = () => {
    if (
      orderInfo.name === '' ||
      orderInfo.email.email_id === '' ||
      orderInfo.email.email_domain === '' ||
      orderInfo.phone.phone1 === '' ||
      orderInfo.phone.phone2 === '' ||
      orderInfo.phone.phone3 === ''
    ) {
      orderInfoRef.current?.scrollIntoView({ behavior: 'smooth' })
      return alert('주문자정보를 입력해주세요.')
    }

    const email = `${orderInfo.email.email_id.trim()}@${orderInfo.email.email_domain.trim()}`
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/
    if (!emailRegex.test(email)) {
      return alert('잘못된 이메일정보 입니다.')
    }

    if (!switchTab && user.userData) {
      if (selectAddrIndex === -1) {
        setSwitchTab(true)
        addrInfoRef.current?.scrollIntoView({ behavior: 'smooth' })
        return alert('선택된 배송지가 없습니다.\n배송정보를 입력해주세요.')
      }

      const { picker, phone, address } =
        user.userData?.deliveryAddrs[selectAddrIndex]

      const delivery_info = {
        picker,
        phone,
        email,
        address,
        message: addrInfo.message,
      }
      return {
        order_name: orderInfo.name,
        delivery_info,
        uid: user.userData?._id,
      }
    }

    if (
      addrInfo.name === '' ||
      addrInfo.address.zonecode === '' ||
      addrInfo.address.baseAddress === '' ||
      addrInfo.phone.phone1 === '' ||
      addrInfo.phone.phone2 === '' ||
      addrInfo.phone.phone3 === ''
    ) {
      setSwitchTab(true)
      addrInfoRef.current?.scrollIntoView({ behavior: 'smooth' })

      return alert('배송정보를 입력해주세요.')
    }
    if (termsCheck[0] === false || termsCheck[1] === false) {
      return alert('약관 동의가 필요합니다.')
    }

    const nameRegex = /[^ㄱ-ㅎ|가-힣|a-z|A-Z|\s]/g
    const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/
    // eslint-disable-next-line no-useless-escape
    const addressRegex = /^[가-힣a-zA-Z\s0-9\-\_\(\)]+$/

    const picker = addrInfo.name.trim()
    const phone = `${addrInfo.phone.phone1}-${addrInfo.phone.phone2}-${addrInfo.phone.phone3}`
    const address = `${addrInfo.address.zonecode.trim()} ${addrInfo.address.baseAddress.trim()} ${addrInfo.address.extraAddress.trim()}`

    if (nameRegex.test(picker)) {
      return alert('이름을 올바르게 입력해주세요.')
    }
    if (!phoneRegex.test(phone)) {
      return alert('잘못된 휴대전화번호 입니다.')
    }

    if (!addressRegex.test(address)) {
      return alert('주소를 바르게 입력해 주세요')
    }

    if (user.userData) {
      const newAddr = {
        fix: user.userData.deliveryAddrs.length !== 0 ? false : true,
        picker,
        addressName: '신규배송지',
        address,
        phone,
      }

      const updateAddrs = [...user.userData.deliveryAddrs, newAddr]
      dispatch(userUpdateDeliveryAddrs(updateAddrs))
    }

    const delivery_info = {
      picker,
      phone,
      email,
      address,
      message: addrInfo.message,
    }

    return {
      order_name: orderInfo.name,
      delivery_info,
      uid: user.userData?._id,
    }
  }

  const onPaymentSuccess = (order_id: string) => {
    const { cartIndex, orders } = router.query as IOrderPageQuery

    let dropIndex: number[] = []

    if (user.userData) {
      if (cartIndex === 'all') {
        dropIndex = user.userData.cart.map((_, index) => index)
      }
    } else {
      dropIndex = Array.isArray(cartIndex)
        ? cartIndex.map((index) => parseInt(index))
        : [parseInt(cartIndex)]
    }

    dispatch(userDeleteCart(dropIndex))

    const parseOrders: IUserCart[] = JSON.parse(orders)
    parseOrders.forEach((order) => {
      Axios.post('/api/product/updateProduct', {
        pid: order.pid,
        update: { $inc: { sold: order.qty } },
      })
    })

    router.push({
      pathname: '/user/order/result',
      query: { order_id, result: '성공' },
    })
  }

  return (
    <>
      <DaumPostCodeModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddrSearchSubmit}
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
              {user.isLogin && (
                <button
                  style={{ marginLeft: '1rem' }}
                  onClick={() => router.push('/user/mypage')}
                >
                  <PersonOutlineIcon sx={{ transform: 'translateY(4px)' }} />
                </button>
              )}
            </div>
          </section>
          {/* 주문 내용 */}
          <section className={cx('main')}>
            <h1>주문/결제</h1>
            {/* 주문자 정보 */}
            <div ref={orderInfoRef} className={cx('box')}>
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
                      maxLength={3}
                      value={orderInfo.phone.phone1}
                      onChange={handleOrderInfoChange}
                    />
                    <span>-</span>
                    <input
                      type="text"
                      id="phone2"
                      name="phone"
                      maxLength={4}
                      value={orderInfo.phone.phone2}
                      onChange={handleOrderInfoChange}
                    />
                    <span>-</span>
                    <input
                      type="text"
                      id="phone3"
                      name="phone"
                      maxLength={4}
                      value={orderInfo.phone.phone3}
                      onChange={handleOrderInfoChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 배송방법 */}
            <div ref={addrInfoRef} className={cx('box')}>
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
                <div className={cx('selectAddr')}>
                  <button
                    className={cx('selectAddrBtn', !switchTab && 'switchBtn')}
                    onClick={() => setSwitchTab(false)}
                  >
                    최근 배송지
                  </button>
                  <button
                    className={cx('selectAddrBtn', switchTab && 'switchBtn')}
                    onClick={() => setSwitchTab(true)}
                  >
                    직접입력
                  </button>
                </div>
                {switchTab ? (
                  <div className={cx('address')}>
                    <div className={cx('address-radio')}>
                      <ul>
                        <li>
                          <input
                            id="addr-user"
                            name="addr"
                            type="radio"
                            checked={radioCheck[0]}
                            onChange={handleAddrRadioChange}
                          />
                          <label htmlFor="addr-user">주문자 정보와 동일</label>
                        </li>
                        <li>
                          <input
                            id="addr-new"
                            name="addr"
                            type="radio"
                            checked={radioCheck[1]}
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
                              maxLength={5}
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
                ) : (
                  <div className={cx('address')}>
                    <div className={cx('address-buttons')}>
                      <h3>{!showAddrList ? '' : '배송지를 선택해주세요.'}</h3>
                      <button
                        className={cx('addressListBtn')}
                        onClick={() => setShowAddrList(!showAddrList)}
                      >
                        {!showAddrList ? '배송지목록' : '닫기'}
                      </button>
                    </div>
                    {!showAddrList ? (
                      selectAddrIndex !== -1 && (
                        <div className={cx('address-select')}>
                          <span>{`${
                            user.userData?.deliveryAddrs[selectAddrIndex].fix
                              ? '[기본] '
                              : ''
                          }${
                            user.userData?.deliveryAddrs[selectAddrIndex].picker
                          }`}</span>
                          <span>
                            {
                              user.userData?.deliveryAddrs[selectAddrIndex]
                                .address
                            }
                          </span>
                          <span>
                            {
                              user.userData?.deliveryAddrs[selectAddrIndex]
                                .phone
                            }
                          </span>
                        </div>
                      )
                    ) : (
                      <ul className={cx('address-list')}>
                        {user.userData?.deliveryAddrs.map((addr, index) => (
                          <li key={index}>
                            <div className={cx('address-select')}>
                              <span>{`${addr.fix ? '[기본] ' : ''}${
                                addr.picker
                              }`}</span>
                              <span>{addr.address}</span>
                              <span>{addr.phone}</span>
                            </div>
                            <button
                              className={cx(
                                'checkBtn',
                                selectAddrIndex === index && 'checkedBtn'
                              )}
                              onClick={() => {
                                setSelectAddrIndex(index)
                                setShowAddrList(false)
                              }}
                            >
                              <CheckIcon />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div
                className={cx(
                  'content',
                  'topline',
                  'addr-select',
                  !isShow[1] && 'hide'
                )}
                style={{ backgroundColor: 'whitesmoke' }}
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
              <div className={cx('content', 'orderlist', !isShow[2] && 'hide')}>
                <ul>
                  {userProducts.map((userProduct, index) => (
                    <li key={index}>
                      <OrderCard userProduct={userProduct} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 결제정보 */}
            <div className={cx('box')}>
              <h2 className={cx('title')}>
                결제정보
                {drawShowButton(3)}
              </h2>
              <div
                className={cx('content', 'payment-Info', !isShow[3] && 'hide')}
              >
                <div className={cx('price-calcBox')}>
                  <ul>
                    <li>
                      <span>주문금액</span>
                      <span>
                        {paymentPrice.totalPrice.toLocaleString('ko-KR')}
                      </span>
                    </li>
                    <li>
                      <span>배송비</span>
                      <span>
                        {`+${(
                          paymentPrice.deliveryPrice +
                          paymentPrice.deliveryAddPrice
                        ).toLocaleString('ko-KR')}`}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className={cx('price-resultbox')}>
                  <h3>결제금액</h3>
                  <span>
                    {(
                      paymentPrice.deliveryPrice +
                      paymentPrice.totalPrice +
                      paymentPrice.deliveryAddPrice
                    ).toLocaleString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>

            {/* 약관 */}
            <div className={cx('box', 'terms')}>
              <h2 className={cx('title')}>
                <input
                  id="terms-check-all"
                  type="checkbox"
                  className={cx('terms-check')}
                  checked={!termsCheck.includes(false)}
                  onChange={() =>
                    setTermsCheck(
                      termsCheck.map((_) =>
                        termsCheck.includes(false) ? true : false
                      )
                    )
                  }
                />
                <label htmlFor="terms-check-all">모든 약관 동의</label>
              </h2>
              <div className={cx('content')}>
                <div className={cx('terms-container')}>
                  <input
                    id="terms-check-1"
                    type="checkbox"
                    className={cx('terms-check')}
                    checked={termsCheck[0]}
                    onChange={() => handleChangeTermsCheck(0)}
                  />
                  <label htmlFor="terms-check-1">
                    {'[필수] 결제서비스 이용약관 동의'}
                  </label>
                </div>
                <div className={cx('terms-container')}>
                  <input
                    id="terms-check-2"
                    type="checkbox"
                    className={cx('terms-check')}
                    checked={termsCheck[1]}
                    onChange={() => handleChangeTermsCheck(1)}
                  />
                  <label htmlFor="terms-check-2">
                    {'[필수] 쇼핑몰 이용약관 동의'}
                  </label>
                </div>
                <div className={cx('terms-container')}>
                  <input
                    id="terms-check-3"
                    type="checkbox"
                    className={cx('terms-check')}
                    checked={termsCheck[2]}
                    onChange={() => handleChangeTermsCheck(2)}
                  />
                  <label htmlFor="terms-check-3">
                    {'[선택] 청약철회방침 동의'}
                  </label>
                </div>
              </div>
            </div>
            {/* 결제버튼 */}
            <div className={cx('paymentBox')}>
              <Payment
                className={cx('payBtn')}
                orders={userProducts}
                totalPrice={
                  paymentPrice.totalPrice +
                  paymentPrice.deliveryPrice +
                  paymentPrice.deliveryAddPrice
                }
                passData={checkPaymentData}
                onSuccess={onPaymentSuccess}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default OrderPage
