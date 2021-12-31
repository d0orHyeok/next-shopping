import styles from './CartPage.module.css'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import {
  IUserState,
  selectUser,
  deleteStorageCart,
  userDeleteCart,
  userUpdateCart,
  updateStorageCart,
} from '@redux/features/userSlice'
import { IProduct } from '@models/Product'
import { IUserCart } from '@models/User'
import Axios from 'axios'
import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import Link from 'next/link'
import Pagination from '@components/utils/Pagination/Pagination'
import * as delivery from 'public/data/delivery'
import CustomModal from '@components/utils/CustomModal/CustomModal'
import SelectOption from './section/SelectOption'

const displayNum = 10

interface IUpdate {
  index: number
  update: IUserCart
}

const CartPage = () => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)
  const userCart: IUserCart[] = useAppSelector(
    (state) => state.user.storage.cart
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
  const [products, setProducts] = useState<IProduct[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [checked, setChecked] = useState<boolean[]>([])

  const handleCheckAll = () => {
    checked.includes(false)
      ? setChecked(checked.map((_) => true))
      : setChecked(checked.map((_) => false))
  }

  // Modal Prop Function
  const handleSelect = (newOption: any) => {
    setUpdate({ ...update, update: { ...update.update, option: newOption } })
  }

  const handleSubmit = () => {
    if (
      JSON.stringify(userCart[update.index]) !== JSON.stringify(update.update)
    ) {
      if (user.isLogin) {
        dispatch(userUpdateCart(update))
      }
      dispatch(updateStorageCart(update))
    }
    setChangeProduct(null)
    alert('변경되었습니다.')
  }

  // 이벤트 함수
  const handleChangeQty = (index: number, addValue: number) => {
    const updateQty = userCart[index].qty + addValue
    if (updateQty < 1) {
      return alert('최소 주문수량은 1개 입니다.')
    }
    const body = {
      index,
      update: { ...userCart[index], qty: userCart[index].qty + addValue },
    }
    if (user.isLogin) {
      dispatch(userUpdateCart(body))
    }
    dispatch(updateStorageCart(body))
  }

  const handleChangeOption = (index: number, product: IProduct) => {
    setUpdate({
      index,
      update: { ...update.update, pid: product._id, qty: userCart[index].qty },
    })
    setChangeProduct(product)
  }

  const handleClickDelete = (dropIndex: number[]) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      if (user.isLogin) {
        dispatch(userDeleteCart(dropIndex))
      }
      dispatch(deleteStorageCart(dropIndex))
    }
  }

  const handleCheckedDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      const dropIndex: number[] = []
      checked.forEach((check, index) => {
        if (check) {
          dropIndex.push((pageIndex - 1) * displayNum + index)
        }
      })

      if (!dropIndex.length) {
        return
      }

      if (user.isLogin) {
        dispatch(userDeleteCart(dropIndex))
      }
      dispatch(deleteStorageCart(dropIndex))
    }
  }

  const handleAllDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      const dropIndex = userCart.map((_, index) => index)
      if (user.isLogin) {
        dispatch(userDeleteCart(dropIndex))
      }
      dispatch(deleteStorageCart(dropIndex))
    }
  }

  useEffect(() => {
    Axios.post('/api/product/findProductsByIds', {
      ids: userCart.map((order) => order.pid),
    }).then((res) => setProducts(res.data.products))
  }, [])

  useEffect(() => {
    const length = userCart.length
    if (length) {
      length < displayNum * pageIndex
        ? setChecked(Array.from({ length: length % displayNum }, () => false))
        : setChecked(Array.from({ length: displayNum }, () => false))
    }
  }, [products, pageIndex])

  return (
    <>
      <div className={styles.wrapper}>
        {/* 페이지 제목 */}
        <div className={styles.heading}>
          <h1>장바구니</h1>
        </div>
        {/* 담긴 상품 */}
        <div className={styles.content}>
          <section className={cx('tag-container')}>
            {/* 테이블 제목 */}
            <ul>
              <li className={styles.basic}>
                <input
                  id="all"
                  type="checkbox"
                  value="all"
                  onChange={() => handleCheckAll()}
                />
              </li>
              <li className={styles.basic}></li>
              <li className={styles.epic}>상품정보</li>
              <li className={styles.basic}>수량</li>
              <li className={styles.basic}>배송비</li>
              <li className={styles.basic}>합계</li>
              <li className={styles.basic}>선택</li>
            </ul>
          </section>
          {/* 테이블 아이템 */}
          <section className={cx('product-container')}>
            {userCart.map((order, index) => {
              if (
                index + 1 <= pageIndex * displayNum &&
                index + 1 > (pageIndex - 1) * displayNum
              ) {
                const product = products.find((p) => p._id === order.pid)
                return (
                  product && (
                    <div key={index} className={cx('product')}>
                      <div className={cx('product-check', 'basic')}>
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
                        <Link href={`/product/detail/${product._id}`}>
                          <img src={product.image} alt={product.name} />
                        </Link>
                      </div>
                      <div className={cx('product-info', 'epic')}>
                        <span className={cx('product-name')}>
                          <Link href={`/product/detail/${product._id}`}>
                            {product.name}
                          </Link>
                        </span>
                        <span
                          className={cx('product-option')}
                        >{`[옵션] ${order.option.color.colorName}/${order.option.size}`}</span>
                        <span
                          className={cx('product-change')}
                          onClick={() => handleChangeOption(index, product)}
                        >
                          옵션변경
                        </span>
                      </div>
                      <div className={cx('product-qty', 'basic')}>
                        <button onClick={() => handleChangeQty(index, -1)}>
                          －
                        </button>
                        <span>{order.qty}</span>
                        <button onClick={() => handleChangeQty(index, 1)}>
                          +
                        </button>
                      </div>
                      <div className={cx('product-delivery', 'basic')}>
                        {delivery.delivery.toLocaleString('ko-KR')}
                      </div>
                      <div className={cx('product-price', 'basic')}>
                        {product.price.toLocaleString('ko-KR')}
                      </div>
                      <div className={cx('product-select', 'basic')}>
                        <button>주문하기</button>
                        <button onClick={() => handleClickDelete([index])}>
                          삭제
                        </button>
                      </div>
                    </div>
                  )
                )
              }
            })}
          </section>
          {/* 상품 컨트롤 */}
          <section className={cx('controls-container')}>
            <div className={cx('selectControls')}>
              <button onClick={handleAllDelete}>전체삭제</button>
              <button onClick={handleCheckedDelete}>선택상품삭제</button>
            </div>
          </section>
          <Pagination
            itemNum={products.length}
            displayNum={displayNum}
            onChange={setPageIndex}
          />
          <div></div>
        </div>
      </div>

      {/* Modal */}
      <CustomModal
        title="옵션변경"
        submitText="변경"
        cancelText="취소"
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
