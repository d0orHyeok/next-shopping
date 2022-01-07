import styles from './OrderResultPage.module.css'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import Link from 'next/link'

export interface IOrderResultPageProps {
  order_id: string
  result: string
}

const OrderResultPage = ({ order_id, result }: IOrderResultPageProps) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>주문/결제 {result}</h1>
        <div className={styles.content}>{`주문번호: ${order_id}`}</div>
        <div
          className={styles.result}
          style={{ backgroundColor: result === '성공' ? 'green' : 'red' }}
        >
          {result === '성공' ? (
            <DoneIcon fontSize="large" />
          ) : (
            <CloseIcon fontSize="large" />
          )}
        </div>
        <Link href="/">
          <button className={styles.btn}>쇼핑계속하기</button>
        </Link>
      </div>
    </section>
  )
}

export default OrderResultPage
