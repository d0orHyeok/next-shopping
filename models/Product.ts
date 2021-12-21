import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IColor {
  colorName: string
  colorHex: string
}

interface Product {
  image: string
  subImages: string[]
  name: string
  description: string
  category: string[]
  colors: IColor[]
  sizes: string[]
  price: number
  fit: string
  elastic: string
  opacity: string
  season: string[]
  sold: number
  reviews: number
  views: number
  likes: number
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
    fit: {
      type: String,
    },
    elastic: {
      type: String,
    },
    opacity: {
      type: String,
    },
    season: {
      type: Array,
    },
    sold: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

productSchema.index(
  {
    sold: 'text',
    createdAt: 'text',
  },
  {
    weights: {
      sold: 5,
      createdAt: 3,
    },
  }
)

export default (mongoose.models.Product as IProductModel) ||
  mongoose.model<IProuctDocument, IProductModel>('Product', productSchema)
