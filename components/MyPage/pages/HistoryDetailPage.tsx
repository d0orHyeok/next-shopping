import styles from './HistoryDetailPage.module.css'
import classNames from 'classnames/bind'
import { IPayment } from '@models/Payment'
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { IProduct } from '@models/Product'

interface IHistoryDetailPageProps {
  payment: IPayment
}

const cx = classNames.bind(styles)

const makeDataTable = (data: {}) => {
  const titles = Object.keys(data)
  const contents: string[] | React.ReactNode[] = Object.values(data)
  return (
    <div className={cx('table-container')}>
      <ul className={cx('table')}>
        {titles.map((title, index) => (
          <li key={index} className={cx('table-item')}>
            <h3 className={cx('table-item-title')}>{title}</h3>
            <div className={cx('table-item-content')}>{contents[index]}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const HistoryDetailPage = ({ payment }: IHistoryDetailPageProps) => {
  // 주문정보
  const [orderInfo, setOrderInfo] = useState({
    주문번호: payment.order_id,
    주문일자: payment.purchased_at,
    주문자: payment.order_name,
  })
  // 결제정보
  const [paymentInfo, setPaymentInfo] = useState({
    '총 주문금액': payment.price.toLocaleString('ko-KR'),
    상품금액: '0',
    배송비: '0',
    결제수단: payment.method_name,
  })
  //   배송지정보
  const [deliveryInfo, setDeliveryInfo] = useState({
    받으시는분: payment.delivery_info.picker,
    우편번호: '',
    주소: '',
    휴대전화: payment.delivery_info.phone,
    배송메세지: payment.delivery_info.message,
  })

  useEffect(() => {
    // 주문정보 초기화
    setOrderInfo({
      주문번호: payment.order_id,
      주문일자: payment.purchased_at,
      주문자: payment.order_name,
    })

    // 결제정보 초기화
    const productPrice = payment.orders
      .map((order) => order.qty * order.pid.price)
      .reduce((a, b) => a + b)
    const deliveryPrice =
      payment.price - productPrice <= 0 ? 0 : payment.price - productPrice

    setPaymentInfo({
      '총 주문금액': payment.price.toLocaleString('ko-KR'),
      상품금액: productPrice.toLocaleString('ko-KR'),
      배송비: deliveryPrice.toLocaleString('ko-KR'),
      결제수단: payment.method_name,
    })

    // 배송지정보 초기화
    const zonecode = payment.delivery_info.address.slice(0, 5)
    const addr = payment.delivery_info.address.slice(5)

    setDeliveryInfo({
      받으시는분: payment.delivery_info.picker,
      우편번호: zonecode,
      주소: addr,
      휴대전화: payment.delivery_info.phone,
      배송메세지: payment.delivery_info.message,
    })
  }, [payment])

  return (
    <div className={cx('wrapper')}>
      <section>
        <h1 className={cx('title', 'underline')}>주문정보</h1>
        {makeDataTable(orderInfo)}
      </section>
      <section>
        <h1 className={cx('title', 'underline')}>결제정보</h1>
        {makeDataTable(paymentInfo)}
      </section>
      <section>
        <h1 className={cx('title', 'underline')}>주문상품정보</h1>
        <TableContainer sx={{ marginBottom: '3rem' }}>
          <Table className={cx('table')}>
            <TableHead>
              <TableRow>
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
              {payment.orders.map((order, orderIndex) => {
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
                            <a className={cx('product-name')}>{product.name}</a>
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
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
      <section>
        <h1 className={cx('title', 'underline')}>배송지정보</h1>
        {makeDataTable(deliveryInfo)}
      </section>
      <section className={cx('section', 'section-desc')}>
        <div className={cx('desc-item')}>
          <h2 className={cx('desc-item-title')}>DESC_TITLE_1</h2>
          <p className={cx('desc-item-content')}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            autem voluptates ex aut vel, placeat facilis qui perferendis
            voluptate, impedit non unde? Mollitia molestias animi voluptates
            nisi. Dolorem, earum nostrum!
          </p>
        </div>
        <div className={cx('desc-item')}>
          <h2 className={cx('desc-item-title')}>DESC_TITLE_2</h2>
          <p className={cx('desc-item-content')}>
            <ul>
              <li>
                <span className={cx('desc-num')}>1</span>
                <span>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Enim, rem?
                </span>
              </li>
              <li>
                <span className={cx('desc-num')}>2</span>
                <span>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Enim, rem?
                </span>
              </li>
              <li>
                <span className={cx('desc-num')}>3</span>
                <span>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Enim, rem?
                </span>
              </li>
            </ul>
          </p>
        </div>
      </section>
    </div>
  )
}

export default HistoryDetailPage
