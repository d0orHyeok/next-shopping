import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct {
  image: string
  subImages: string[]
  name: string
  description: string
  category: string[]
  colors: string[]
  sizes: string[]
  price: number
  sole: number
  reviews: number
}

export interface IProuctDocument extends Document, IProduct {}

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
      type: Object,
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
