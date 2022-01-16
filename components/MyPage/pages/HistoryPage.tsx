import styles from './HistoryPage.module.css'
import classNames from 'classnames/bind'
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
import { IProduct } from '@models/Product'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

export interface IHistoryPageProps {
  mode: 'all' | 'refund'
}

interface IHistoryPageQuery extends ParsedUrlQuery {
  mode?: string
  order_state?: string
  date_start?: string
  date_end?: string
}

const cx = classNames.bind(styles)
const today = dayjs(Date.now())

const HistoryPage = ({ mode }: IHistoryPageProps) => {
  const paymentState: IPaymentState = useAppSelector(selectPayment)
  const router = useRouter()

  const [orderState, setOrderState] = useState('')
  const [date, setDate] = useState({
    dateStart: today.subtract(3, 'month').format('YYYY-MM-DD'),
    dateEnd: today.format('YYYY-MM-DD'),
  })

  useEffect(() => {
    const { order_state, date_start, date_end } =
      router.query as IHistoryPageQuery

    if (order_state) setOrderState(order_state)
    if (date_start && date_end)
      setDate({ dateStart: date_start, dateEnd: date_end })
  }, [router.query])

  const { dateStart, dateEnd } = date

  const handleChangeOrderState = (
    evnet: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = evnet.target
    setOrderState(value)
  }

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = event.target
    setDate({ ...date, [id]: value })
  }

  const handleClickPeriod = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget

    let start = ''
    switch (value) {
      case 'today':
        start = today.format('YYYY-MM-DD')
        break
      case 'week':
        start = today.subtract(1, 'week').format('YYYY-MM-DD')
        break
      case 'month':
        start = today.subtract(1, 'month').format('YYYY-MM-DD')
        break
      case 'season':
        start = today.subtract(3, 'month').format('YYYY-MM-DD')
        break
      case 'halfYear':
        start = today.subtract(6, 'month').format('YYYY-MM-DD')
        break
    }
    setDate({ dateStart: start, dateEnd: today.format('YYYY-MM-DD') })
  }

  const handleClickView = () => {
    router.push({
      pathname: '/user/mypage/history',
      query: {
        ...router.query,
        date_start: dateStart,
        date_end: dateEnd,
        order_state: orderState,
      },
    })
  }

  return (
    <div className={cx('wrapper')}>
      {/* 주문조회 선택 */}
      <section className={cx('select')}>
        {/* 버튼 */}
        <nav className={cx('select-history')}>
          <Link href={{ pathname: '/user/mypage/history' }}>
            <a
              className={cx(
                'btn',
                'historyBtn',
                mode === 'all' && 'historyBtn-select'
              )}
            >
              주문내역조회
            </a>
          </Link>
          <Link
            href={{
              pathname: '/user/mypage/history',
              query: { mode: 'refund' },
            }}
          >
            <a
              className={cx(
                'btn',
                'historyBtn',
                mode === 'refund' && 'historyBtn-select'
              )}
            >
              취소/교환/반품 내역
            </a>
          </Link>
          <span className={cx('select-history-blank')}></span>
        </nav>
        {/* 주문조회 필터 */}
        <div className={cx('select-order')}>
          {/* 필터 */}
          <div className={cx('select-order-filter')}>
            <div className={cx('filter-state')}>
              <select
                name="orderState"
                id="orderState"
                value={orderState}
                onChange={handleChangeOrderState}
              >
                <option value="">전체 주문처리상태</option>
                <option value="ready">상품준비중</option>
                <option value="delivery">배송중</option>
                <option value="complete">배송완료</option>
                <option value="cancel">취소</option>
                <option value="change">교환</option>
                <option value="back">반품</option>
              </select>
            </div>
            <div className={cx('filter-period')}>
              <button
                className={cx('btn', 'periodBtn')}
                value="today"
                onClick={handleClickPeriod}
              >
                오늘
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="week"
                onClick={handleClickPeriod}
              >
                1주일
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="month"
                onClick={handleClickPeriod}
              >
                1개월
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="season"
                onClick={handleClickPeriod}
              >
                3개월
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="halfYear"
                onClick={handleClickPeriod}
              >
                6개월
              </button>
            </div>
            <div className={cx('filter-datePicker')}>
              <input
                className={cx('datePicker', 'dateStart')}
                type="date"
                id="dateStart"
                min={today.subtract(2, 'year').format('YYYY-MM-DD')}
                max={today.format('YYYY-MM-DD')}
                value={dateStart}
                onChange={handleChangeDate}
              />
              <span>~</span>
              <input
                className={cx('datePicker', 'dateEnd')}
                type="date"
                id="dateEnd"
                min={today.subtract(2, 'year').format('YYYY-MM-DD')}
                max={today.format('YYYY-MM-DD')}
                value={dateEnd}
                onChange={handleChangeDate}
              />
              <button
                className={cx('btn', 'dateBtn')}
                onClick={handleClickView}
              >
                조회
              </button>
            </div>
          </div>
          {/* 주문조회 설명 */}
          <div className={cx('select-order-desc')}>
            <ol>
              <li>기본적으로 최근 3개월간의 자료가 조회됩니다.</li>
              <li>
                주문번호를 클릭하시면 해당 주문에 대한 상세내역을 확인하실 수
                있습니다.
              </li>
              <li>
                취소/교환/반품 신청은 배송완료일 기준으로 7일까지 가능합니다.
              </li>
            </ol>
          </div>
        </div>
      </section>
      <h1 className={cx('title')}>주문 상품 정보</h1>
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
                {paymentState.payments.map((payment, index) => {
                  if (index > 9) {
                    return
                  }

                  let orderState = ''
                  switch (payment.order_state) {
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
                  return payment.orders.map((order, orderIndex) => {
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

export default HistoryPage
