import styles from './ProductCard.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import Link from 'next/link'
import { IProduct } from '@models/Product'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import {
  selectUser,
  IUserState,
  userAddLike,
  userDeleteLike,
} from '@redux/features/userSlice'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useCallback, useEffect, useState } from 'react'

interface ProductCardProps {
  product: IProduct
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)

  const [like, setLike] = useState(false)

  const handleLikeClick = useCallback(
    (isDelete: boolean) => {
      const pid = [product._id]
      if (!user.isLogin) {
        return alert('로그인 시 이용가능합니다.')
      }
      isDelete ? dispatch(userDeleteLike(pid)) : dispatch(userAddLike(pid))
    },
    [product]
  )

  useEffect(() => {
    if (user.isLogin && user.userData) {
      user.userData.likes.includes(product._id) ? setLike(true) : setLike(false)
    }
  }, [user.userData?.likes])

  return (
    <>
      <div className={cx('card-wrapper')}>
        <div className={cx('thumbnail')}>
          <Link href={`/product/detail/${product._id}`}>
            <a>
              <img loading="lazy" src={product.image} alt={product.name} />
            </a>
          </Link>
        </div>

        <ul className={cx('card-description')}>
          <li className={styles.name}>
            <Link href={`/product/detail/${product._id}`}>
              <a>
                {!product.is_event
                  ? product.name
                  : `[PIIC X ${product.event_name}] ${product.name}`}
              </a>
            </Link>
            <IconButton
              className={cx('button', like && 'like')}
              aria-label="like"
              onClick={() => handleLikeClick(like)}
            >
              {!like ? <FavoriteBorderOutlinedIcon /> : <FavoriteIcon />}
            </IconButton>
          </li>
          <li className={styles.priceBox}>
            <span className={styles.price}>
              {`${product.price.toLocaleString('ko-KR')}`}
            </span>
          </li>
          <li className={styles.detailBox}>
            <span className={styles.review}>{product.reviews}</span>
            <span className={styles.view}>조회수 {product.views}</span>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ProductCard
