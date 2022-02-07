import { IDeliveryAddr, IUserCart } from '@models/User'
// import NextAuth from "next-auth"
// import { JWT } from "next-auth/jwt"

export interface IUserData {
  _id: string
  isAdmin: boolean
  email: string
  name: string
  role: number
  image: string
  deliveryAddrs: IDeliveryAddr[]
  likes: string[]
  cart: IUserCart[]
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    userData: IUserData
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    userData: IUserData
  }
}
