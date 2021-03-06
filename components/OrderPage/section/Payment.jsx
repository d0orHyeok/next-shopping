import dayjs from 'dayjs'
import Axios from 'axios'

const Payment = (props) => {
  const { orders, totalPrice, style, className, passData, onSuccess } = props

  function requestPayment() {
    const orderUserData = passData ? passData() : null

    if (!orderUserData) {
      return
    }

    if (
      !confirm(
        '테스트결제입니다.\n실제로 결제가 진행되므로 100원으로 결제를 진행합니다.\n결제완료 후 23:30~00:00 사이에 결제취소가 진행됩니다. 빠르게 취소를 원하시는 경우 직접 결제취소를 진행하셔야 합니다.\n\n결제진행을 계속하시려면 확인을 클릭해주세요.'
      )
    ) {
      return
    }

    window.BootPay.request({
      price: '100',
      application_id: process.env.NEXT_PUBLIC_PAY_APP_ID,
      name: orders.length === 1 ? orders[0].product.name : 'PIIC 상품 결제', //결제창에서 보여질 이름
      pg: 'danal',
      method: 'card', //결제수단, 입력하지 않으면 결제수단 선택부터 화면이 시작합니다.
      show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부

      items: orders.map((order) => {
        return {
          item_name: order.product.name,
          qty: order.qty,
          unique: order.pid,
          price: order.qty * order.product.price,
          cat1: order.product.category[0],
          cat2: order.product.category[1],
          cat3: order.product.category[2],
        }
      }),
      user_info: {
        username: orderUserData.delivery_info.picker,
        email: orderUserData.delivery_info.email,
        addr: orderUserData.delivery_info.address,
        phone: orderUserData.delivery_info.phone,
      },
      order_id: `${dayjs(Date.now()).format('YYYYMMDD')}-${Math.random()
        .toString(36)
        .substring(2, 10)}`, //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
      params: {},
      account_expire_at: dayjs(Date.now()).add(1, 'day').format('YYYY-MM-DD'), // 가상계좌 입금기간 제한 ( yyyy-mm-dd 포멧으로 입력해주세요. 가상계좌만 적용됩니다. )
      extra: {
        vbank_result: 1, // 가상계좌 사용시 사용, 가상계좌 결과창을 볼지(1), 말지(0), 미설정시 봄(1)
        quota: '0,2,3', // 결제금액이 5만원 이상시 할부개월 허용범위를 설정할 수 있음, [0(일시불), 2개월, 3개월] 허용, 미설정시 12개월까지 허용,
        theme: 'purple', // [ red, purple(기본), custom ]
        custom_background: '#00a086', // [ theme가 custom 일 때 background 색상 지정 가능 ]
        custom_font_color: '#ffffff', // [ theme가 custom 일 때 font color 색상 지정 가능 ]
      },
    })
      .error(function (data) {
        //결제 진행시 에러가 발생하면 수행됩니다.
        console.log('--- 결제 error ---')
        alert(`오류가 발생하였습니다.\n\n오류: ${data.message}`)
      })
      .cancel(function (data) {
        //결제가 취소되면 수행됩니다.
        console.log('--- 결제 cancel ---')
        alert(`결제가 취소되었습니다.\n\n${data.message}`)
      })
      .ready(function (data) {
        // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수입니다.
        console.log('--- 가상계좌 발급 ---', data)
      })
      .confirm(function (data) {
        //결제가 실행되기 전에 수행되며, 주로 재고를 확인하는 로직이 들어갑니다.
        //주의 - 카드 수기결제일 경우 이 부분이 실행되지 않습니다.
        let enable = true // 재고 수량 관리 로직 혹은 다른 처리
        if (enable) {
          // eslint-disable-next-line no-undef
          BootPay.transactionConfirm(data) // 조건이 맞으면 승인 처리를 한다.
        } else {
          // eslint-disable-next-line no-undef
          BootPay.removePaymentWindow() // 조건이 맞지 않으면 결제 창을 닫고 결제를 승인하지 않는다.
        }
      })
      .close(function () {
        // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
      })
      .done(function (data) {
        //결제가 정상적으로 완료되면 수행됩니다
        //비즈니스 로직을 수행하기 전에 결제 유효성 검증을 하시길 추천합니다.
        console.log('--- 결제 완료 ---')

        Axios.post('/api/payment/validation', {
          data: {
            ...data,
            order_name: orderUserData.order_name,
            delivery_info: orderUserData.delivery_info,
          },
          orders,
        }).then((res) => {
          onSuccess && onSuccess(res.data.order_id)
          console.log('주문번호', res.data.order_id)
        })
      })
  }

  return (
    <>
      <button
        style={style && style}
        className={className && className}
        onClick={requestPayment}
      >
        {`${totalPrice.toLocaleString('ko-KR')}원 결제하기`}
      </button>
    </>
  )
}

export default Payment
