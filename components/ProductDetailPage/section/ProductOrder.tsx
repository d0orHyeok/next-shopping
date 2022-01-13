import styles from './ProductOrder.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import { Divider } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { IProduct, IColor } from '@models/Product'
import {
  selectUser,
  IUserState,
  userAddLike,
  userDeleteLike,
  addStorageCart,
  userAddCart,
} from '@redux/features/userSlice'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AddCartModal from '@components/utils/AddCartModal/AddCartModal'
import { IUserCart } from '@models/User'
import { useRouter } from 'next/router'

interface ISelect {
  color: IColor | null
  size: string | null
}

interface IProductOrderProps {
  product: IProduct
}

const ProductOrder = ({ product }: IProductOrderProps) => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [isLike, setIsLike] = useState(false)
  const [select, setSelect] = useState<ISelect>({
    color: null,
    size: null,
  })
  const [orders, setOrders] = useState<IUserCart[]>([])
  const [totalQty, setTotalQty] = useState(0)

  const handleLikeClick = useCallback(
    (isDelete: boolean) => {
      if (!user.isLogin) {
        return alert('로그인 시 이용가능합니다.')
      }
      const pid = [product._id]
      isDelete ? dispatch(userDeleteLike(pid)) : dispatch(userAddLike(pid))
    },
    [product]
  )

  const handleCartClick = () => {
    if (!orders.length) {
      alert('상품을 선택해 주세요.')
    } else {
      if (user.isLogin) {
        dispatch(userAddCart(orders))
      } else {
        dispatch(addStorageCart(orders))
      }
      setOpen(true)
    }
  }

  const handleClickBuy = () => {
    if (!orders.length) {
      return alert('상품을 선택해 주세요.')
    }

    const orderQuery = JSON.stringify(orders)
    router.push({ pathname: '/user/order', query: { orders: orderQuery } })
  }

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    const { textContent } = event.currentTarget
    const dataColor = event.currentTarget.getAttribute('data-color')
    if (textContent && dataColor) {
      const setColor =
        select.color?.colorName === textContent ? null : JSON.parse(dataColor)
      setSelect({ size: null, color: setColor })
    }
  }

  const handleSizeClick = (event: React.MouseEvent<HTMLElement>) => {
    const { textContent } = event.currentTarget
    if (select.color !== null) {
      const newSelect = { ...select, size: textContent }
      updateOrders(newSelect)
      setSelect({ color: null, size: null })
    }
  }

  const deleteOrder = (deleteIndex: number) => {
    const newOrders = orders.filter((order, index) => {
      if (index === deleteIndex) {
        setTotalQty(totalQty - order.qty)
        return false
      }
      return true
    })
    setOrders(newOrders)
  }

  const updateOrderQty = (existOrderIndex: number, value: number) => {
    const newOrders = orders.map((order, index) => {
      if (index === existOrderIndex) {
        if (order.qty + value === 0) {
          alert('최소 주문 수량은 1개입니다.')
          return order
        } else {
          setTotalQty(totalQty + value)
          return { ...order, qty: order.qty + value }
        }
      } else {
        return order
      }
    })

    setOrders(newOrders)
  }

  const updateOrders = (select: ISelect) => {
    // 상품을 사용자가 선택했을 때 주문목록에 추가
    if (select.color && select.size) {
      const existOrderIndex = orders.findIndex(
        (order) => JSON.stringify(order.option) === JSON.stringify(select)
      )
      if (existOrderIndex !== -1) {
        // 기존에 추가한 상품인 경우 : 개수 증가
        updateOrderQty(existOrderIndex, 1)
      } else {
        // 새로운 상품 추가
        setOrders([
          ...orders,
          {
            pid: product._id,
            qty: 1,
            option: { color: select.color, size: select.size },
          },
        ])
      }
      setTotalQty(totalQty + 1)
    }
  }

  useEffect(() => {
    if (user.isLogin && user.userData) {
      user.userData.likes.includes(product._id)
        ? setIsLike(true)
        : setIsLike(false)
    }
  }, [user.userData?.likes])

  return (
    <>
      <div className={cx('wrapper')}>
        <div className={cx('desc')}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{product.price}</p>
        </div>
        <Divider sx={{ margin: '1rem 1%', width: '98%' }} />
        <div className={cx('select')}>
          <h2 className={styles.selectTitle}>Color</h2>
          <div
            className={cx('colorBox', 'selectBox')}
            data-select={
              select.color === null
                ? '[필수] 옵션을 선택해 주세요'
                : `[필수] ${select.color.colorName}`
            }
          >
            {product.colors.map((color, index) => (
              <button
                key={index}
                className={cx(
                  JSON.stringify(select.color) === JSON.stringify(color) &&
                    'selectItem'
                )}
                data-color={JSON.stringify(color)}
                onClick={handleColorClick}
              >
                {color.colorName}
              </button>
            ))}
          </div>
          <h2 className={styles.selectTitle}>Size</h2>
          <div
            className={cx('sizeBox', 'selectBox')}
            data-select={
              select.size === null
                ? '[필수] 옵션을 선택해 주세요'
                : `[필수] ${select.size}`
            }
          >
            {product.sizes.map((size, index) => (
              <button
                key={index}
                className={cx(
                  size === select.size && 'selectItem',
                  !select.color && 'preventItem'
                )}
                onClick={handleSizeClick}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        {/* 담은 상품 내역 */}
        {orders.length ? (
          <>
            <Divider
              sx={{
                margin: '1rem 1%',
                width: '98%',
                backgroundColor: 'gray',
              }}
            />
            <div className={cx('check')}>
              <ul>
                {orders.map((order, index) => (
                  <li key={index}>
                    {index !== 0 && (
                      <Divider sx={{ margin: '1rem 1%', width: '98%' }} />
                    )}
                    <div className={cx('checkItem')}>
                      <button
                        className={cx('deleteBtn')}
                        onClick={() => deleteOrder(index)}
                      >
                        <CloseIcon />
                      </button>
                      <h3 className={cx('checkTitle')}>
                        {product.name}
                        <span>{`- ${order.option.color?.colorName}/${order.option.size}`}</span>
                      </h3>
                      <div className={cx('checkNum')}>
                        <button onClick={() => updateOrderQty(index, -1)}>
                          －
                        </button>
                        <span>{order.qty}</span>
                        <button onClick={() => updateOrderQty(index, 1)}>
                          +
                        </button>
                      </div>
                      <div className={cx('checkPrice')}>
                        <span>{order.qty * product.price}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <></>
        )}
        <Divider sx={{ margin: '1rem 1%', width: '98%' }} />
        <div className={cx('take')}>
          <h2 className={styles.totalPrice}>
            총 상품금액
            <span data-qty={`(${totalQty}개)`}>{product.price * totalQty}</span>
          </h2>
          <div className={styles.btnGroup}>
            <button
              className={cx('like', isLike && 'isLike')}
              onClick={() => handleLikeClick(isLike)}
            >
              {!isLike ? <FavoriteBorderIcon /> : <FavoriteIcon />}
            </button>
            <button className={styles.cart} onClick={handleCartClick}>
              장바구니
            </button>
            <button className={styles.buy} onClick={handleClickBuy}>
              구매하기
            </button>
          </div>
        </div>
      </div>
      <AddCartModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default ProductOrder
