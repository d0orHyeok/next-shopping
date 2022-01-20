import { IOption } from './User'
import mongoose, { Schema, Document, Model, PopulatedDoc } from 'mongoose'

interface Review {
  user_id: PopulatedDoc<string | Document>
  pid: PopulatedDoc<string | Document>
  option: IOption
  score: number
  images: string[]
  content: string
  user_size: {
    tall: string
    weight: string
    top: string
    bottom: string
  }
  likes: string[]
}

export interface IReview extends Review {
  _id: string
  createdAt: Date
  updateAt: Date
}
export interface IReviewDocument extends Document, Review {}

export type IReviewModel = Model<IReviewDocument>

const review: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    pid: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    option: {
      size: { type: String },
      color: {
        colorName: { type: String },
        colorHex: { type: String },
      },
    },
    score: { type: Number },
    images: { type: Array, default: [] },
    content: { type: String },
    user_size: {
      tall: { type: String },
      weight: { type: String },
      top: { type: String },
      bottom: { type: String },
    },
    likes: { type: Array, default: [] },
  },
  { timestamps: true }
)

export default (mongoose.models.Review as IReviewModel) ||
  mongoose.model<IReviewDocument, IReviewModel>('Review', review)
