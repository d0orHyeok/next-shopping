import styles from './MyPage.module.css'
import classNames from 'classnames/bind'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { IProduct } from '@models/Product'
import Link from 'next/link'
import { IPayment } from '@models/Payment'
import { useEffect, useState } from 'react'

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
      <h1 className={cx('title', 'absolute')}>
        주문처리 현황 <span>{'(최근 3개월 기준)'}</span>
      </h1>
      <section className={cx('orderState')}>
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
      <h1 className={cx('title')}>최근 주문내역</h1>
      <section className={cx('orderList')}>
        <div className={cx('table')}>
          <TableContainer sx={{ marginBottom: '3rem' }}>
            <Table aria-label="simple table">
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
                {payments.map((payment) => {
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
                              <span>{payment.order_id}</span>
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
                                  <img src={product.image} alt={product.name} />
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
                          {(order.qty * order.pid.price).toLocaleString(
                            'ko-KR'
                          )}
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
