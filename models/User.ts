import { IColor } from './Product'
import mongoose, { Schema, Document, Model, PopulatedDoc } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'

export const saltRounds = 10

export interface IOption {
  color: IColor
  size: string
}

export interface IDeliveryAddr {
  fix: boolean
  addressName: string
  picker: string
  phone: string
  address: string
}

export interface IUserCart {
  pid: PopulatedDoc<string | Document>
  qty: number
  option: IOption
}

export interface IUser {
  name: string
  email: string
  password: string
  role: 0 | 1 | 2
  image: string
  deliveryAddrs: IDeliveryAddr[]
  likes: string[]
  cart: IUserCart[]
  token: string
  tokenExp: number
  createdAt: Date
  updateAt: Date
}

export interface IUserDocument extends Document, IUser {
  comparePassword: (
    password: string,
    callback: (err: Error | null, isMatch?: boolean) => void
  ) => void
  generateToken: (
    callback: (err: Error | null, user?: IUserDocument) => void
  ) => void
  changePassword: (
    callback: (err: Error | null, success?: boolean) => void
  ) => void
}

export interface IUserModel extends Model<IUserDocument> {
  findByToken: (token: string) => Promise<IUserDocument>
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      minglength: 6,
    },
    role: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: '/temp_user.png',
    },
    deliveryAddrs: [
      {
        fix: { type: Boolean },
        addressName: { type: String },
        picker: { type: String },
        phone: { type: String },
        address: { type: String },
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],
    cart: [
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
    token: {
      type: String,
      default: '',
    },
    tokenExp: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

userSchema.pre(
  'save',
  function (this: IUserDocument, next: (err?: Error | undefined) => void) {
    const user = this

    if (user.isModified('password')) {
      bcrypt.genSalt(saltRounds, function (err: Error, salt: string) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function (err: Error, hash: string) {
          if (err) return next(err)
          user.password = hash
          next()
        })
      })
    } else {
      next()
    }
  }
)

userSchema.methods.comparePassword = function (
  plainPassword: string,
  callback: (err: Error | null, isMatch?: boolean) => void
) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

userSchema.methods.generateToken = function (
  callback: (err: Error | null, user?: IUserDocument) => void
) {
  const token = jwt.sign(this._id.toHexString(), 'secret')
  const oneHour = dayjs().add(1, 'hour').valueOf()

  this.tokenExp = oneHour
  this.token = token
  this.save(function (err: Error | null, user: IUserDocument) {
    if (err) return callback(err)
    callback(null, user)
  })
}

userSchema.methods.changePassword = function (
  newPassword: string,
  callback: (err: Error | null, isMatch?: boolean) => void
) {
  bcrypt.compare(newPassword, this.password, function (err, isMatch) {
    if (err) return callback(err)

    if (isMatch) return callback(null, false)
  })
}

userSchema.statics.findByToken = async function (
  token: string
): Promise<IUserDocument> {
  const decode = await jwt.verify(token, 'secret')
  return await this.findOne({ _id: decode, token: token })
}

export default (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>('User', userSchema)
