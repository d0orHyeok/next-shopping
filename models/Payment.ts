import { IUserCart } from '@models/User'
import mongoose, { Schema, Document, Model } from 'mongoose'

interface Payment {
  receipt_id: string
  order_id: string
  order_state: '상품준비중' | '배송중' | '배송완료'
  password: string
  payment_name: string
  item_name: string[]
  price: number
  method: string
  method_name: string
  card_name: string
  card_no: string
  purchased_at: string
  receipt_url: string
  orders: IUserCart[]
}

export interface IPayment extends Payment {
  _id: string
}
export interface IPaymentDocument extends Document, Payment {}

export type IPaymentModel = Model<IPaymentDocument>

const paymentSchema: Schema = new Schema({
  receipt_id: {
    type: String,
  },
  order_id: {
    type: String,
  },
  order_state: {
    type: String,
    default: '상품준비중',
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  password: {
    type: String,
  },
  payment_name: {
    type: String,
  },
  item_name: {
    type: Array,
    default: [],
  },
  price: {
    type: Number,
  },
  method: {
    type: String,
  },
  method_name: {
    type: String,
  },
  card_name: {
    type: String,
  },
  card_no: {
    type: String,
  },
  purchased_at: {
    type: String,
  },
  receipt_url: {
    type: String,
  },
  orders: [
    {
      pid: { type: Schema.Types.ObjectId, ref: 'Product' },
      qty: { type: Number },
      option: {
        color: {
          colorName: { type: String },
          colorHex: { type: String },
        },
        size: { type: String },
      },
    },
  ],
})

export default (mongoose.models.Payment as IPaymentModel) ||
  mongoose.model<IPaymentDocument, IPaymentModel>('Payment', paymentSchema)
