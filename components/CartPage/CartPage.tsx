import styles from './CartPage.module.css'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import {
  IUserState,
  selectUser,
  userDeleteCart,
  userUpdateCart,
} from '@redux/features/userSlice'
import { IProduct } from '@models/Product'
import { IUserCart } from '@models/User'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import Link from 'next/link'
import Pagination from '@components/utils/Pagination/Pagination'
import * as delivery from 'public/data/delivery'
import CustomModal from '@components/utils/CustomModal/CustomModal'
import SelectOption from './section/SelectOption'
import { useRouter } from 'next/router'
import { IUserProduct } from 'pages/api/product/findProductsByOrders'

const displayNum = 10

interface IUpdate {
  index: number
  update: IUserCart
}

const CartPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)
  const userCart: IUserCart[] = useAppSelector(
    (state) => state.user.userData?.cart
  )

  const [update, setUpdate] = useState<IUpdate>({
    index: -1,
    update: {
      pid: '',
      qty: 0,
      option: {
        color: {
          colorName: '',
          colorHex: '',
        },
        size: '',
      },
    },
  })
  const [changeProduct, setChangeProduct] = useState<IProduct | null>(null)
  const [userProducts, setUserProducts] = useState<IUserProduct[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [checked, setChecked] = useState<boolean[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  // Modal Prop Function
  const handleSelect = (newOption: any) => {
    console.log('select')
    setUpdate({ ...update, update: { ...update.update, option: newOption } })
  }

  const handleSubmit = () => {
    console.log('submit')
    if (
      JSON.stringify(userCart[update.index].option) ===
      JSON.stringify(update.update.option)
    ) {
      return setChangeProduct(null)
    }

    dispatch(userUpdateCart(update))
    setUserProducts(
      userProducts.map((userProduct) => {
        if (userProduct.pid === update.update.pid) {
          return { ...userProduct, option: update.update.option }
        } else {
          return userProduct
        }
      })
    )
    setChangeProduct(null)
    alert('?????????????????????.')
  }

  // ????????? ??????
  const handleChangeQty = (index: number, addValue: number) => {
    const updateQty = userCart[index].qty + addValue
    if (updateQty < 1) {
      return alert('?????? ??????????????? 1??? ?????????.')
    }
    const body = {
      index,
      update: { ...userCart[index], qty: updateQty },
    }
    if (user.isLogin) {
      dispatch(userUpdateCart(body))
    }
    setUserProducts(
      userProducts.map((userProduct, i) => {
        if (i === index) {
          return { ...userProduct, qty: userProduct.qty + addValue }
        } else {
          return userProduct
        }
      })
    )
  }

  const handleChangeOption = (index: number, product: IProduct) => {
    setUpdate({
      index,
      update: { ...update.update, pid: product._id, qty: userCart[index].qty },
    })
    setChangeProduct(product)
  }

  const handleClickDelete = (dropIndex: number[]) => {
    if (confirm('????????? ?????????????????????????')) {
      if (user.isLogin) {
        dispatch(userDeleteCart(dropIndex))
      }
      setUserProducts(userProducts.filter((_, index) => index !== dropIndex[0]))
    }
  }

  const handleCheckedDelete = () => {
    if (confirm('????????? ?????????????????????????')) {
      const dropIndex: number[] = []
      const newUserProducts: IUserProduct[] = []
      checked.forEach((check, index) => {
        if (check) {
          dropIndex.push((pageIndex - 1) * displayNum + index)
        } else {
          newUserProducts.push(userProducts[index])
        }
      })

      if (!dropIndex.length) {
        return
      }

      if (user.isLogin) {
        dispatch(userDeleteCart(dropIndex))
      }
      setUserProducts(newUserProducts)
    }
  }

  const handleAllDelete = () => {
    if (confirm('????????? ?????????????????????????')) {
      const dropIndex = userCart.map((_, index) => index)
      if (user.isLogin) {
        dispatch(userDeleteCart(dropIndex))
      }

      setUserProducts([])
    }
  }

  const handleSelectOrder = () => {
    if (!checked.includes(true)) {
      return alert('????????? ????????? ????????????.')
    }

    const startIndex = (pageIndex - 1) * displayNum
    const cartIndex: number[] = []
    checked.forEach((check, index) => {
      if (check) {
        cartIndex.push(startIndex + index)
      }
    })
    router.push({
      pathname: '/user/order',
      query: { cartIndex },
    })
  }

  useEffect(() => {
    if (user.userData && user.userData.cart.length && !userProducts.length) {
      Axios.post('/api/product/findProductsByOrders', {
        orders: user.userData.cart,
      })
        .then((res) =>
          setUserProducts(res.data.userProducts ? res.data.userProducts : [])
        )
        .catch((error) => {
          console.log(error)
          setUserProducts([])
          return alert('???????????? ????????? ??????????????? ??????????????????.')
        })
    } else {
      setUserProducts([])
    }
  }, [])

  useEffect(() => {
    const length = userCart.length
    if (length) {
      length < displayNum * pageIndex
        ? setChecked(Array.from({ length: length % displayNum }, () => false))
        : setChecked(Array.from({ length: displayNum }, () => false))
    }
  }, [userProducts, pageIndex])

  useEffect(() => {
    let total = 0
    if (!checked.includes(true)) {
      userProducts.forEach((userProduct) => {
        total += userProduct.product.price * userProduct.qty
      })
      setTotalPrice(total)
    } else {
      const startIndex = (pageIndex - 1) * displayNum
      checked.forEach((check, index) => {
        if (check) {
          const userProduct = userProducts[startIndex + index]

          total += userProduct.product.price * userProduct.qty
        }
      })
      setTotalPrice(total)
    }
  }, [checked])

  return (
    <>
      <div className={styles.wrapper}>
        {/* ????????? ?????? */}
        <div className={styles.heading}>
          <h1>????????????</h1>
        </div>
        {/* ?????? ?????? */}
        <div className={styles.content}>
          <section className={cx('tag-container')}>
            {/* ????????? ?????? */}
            <ul>
              <li className={cx('basic', 'media2-n')}>
                <input
                  id="all"
                  type="checkbox"
                  value="all"
                  checked={!checked.includes(false)}
                  onChange={() =>
                    setChecked(
                      checked.map((_) =>
                        checked.includes(false) ? true : false
                      )
                    )
                  }
                />
              </li>
              <li className={cx('basic', 'media3-n')}></li>
              <li className={styles.epic} style={{ textAlign: 'center' }}>
                ????????????
              </li>
              <li className={cx('basic', 'media2-n')}>??????</li>
              <li className={cx('basic', 'media1')}>?????????</li>
              <li className={cx('basic', 'media2-n')}>??????</li>
              <li className={cx('basic', 'media3-n')}>??????</li>
            </ul>
          </section>
          {/* ????????? ????????? */}
          <section className={cx('product-container')}>
            {userProducts.map((userProduct, index) => {
              if (
                index + 1 <= pageIndex * displayNum &&
                index + 1 > (pageIndex - 1) * displayNum
              ) {
                return (
                  <div key={index} className={cx('product')}>
                    <div className={cx('product-check', 'basic', 'media2-n')}>
                      <input
                        id={`p${index}`}
                        type="checkbox"
                        value={index}
                        onChange={() =>
                          setChecked(
                            checked.map((check, i) =>
                              i === index % displayNum ? !check : check
                            )
                          )
                        }
                        checked={
                          checked.length ? checked[index % displayNum] : false
                        }
                      />
                    </div>
                    <div className={cx('product-img', 'basic')}>
                      <Link href={`/product/detail/${userProduct.product._id}`}>
                        <img
                          loading="lazy"
                          src={userProduct.product.image}
                          alt={userProduct.product.name}
                        />
                      </Link>
                    </div>
                    <div className={cx('product-info', 'epic')}>
                      <span className={cx('product-name')}>
                        <Link
                          href={`/product/detail/${userProduct.product._id}`}
                        >
                          {userProduct.product.name}
                        </Link>
                      </span>
                      <span className={cx('product-option')}>
                        {`[??????] ${userProduct.option.color.colorName}/${userProduct.option.size}`}
                      </span>
                      <span className={cx('product-option', 'media2-b')}>
                        {`[??????] ${userProduct.qty}`}
                      </span>
                      <span
                        className={cx('product-option', 'media2-b')}
                        style={{ marginBottom: '1rem' }}
                      >
                        {`[??????] ${
                          userProduct.qty * userProduct.product.price
                        }`}
                      </span>
                      <span
                        className={cx('product-change')}
                        onClick={() =>
                          handleChangeOption(index, userProduct.product)
                        }
                      >
                        ????????????
                      </span>
                      <div className={cx('product-select', 'media3-b')}>
                        <button
                          onClick={() =>
                            router.push({
                              pathname: '/user/order',
                              query: { cartIndex: index },
                            })
                          }
                        >
                          ????????????
                        </button>
                        <button onClick={() => handleClickDelete([index])}>
                          ??????
                        </button>
                      </div>
                    </div>
                    <div className={cx('product-qty', 'basic', 'media2-n')}>
                      <button onClick={() => handleChangeQty(index, -1)}>
                        ???
                      </button>
                      <span>{userProduct.qty}</span>
                      <button onClick={() => handleChangeQty(index, 1)}>
                        +
                      </button>
                    </div>
                    <div className={cx('product-delivery', 'basic', 'media1')}>
                      {delivery.delivery.toLocaleString('ko-KR')}
                    </div>
                    <div className={cx('product-price', 'basic', 'media2-n')}>
                      {(
                        userProduct.qty * userProduct.product.price
                      ).toLocaleString('ko-KR')}
                    </div>
                    <div className={cx('product-select', 'basic', 'media3-n')}>
                      <button
                        onClick={() =>
                          router.push({
                            pathname: '/user/order',
                            query: { cartIndex: index },
                          })
                        }
                      >
                        ????????????
                      </button>
                      <button onClick={() => handleClickDelete([index])}>
                        ??????
                      </button>
                    </div>
                  </div>
                )
              }
            })}
          </section>
          {userCart.length ? (
            <>
              {/* ?????? ????????? */}
              <section className={cx('controls-container')}>
                <div className={cx('selectControls')}>
                  <button onClick={handleAllDelete}>????????????</button>
                  <button
                    className={cx('media2-n')}
                    onClick={handleCheckedDelete}
                  >
                    ??????????????????
                  </button>
                </div>
              </section>

              <Pagination
                itemNum={userProducts.length}
                displayNum={displayNum}
                onChange={setPageIndex}
              />

              <section className={cx('pay')}>
                <div className={cx('pay-priceBox')}>
                  <div className={cx('pay-price-item')}>
                    <h3>???????????????</h3>
                    <span>{totalPrice.toLocaleString('ko-KR')}</span>
                  </div>
                  <span>+</span>
                  <div className={cx('pay-price-item')}>
                    <h3>?????????</h3>
                    <span>
                      {totalPrice < delivery.free_base
                        ? delivery.delivery.toLocaleString('ko-KR')
                        : 0}
                    </span>
                  </div>
                  <span>=</span>
                  <div className={cx('pay-price-item')}>
                    <h3>????????????</h3>
                    <span>
                      {totalPrice < delivery.free_base
                        ? (delivery.delivery + totalPrice).toLocaleString(
                            'ko-KR'
                          )
                        : totalPrice.toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
                <div className={cx('pay-btnBox')}>
                  <button
                    className={cx('pay-btn', 'pay-btn-white', 'media2-n')}
                    onClick={() => handleSelectOrder()}
                  >
                    ??????????????????
                  </button>
                  <button
                    className={cx('pay-btn', 'pay-btn-black')}
                    onClick={() => router.push('/user/order?cartIndex=all')}
                  >
                    ??????????????????
                  </button>
                </div>
              </section>
            </>
          ) : (
            <div className={cx('pay-btnBox')}>
              <button
                className={cx('pay-btn', 'pay-btn-white')}
                onClick={() => router.push('/')}
              >
                ??????????????????
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CustomModal
        title="????????????"
        submitText="??????"
        cancelText="??????"
        open={changeProduct !== null}
        onClose={() => setChangeProduct(null)}
        onSubmit={handleSubmit}
      >
        {!changeProduct ? (
          <></>
        ) : (
          <SelectOption product={changeProduct} onSelect={handleSelect} />
        )}
      </CustomModal>
    </>
  )
}

export default CartPage
