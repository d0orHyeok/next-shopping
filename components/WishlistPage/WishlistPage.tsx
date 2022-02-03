import styles from './WishlistPage.module.css'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import {
  IUserState,
  selectUser,
  userDeleteLike,
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

  const handleClickDelete = (pid: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      if (user.isLogin) {
        dispatch(userDeleteLike([pid]))
      }
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
      setProducts([])
    }
  }

  useEffect(() => {
    if (user.userData && user.userData.likes.length && !products.length) {
      Axios.post('/api/product/findProductsByIds', {
        ids: user.userData.likes,
      }).then((res) => setProducts(res.data.products))
    }
  }, [user.userData?.likes])

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
      {/* 담긴 상품 */}
      <div className={styles.content}>
        <section className={cx('tag-container')}>
          {/* 테이블 제목 */}
          <ul>
            <li className={cx('basic', 'media1')}>
              <input
                id="all"
                type="checkbox"
                value="all"
                checked={!checked.includes(false)}
                onChange={() =>
                  setChecked(
                    checked.map((_) => (checked.includes(false) ? true : false))
                  )
                }
              />
            </li>
            <li className={cx('basic', 'media1')}></li>
            <li className={styles.epic}>상품정보</li>
            <li className={cx('basic', 'media1')}>배송비</li>
            <li className={cx('basic', 'media1')}>가격</li>
            <li className={cx('basic', 'media2-n')}>선택</li>
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
                  <div className={cx('product-check', 'basic', 'media1')}>
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
                      <img
                        loading="lazy"
                        src={product.image}
                        alt={product.name}
                      />
                    </Link>
                  </div>
                  <div className={cx('product-info', 'epic')}>
                    <span className={cx('product-name')}>
                      <Link href={`/product/detail/${product._id}`}>
                        {product.name}
                      </Link>
                    </span>
                    <span className={cx('product-option')}>
                      {`[배송비] ${delivery.delivery.toLocaleString('ko-KR')}`}
                    </span>
                    <span className={cx('product-option')}>
                      {`[가격] ${product.price.toLocaleString('ko-KR')}`}
                    </span>
                    <div className={cx('product-select', 'media2-b')}>
                      <Link href={`/product/detail/${product._id}`}>
                        <button>상품조회</button>
                      </Link>
                      <button onClick={() => handleClickDelete(product._id)}>
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className={cx('product-delivery', 'basic', 'media1')}>
                    {delivery.delivery.toLocaleString('ko-KR')}
                  </div>
                  <div className={cx('product-price', 'basic', 'media1')}>
                    {product.price.toLocaleString('ko-KR')}
                  </div>
                  <div className={cx('product-select', 'basic', 'media2-n')}>
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
            <button className={cx('media1')} onClick={handleCheckedDelete}>
              선택상품삭제
            </button>
          </div>
        </section>
        <Pagination
          itemNum={products.length}
          displayNum={displayNum}
          onChange={setPageIndex}
        />
      </div>
    </>
  )
}

export default WishlistPage
