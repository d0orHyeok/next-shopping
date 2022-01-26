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
  likes: string[]
  is_event: boolean
  event_name: string
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
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    is_event: { type: Boolean, default: false },
    event_name: { type: String },
  },
  { timestamps: true }
)

productSchema.index(
  {
    sold: 'text',
    reviews: 'text',
    views: 'text',
    createdAt: 'text',
  },
  {
    weights: {
      sold: 10,
      reviews: 5,
      views: 3,
      createdAt: 3,
    },
  }
)

export default (mongoose.models.Product as IProductModel) ||
  mongoose.model<IProuctDocument, IProductModel>('Product', productSchema)
