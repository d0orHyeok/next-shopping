import styles from './WishlistPage.module.css'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import {
  IUserState,
  selectUser,
  userDeleteLike,
  deleteStorageLikes,
} from '@redux/features/userSlice'
import { IProduct } from '@models/Product'
import Axios from 'axios'
import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import Link from 'next/link'
import Pagination from '@components/utils/Pagination/Pagination'
import * as delivery from 'public/data/delivery'

const displayNum = 10

const WishlistPage = () => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)

  const [products, setProducts] = useState<IProduct[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [checked, setChecked] = useState<boolean[]>([])

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checked.includes(false)) {
      event.target.checked && setChecked(checked.map((_) => true))
    } else {
      !event.target.checked && setChecked(checked.map((_) => false))
    }
  }

  const handleClickDelete = (pid: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      if (user.isLogin) {
        dispatch(userDeleteLike([pid]))
      }
      dispatch(deleteStorageLikes([pid]))
      setProducts(products.filter((product) => product._id !== pid))
    }
  }

  const handleCheckedDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      const deletePids: string[] = []
      checked.forEach((check, index) => {
        if (check) {
          deletePids.push(products[(pageIndex - 1) * displayNum + index]._id)
        }
      })
      if (deletePids.length) {
        if (user.isLogin) {
          dispatch(userDeleteLike(deletePids))
        }
        dispatch(deleteStorageLikes(deletePids))
        setProducts(
          products.filter((product) => !deletePids.includes(product._id))
        )
      }
    }
  }

  const handleAllDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      const deletePids = products.map((product) => product._id)

      if (user.isLogin) {
        dispatch(userDeleteLike(deletePids))
      }
      dispatch(deleteStorageLikes(deletePids))
      setProducts([])
    }
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
          <h1>위시리스트</h1>
        </div>
        <h2 className={styles.subTitle}>마이페이지</h2>
        <div className={styles.main}>
          {/* 유저 네비게이션 */}
          <nav className={styles.nav}>
            <div className={cx('nav-item')}>
              <h3 className={cx('nav-title')}>쇼핑 정보</h3>
              <ul>
                <li>
                  <Link href="#">주문/배송</Link>
                </li>
                <li>
                  <Link href="#">취소</Link>
                </li>
              </ul>
            </div>
            <div className={cx('nav-item')}>
              <h3 className={cx('nav-title')}>활동 정보</h3>
              <ul>
                <li>
                  <Link href="#">회원정보 수정</Link>
                </li>
                <li>
                  <Link href="#">회원탈퇴</Link>
                </li>
                <li>
                  <Link href="#">배송 주소 관리</Link>
                </li>
                <li>
                  <Link href="/user/wishlist">위시리스트</Link>
                </li>
                <li>
                  <Link href="/user/cart">장바구니</Link>
                </li>
              </ul>
            </div>
          </nav>

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
                    onChange={handleCheckAll}
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
                      </div>
                      <div className={cx('product-delivery', 'basic')}>
                        {delivery.delivery.toLocaleString('ko-KR')}
                      </div>
                      <div className={cx('product-price', 'basic')}>
                        {product.price.toLocaleString('ko-KR')}
                      </div>
                      <div className={cx('product-select', 'basic')}>
                        <Link href={`/product/detail/${product._id}`}>
                          <button>상품조회</button>
                        </Link>
                        <button onClick={() => handleClickDelete(product._id)}>
                          삭제
                        </button>
                      </div>
                    </div>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default WishlistPage
