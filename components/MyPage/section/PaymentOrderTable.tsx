import styles from './PaymentOrderTable.module.css'
import classNames from 'classnames/bind'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Link from 'next/link'
import { IPayment } from '@models/Payment'
import { IProduct } from '@models/Product'
import Pagination from '@components/utils/Pagination/Pagination'
import { useState } from 'react'

interface IPaymentOrderTableProps {
  payments: IPayment[]
}

const cx = classNames.bind(styles)

const PaymentOrderTable = ({ payments }: IPaymentOrderTableProps) => {
  const displayNum = 5
  const [pageIndex, setPageIndex] = useState(1)

  return (
    <>
      <TableContainer className={cx('container')} sx={{ marginBottom: '3rem' }}>
        <Table
          className={cx('table')}
          sx={{ marginBottom: displayNum < payments.length ? '3rem' : 0 }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                className={cx('tableCell', 'id', 'head')}
              >
                <ul className={cx('order-id')}>
                  <li>주문일자</li>
                  <li>{'[주문번호]'}</li>
                </ul>
              </TableCell>
              <TableCell
                align="center"
                className={cx('tableCell', 'info', 'head')}
              >
                <p>상품정보</p>
                <div className={cx('mediaCell')}>
                  <span>주문상태</span>
                  <span>취소/교환/반품</span>
                </div>
              </TableCell>
              <TableCell
                align="center"
                className={cx('tableCell', 'qty', 'head')}
              >
                수량
              </TableCell>
              <TableCell
                align="center"
                className={cx('tableCell', 'price', 'head')}
              >
                주문금액
              </TableCell>
              <TableCell
                align="center"
                className={cx('tableCell', 'orderState', 'head')}
              >
                주문상태
              </TableCell>
              <TableCell
                align="center"
                className={cx('tableCell', 'refundState', 'head')}
              >
                취소/교환/반품
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment, index) => {
              if (
                index + 1 <= pageIndex * displayNum &&
                index + 1 > (pageIndex - 1) * displayNum
              ) {
                return payment.orders.map((order, orderIndex) => {
                  let orderState = ''
                  switch (order.order_state) {
                    case 'complete':
                      orderState = '배송완료'
                      break
                    case 'delivery':
                      orderState = '배송중'
                      break
                    case 'ready':
                      orderState = '상품준비중'
                      break
                  }
                  let refundState = '-'
                  switch (order.refund_state) {
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

                  const product: IProduct = order.pid
                  return (
                    <TableRow key={`${product.name}${orderIndex}`}>
                      {!orderIndex ? (
                        <TableCell
                          align="center"
                          rowSpan={payment.orders.length}
                          className={cx('tableCell', 'id')}
                        >
                          <div className={cx('order-id')}>
                            <span style={{ marginBottom: '0.5rem' }}>
                              {payment.purchased_at}
                            </span>
                            <Link
                              href={`/user/mypage/history/${payment.order_id}`}
                            >
                              <a>{payment.order_id}</a>
                            </Link>
                          </div>
                        </TableCell>
                      ) : (
                        <></>
                      )}
                      <TableCell
                        align="center"
                        className={cx('tableCell', 'info')}
                      >
                        <div className={cx('order-info')}>
                          <div className={cx('order-info-imgBox')}>
                            <Link href={`/product/detail/${order.pid._id}`}>
                              <a>
                                <img
                                  loading="lazy"
                                  src={product.image}
                                  alt={product.name}
                                />
                              </a>
                            </Link>
                          </div>
                          <div className={cx('order-info-content')}>
                            <Link href={`/product/detail/${order.pid._id}`}>
                              <a className={cx('product-name')}>
                                {product.name}
                              </a>
                            </Link>
                            <span className={cx('product-option')}>
                              {`[옵션] ${order.option.color.colorName}/${order.option.size}`}
                            </span>
                            <span
                              className={cx(
                                'product-option',
                                'product-option-qty'
                              )}
                            >
                              {`[수량] ${order.qty}`}
                            </span>
                            <span
                              className={cx(
                                'product-option',
                                'product-option-price'
                              )}
                            >
                              {`[금액] ${(
                                order.qty * order.pid.price
                              ).toLocaleString('ko-KR')}`}
                            </span>
                          </div>
                        </div>
                        <div className={cx('mediaCell')}>
                          <span>{orderState}</span>
                          <span>{refundState}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        align="center"
                        className={cx('tableCell', 'qty')}
                      >
                        {order.qty}
                      </TableCell>
                      <TableCell
                        align="center"
                        className={cx('tableCell', 'price')}
                      >
                        {(order.qty * order.pid.price).toLocaleString('ko-KR')}
                      </TableCell>
                      <TableCell
                        align="center"
                        className={cx('tableCell', 'orderState')}
                      >
                        {orderState}
                      </TableCell>
                      <TableCell
                        align="center"
                        className={cx('tableCell', 'refundState')}
                      >
                        {refundState}
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            })}
          </TableBody>
        </Table>
        {payments.length > displayNum && (
          <Pagination
            itemNum={payments.length}
            displayNum={displayNum}
            onChange={setPageIndex}
          />
        )}
      </TableContainer>
    </>
  )
}

export default PaymentOrderTable
