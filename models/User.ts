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
  comparePassword: (password: string) => void
  generateToken: () => Promise<IUserDocument>
}

export interface IUserModel extends Model<IUserDocument> {
  findByToken: (token: string, callback) => Promise<IUserDocument>
}

const userSchema = new Schema<IUserDocument>({
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
})

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

userSchema.methods.comparePassword = function (plainPassword: string) {
  bcrypt.compare(plainPassword, this.password)
}

userSchema.methods.generateToken = async function () {
  const token = jwt.sign(this._id.toHexString(), 'secret')
  const oneHour = dayjs().add(1, 'hour').valueOf()

  this.tokenExp = oneHour
  this.token = token
  try {
    const user = await this.save()
    return Promise.resolve(user)
  } catch (error) {
    return Promise.reject(error)
  }
}

userSchema.statics.findByToken = async function (token: string) {
  try {
    const decode = await jwt.verify(token, 'secret')
    const user = this.findOne({ _id: decode, token: token })
    return Promise.resolve(user)
  } catch (error) {
    return Promise.reject(error)
  }
}

export default mongoose.models.User ||
  mongoose.model<IUserDocument, IUserModel>('User', userSchema)
