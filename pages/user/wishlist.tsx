import AuthCheck from 'hoc/authCheck'

const wishlist = () => {
  return (
    <div>
      <div>WishListPage</div>
    </div>
  )
}

export default AuthCheck(wishlist, true)
