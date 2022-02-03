import { IUserProduct } from '@api/product/findProductsByOrders'
import styles from './OrderCard.module.css'

interface IOrderCardProps {
  userProduct: IUserProduct
}

const OrderCard = ({ userProduct }: IOrderCardProps) => {
  const { qty, option, product } = userProduct

  return (
    <div className={styles.container}>
      <div className={styles.imgBox}>
        <img loading="lazy" src={product.image} alt={product.name} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{product.name}</div>
        <div className={styles.info}>
          <span>{`[옵션]: ${option.color.colorName}/${option.size}`}</span>
          <span>{`[수량]: ${qty}개`}</span>
          <span>
            {`구매금액: ${(product.price * qty).toLocaleString('ko-KR')}`}
          </span>
        </div>
        <a
          href={`/product/detail/${product._id}`}
          target="_blank"
          rel="noreferrer"
        >
          상품정보
        </a>
      </div>
    </div>
  )
}

export default OrderCard
