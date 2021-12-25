import styles from './ProductCard.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import Link from 'next/link'
import { IProduct } from '@models/Product'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import {
  userClickLike,
  selectUser,
  IUserState,
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

  const handleLikeClick = useCallback(() => {
    if (!user.isLogin) {
      alert('로그인 후 이용가능합니다')
      return
    }
    dispatch(userClickLike(product._id))
  }, [product])

  useEffect(() => {
    if (user.userData) {
      if (user.userData.likes.findIndex((pid) => pid === product._id) !== -1) {
        setLike(true)
      } else {
        setLike(false)
      }
    } else {
      setLike(false)
    }
  }, [user])

  return (
    <>
      <div className={cx('card-wrapper')}>
        <div className={cx('thumbnail')}>
          <Link href={`/product/detail/${product._id}`}>
            <img src={product.image} alt={product.name} />
          </Link>
        </div>

        <ul className={cx('card-description')}>
          <li className={styles.name}>
            <Link href={`/product/detail/${product._id}`}>{product.name}</Link>
            <IconButton
              className={cx('button', like && 'like')}
              aria-label="like"
              onClick={handleLikeClick}
            >
              {!like ? <FavoriteBorderOutlinedIcon /> : <FavoriteIcon />}
            </IconButton>
          </li>
          <li className={styles.priceBox}>
            <span className={styles.price}>
              {`${product.price.toLocaleString('ko-KR')}`}
            </span>
          </li>
          <li className={styles.reviewBox}>
            <span className={styles.review}>{product.reviews}</span>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ProductCard
