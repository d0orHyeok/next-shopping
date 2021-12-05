import mongoose, { Schema, Document } from 'mongoose'

export interface IProductCategory {
  main: string
  sub: string
  kind: string
}

export interface IProduct {
  name: string
  image: string
  description: string
  colors: string[]
  sizes: string[]
  price: number
  category: {}
  reviews: number
}

export interface IProuctDocument extends Document, IProduct {}

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      maxlength: 50,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
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
    category: {
      type: Object,
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

export default mongoose.model<IProuctDocument>('Product', productSchema)
