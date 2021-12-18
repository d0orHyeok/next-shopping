import styles from './ProductCard.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import Link from 'next/link'
import { IProduct } from '@models/Product'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'

interface ProductCardProps {
  product: IProduct
}

const ProductCard = ({ product }: ProductCardProps) => {
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
            <FavoriteBorderOutlinedIcon />
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
