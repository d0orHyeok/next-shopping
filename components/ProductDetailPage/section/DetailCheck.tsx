import * as pdetail from 'public/data/productDetail'
import styles from './DetailCheck.module.css'
import { IProduct } from '@models/Product'

interface IDetailPageProps {
  product: IProduct
}

const DetailCheck = ({ product }: IDetailPageProps) => {
  return (
    <>
      <div className={styles.container}>
        <ul>
          <li className={styles.title}>핏</li>
          <ul className={styles.itemList}>
            {pdetail.fitList.map((item, index) => (
              <li className={styles.item} key={index}>
                <span
                  style={{
                    backgroundColor:
                      item === product.fit ? 'rgba(0,0,0,0.75)' : 'inherit',
                  }}
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </ul>
        <ul>
          <li className={styles.title}>신축성</li>
          <ul className={styles.itemList}>
            {pdetail.elasticList.map((item, index) => (
              <li className={styles.item} key={index}>
                <span
                  style={{
                    backgroundColor:
                      item === product.elastic ? 'rgba(0,0,0,0.75)' : 'inherit',
                  }}
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </ul>
        <ul>
          <li className={styles.title}>비침</li>
          <ul className={styles.itemList}>
            {pdetail.opacityList.map((item, index) => (
              <li className={styles.item} key={index}>
                <span
                  style={{
                    backgroundColor:
                      item === product.opacity ? 'rgba(0,0,0,0.75)' : 'inherit',
                  }}
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </ul>
        <ul>
          <li className={styles.title}>계절</li>
          <ul className={styles.itemList}>
            {pdetail.seasonList.map((item, index) => (
              <li className={styles.item} key={index}>
                <span
                  style={{
                    backgroundColor: product.season.includes(item)
                      ? 'rgba(0,0,0,0.75)'
                      : 'inherit',
                  }}
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </ul>
      </div>
    </>
  )
}

export default DetailCheck
