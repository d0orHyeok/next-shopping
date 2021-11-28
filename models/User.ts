import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'

const saltRounds = 10

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
  role?: 0 | 1 | 2
  image?: string
  cart?: IUserCart[]
  history?: IUserHistory[]
  token?: string
  tokenExp?: number
}

export interface IUserDocument extends Document, IUser {
  comparePassword: (
    password: string,
    callback: (err: Error | null, isMatch: boolean | null) => void
  ) => void
  generateToken: (
    callback: (err: Error | null, user?: IUserDocument | null) => void
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
      minglength: 5,
    },
    role: {
      type: Number,
      default: 0,
    },
    image: String,
    cart: {
      type: [
        {
          id: String,
          quantity: Number,
          date: Number,
        },
      ],
      default: [],
    },
    history: {
      type: [
        {
          dateOfPurchase: Number,
          name: String,
          id: String,
          price: Number,
          quantity: Number,
          paymentId: String,
        },
      ],
      default: [],
    },
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
  callback: (err: Error | null, isMatch: boolean | null) => void
) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err, null)
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

userSchema.statics.findByToken = async function (
  token: string
): Promise<IUserDocument> {
  const decode = await jwt.verify(token, 'secret')
  return await this.findOne({ _id: decode, token: token })
}

export default (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>('User', userSchema)
