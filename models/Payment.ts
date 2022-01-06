import mongoose, { Schema, Document, Model } from 'mongoose'

interface Payment {
  card_name: string
  card_no: string
  item_name: string
  order_id: string
  payment_group_name: string
  payment_name: string
  price: number
  purchased_at: string
  receipt_id: string
  receipt_url: string
}

export interface IPayment extends Payment {
  _id: string
}
export interface IPaymentDocument extends Document, Payment {}

export type IPaymentModel = Model<IPaymentDocument>

const paymentSchema: Schema = new Schema({
  image: {
    type: String,
  },
})

export default (mongoose.models.Payment as IPaymentModel) ||
  mongoose.model<IPaymentDocument, IPaymentModel>('Payment', paymentSchema)
