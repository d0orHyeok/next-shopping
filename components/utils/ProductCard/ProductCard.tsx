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
  addStorageLikes,
  deleteStorageLikes,
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
      if (user.isLogin) {
        isDelete ? dispatch(userDeleteLike(pid)) : dispatch(userAddLike(pid))
      }
      isDelete
        ? dispatch(deleteStorageLikes(pid))
        : dispatch(addStorageLikes(pid))
    },
    [product]
  )

  useEffect(() => {
    user.storage.likes.includes(product._id) ? setLike(true) : setLike(false)
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
          <li className={styles.reviewBox}>
            <span className={styles.review}>{product.reviews}</span>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ProductCard
