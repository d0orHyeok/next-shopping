import styles from './CartPage.module.css'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { IUserState, selectUser } from '@redux/features/userSlice'
import { IProduct } from '@models/Product'
import Axios from 'axios'
import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import Link from 'next/link'
import Pagination from '@components/utils/Pagination/Pagination'
import * as delivery from 'public/data/delivery'

const displayNum = 10

const CartPage = () => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)

  const [products, setProducts] = useState<IProduct[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [checked, setChecked] = useState<boolean[]>([])

  const handleCheckAll = () => {
    checked.includes(false)
      ? setChecked(checked.map((_) => true))
      : setChecked(checked.map((_) => false))
  }

  useEffect(() => {
    Axios.post('/api/product/findProductsByIds', {
      ids: user.storage.likes,
    }).then((res) => setProducts(res.data.products))
  }, [])

  useEffect(() => {
    const length = products.length
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
        <div className={styles.main}>
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
                <li className={styles.basic}>배송비</li>
                <li className={styles.basic}>합계</li>
                <li className={styles.basic}>선택</li>
              </ul>
            </section>
            {/* 테이블 아이템 */}
            <section className={cx('product-container')}>
              {products.map((product, index) => {
                if (
                  index + 1 <= pageIndex * displayNum &&
                  index + 1 > (pageIndex - 1) * displayNum
                ) {
                  return (
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
                        <span className={cx('product-option')}>옵션선택</span>
                      </div>
                      <div className={cx('product-delivery', 'basic')}>
                        {delivery.delivery.toLocaleString('ko-KR')}
                      </div>
                      <div className={cx('product-price', 'basic')}>
                        {product.price.toLocaleString('ko-KR')}
                      </div>
                      <div className={cx('product-select', 'basic')}>
                        <button>주문하기</button>
                        <button>삭제</button>
                      </div>
                    </div>
                  )
                }
              })}
            </section>
            {/* 상품 컨트롤 */}
            <section className={cx('controls-container')}>
              <div className={cx('selectControls')}>
                <button>전체삭제</button>
                <button>선택상품삭제</button>
              </div>
            </section>
            <Pagination
              itemNum={products.length}
              displayNum={displayNum}
              onChange={setPageIndex}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage
