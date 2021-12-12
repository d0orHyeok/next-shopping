import mongoose, { Schema, Document, Model } from 'mongoose'

interface Product {
  image: string
  subImages: string[]
  name: string
  description: string
  category: string[]
  colors: string[]
  sizes: string[]
  price: number
  sold: number
  reviews: number
}

export interface IProduct extends Product {
  _id: string
}
export interface IProuctDocument extends Document, Product {}

export type IProductModel = Model<IProuctDocument>

const productSchema: Schema = new Schema(
  {
    image: {
      type: String,
    },
    subImages: {
      type: Array,
      default: [],
    },
    name: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    category: {
      type: Array,
    },
    colors: {
      type: Array,
    },
    sizes: {
      type: Array,
    },
    price: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default (mongoose.models.Product as IProductModel) ||
  mongoose.model<IProuctDocument, IProductModel>('Product', productSchema)
