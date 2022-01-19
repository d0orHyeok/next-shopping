import styles from './MyPage.module.css'
import classNames from 'classnames/bind'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { IPayment } from '@models/Payment'
import { useEffect, useState } from 'react'
import PaymentOrderTable from '../section/PaymentOrderTable'

export interface IMyPageIndexProps {
  payments: IPayment[]
}

const cx = classNames.bind(styles)

const MyPage = ({ payments }: IMyPageIndexProps) => {
  const [paymentsNum, setPaymentsNum] = useState({
    ready: 0,
    delivery: 0,
    complete: 0,
    cancel: 0,
    change: 0,
    back: 0,
  })

  useEffect(() => {
    let ready = 0,
      delivery = 0,
      complete = 0,
      cancel = 0,
      change = 0,
      back = 0
    payments.forEach((payment) => {
      payment.orders.forEach((order) => {
        if (order.refund_state === null) {
          order.order_state === 'ready'
            ? (ready += 1)
            : order.order_state === 'delivery'
            ? (delivery += 1)
            : (complete += 1)
        } else {
          order.refund_state === 'cancel'
            ? (cancel += 1)
            : order.refund_state === 'change'
            ? (change += 1)
            : (back += 1)
        }
      })
    })

    setPaymentsNum({ ready, delivery, complete, cancel, change, back })
  }, [payments])

  return (
    <div className={cx('wrapper')}>
      <section className={cx('orderState')}>
        <h1 className={cx('title', 'underline')}>
          주문처리 현황 <span>{'(최근 3개월 기준)'}</span>
        </h1>
        <div className={cx('process')}>
          <ul>
            <li className={cx('process-item')}>
              <h2 className={cx('process-item-title')}>상품준비중</h2>
              <span className={cx('process-item-num')}>
                {paymentsNum.ready}
              </span>
            </li>
            <span className={cx('blank')}>
              <ArrowForwardIosIcon />
            </span>
            <li className={cx('process-item')}>
              <h2 className={cx('process-item-title')}>배송중</h2>
              <span className={cx('process-item-num')}>
                {paymentsNum.delivery}
              </span>
            </li>
            <span className={cx('blank')}>
              <ArrowForwardIosIcon />
            </span>
            <li className={cx('process-item')}>
              <h2 className={cx('process-item-title')}>배송완료</h2>
              <span className={cx('process-item-num')}>
                {paymentsNum.complete}
              </span>
            </li>
            <span className={cx('blank')}>
              <ArrowForwardIosIcon />
            </span>
            <li className={cx('process-item')}>
              <h2 className={cx('process-item-title')}>취소/교환/반품</h2>
              <span
                className={cx('process-item-num')}
              >{`${paymentsNum.cancel}/${paymentsNum.change}/${paymentsNum.back}`}</span>
            </li>
          </ul>
        </div>
      </section>
      <section className={cx('orderList')}>
        <h1 className={cx('title', 'underline')}>최근 주문내역</h1>
        <PaymentOrderTable payments={payments} />
      </section>
    </div>
  )
}

export default MyPage
