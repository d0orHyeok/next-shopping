import AuthCheck from 'hoc/authCheck'

const cart = () => {
  return (
    <div>
      <div>CartPage</div>
    </div>
  )
}

export default AuthCheck(cart, true)
