import { Document, Model } from 'mongoose'

export interface IUserCart {
  id: string
  quantity: number
  date: number
}

export interface IUserHistory {
  dateOfPurchase: number
  name: string
  id: string
  price: number
  quantity: number
  paymentId: string
}

export interface IUser {
  name: string
  email: string
  password: string
  role: 0 | 1 | 2
  image: string
  cart: IUserCart[]
  history: IUserHistory[]
  token: string
  tokenExp: number
}

export interface IUserDocument extends Document, IUser {
  comparePassword: (
    password: string,
    callback: (err: Error | null, isMatch?: boolean) => void
  ) => void
  generateToken: (
    callback: (err: Error | null, user?: IUserDocument) => void
  ) => void
}

export interface IUserModel extends Model<IUserDocument> {
  findByToken: (token: string) => Promise<IUserDocument>
}
