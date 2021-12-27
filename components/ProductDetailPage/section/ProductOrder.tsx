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
  updateStorageLikes,
  userClickLike,
} from '@redux/features/userSlice'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import FavoriteIcon from '@mui/icons-material/Favorite'

interface ISelect {
  color: IColor | null
  size: string | null
}

interface IPick extends ISelect {
  num: number
}

interface IOrder {
  pid: string
  qty: number
  picks: IPick[]
}

interface IProductOrderProps {
  product: IProduct
}

const ProductOrder = ({ product }: IProductOrderProps) => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)

  const [isLike, setIsLike] = useState(false)
  const [select, setSelect] = useState<ISelect>({
    color: null,
    size: null,
  })
  const [picks, setPicks] = useState<IPick[]>([])
  const [order, setOrder] = useState<IOrder>({
    pid: product._id,
    qty: 0,
    picks: [],
  })

  const handleLikeClick = useCallback(() => {
    if (!user.isLogin) {
      dispatch(updateStorageLikes(product._id))
    } else {
      dispatch(userClickLike(product._id))
    }
  }, [product])

  const handleColorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const { textContent } = event.currentTarget
      const dataColor = event.currentTarget.getAttribute('data-color')
      if (textContent && dataColor) {
        setSelect({
          ...select,
          size: null,
          color:
            select.color?.colorName === textContent
              ? null
              : { colorName: textContent, colorHex: dataColor },
        })
      }
    },
    [select]
  )

  const handleSizeClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const { textContent } = event.currentTarget
      if (select.color !== null) {
        setSelect({
          ...select,
          size: select.size === textContent ? null : textContent,
        })
      }
    },
    [select]
  )

  const deletePick = useCallback(
    (deleteIndex: number) => {
      setOrder({ ...order, qty: order.qty - picks[deleteIndex].num })
      const newPicks = picks.filter((_, index) => index !== deleteIndex)
      setPicks(newPicks)
    },
    [picks, order]
  )

  const updatePickNum = useCallback(
    (existPickIndex: number, value: number) => {
      const newPicks = picks.map((pick, index) => {
        if (index === existPickIndex) {
          if (pick.num + value === 0) {
            alert('최소 주문 수량은 1개입니다.')
            return pick
          }
          setOrder({ ...order, qty: order.qty + value })
          return { ...pick, num: pick.num + value }
        } else {
          return pick
        }
      })

      setPicks(newPicks)
    },
    [picks, order]
  )

  useEffect(() => {
    setSelect({ color: null, size: null })
  }, [])

  useEffect(() => {
    // 상품을 사용자가 선택했을 때 주문목록에 추가
    if (select.size !== null) {
      // 같은 색상과 사이즈를 더 추가했는지 확인
      const existPickIndex = picks.findIndex(
        (pick) => pick.color === select.color && pick.size === select.size
      )

      if (existPickIndex !== -1) {
        // 기존에 추가한 상품인 경우 : 개수 증가
        updatePickNum(existPickIndex, 1)
      } else {
        // 새로운 상품 추가
        setPicks([...picks, { ...select, num: 1 }])
      }
      setOrder({ ...order, qty: order.qty + 1 })
    }
  }, [select.size])

  useEffect(() => {
    user.storage.likes.includes(product._id)
      ? setIsLike(true)
      : setIsLike(false)
  }, [user])

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
                className={cx(select.color === color && 'selectItem')}
                data-color={color.colorHex}
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
        {picks.length ? (
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
                {picks.map((pick, index) => (
                  <>
                    {index !== 0 && (
                      <Divider sx={{ margin: '1rem 1%', width: '98%' }} />
                    )}
                    <li className={cx('checkItem')} key={index}>
                      <button
                        className={cx('deleteBtn')}
                        onClick={() => deletePick(index)}
                      >
                        <CloseIcon />
                      </button>
                      <h3 className={cx('checkTitle')}>
                        {product.name}
                        <span>{`- ${pick.color?.colorName}/${pick.size}`}</span>
                      </h3>
                      <div className={cx('checkNum')}>
                        <button onClick={() => updatePickNum(index, -1)}>
                          －
                        </button>
                        <span>{pick.num}</span>
                        <button onClick={() => updatePickNum(index, 1)}>
                          +
                        </button>
                      </div>
                      <div className={cx('checkPrice')}>
                        <span>{pick.num * product.price}</span>
                      </div>
                    </li>
                  </>
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
            <span data-qty={`(${order.qty}개)`}>
              {product.price * order.qty}
            </span>
          </h2>
          <div className={styles.btnGroup}>
            <button
              className={cx('like', isLike && 'isLike')}
              onClick={handleLikeClick}
            >
              {!isLike ? <FavoriteBorderIcon /> : <FavoriteIcon />}
            </button>
            <button className={styles.cart}>장바구니</button>
            <button className={styles.buy}>구매하기</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductOrder
