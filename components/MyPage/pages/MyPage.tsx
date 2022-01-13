import styles from './MyPage.module.css'
import classNames from 'classnames/bind'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useAppSelector } from '@redux/hooks'
import { IPaymentState, selectPayment } from '@redux/features/paymentSlice'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

const cx = classNames.bind(styles)

const MyPage = () => {
  const paymentState: IPaymentState = useAppSelector(selectPayment)

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('title', 'absolute')}>
        주문처리 현황 <span>{'(최근 3개월 기준)'}</span>
      </h1>
      <section className={cx('orderState')}>
        <div className={cx('process')}>
          <ul>
            <li className={cx('process-item')}>
              <h2 className={cx('process-item-title')}>상품준비중</h2>
              <span className={cx('process-item-num')}>
                {paymentState.number.ready}
              </span>
            </li>
            <span className={cx('blank')}>
              <ArrowForwardIosIcon />
            </span>
            <li className={cx('process-item')}>
              <h2 className={cx('process-item-title')}>배송중</h2>
              <span className={cx('process-item-num')}>
                {paymentState.number.delivery}
              </span>
            </li>
            <span className={cx('blank')}>
              <ArrowForwardIosIcon />
            </span>
            <li className={cx('process-item')}>
              <h2 className={cx('process-item-title')}>배송완료</h2>
              <span className={cx('process-item-num')}>
                {paymentState.number.complete}
              </span>
            </li>
            <span className={cx('blank')}>
              <ArrowForwardIosIcon />
            </span>
            <li className={cx('process-item')}>
              <h2 className={cx('process-item-title')}>취소/교환/반품</h2>
              <span
                className={cx('process-item-num')}
              >{`${paymentState.number.cancel}/${paymentState.number.change}/${paymentState.number.back}`}</span>
            </li>
          </ul>
        </div>
      </section>
      <h1 className={cx('title')}>최근 주문내역</h1>
      <section className={cx('orderList')}>
        <div className={cx('table')}>
          <TableContainer sx={{ minWidth: '650px' }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <span>주문일자</span>
                    <span>{'[주문번호]'}</span>
                  </TableCell>
                  <TableCell align="center">상품정보</TableCell>
                  <TableCell align="center">수량</TableCell>
                  <TableCell align="center">주문금액</TableCell>
                  <TableCell align="center">주문상태</TableCell>
                  <TableCell align="center">취소/교환/반품</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentState.payments.map((payment, index) => {
                  let orderState = ''
                  switch (payment.order_state) {
                    case 'complete':
                      orderState = '배송완료'
                      break
                    case 'delivery':
                      orderState = '배송완료'
                      break
                    case 'ready':
                      orderState = '배송완료'
                      break
                  }
                  let refundState = '-'
                  switch (payment.refund_state) {
                    case 'cancel':
                      refundState = '취소'
                      break
                    case 'change':
                      refundState = '교환'
                      break
                    case 'back':
                      refundState = '반품'
                      break
                  }
                  return (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <span>{payment.purchased_at}</span>
                        <span>{payment.order_id}</span>
                      </TableCell>
                      <TableCell align="center">정보</TableCell>
                      <TableCell align="center">0</TableCell>
                      <TableCell align="center">10000</TableCell>
                      <TableCell align="center">{orderState}</TableCell>
                      <TableCell align="center">{refundState}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>
    </div>
  )
}

export default MyPage
