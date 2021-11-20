import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
// import dayjs from 'dayjs'

const saltRounds = 10

interface IUserCart {
  id: string
  quantity: number
  date: number
}

interface IUserHistory {
  dateOfPurchase: number
  name: string
  id: string
  price: number
  quantity: number
  paymentId: string
}

interface IUser {
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

interface IUserMoel extends Document, IUser {
  // comparePassword: (password: string) => Promise<void>
  // generateToken: () => Promise<void>
}

const userSchema = new mongoose.Schema<IUserMoel>({
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
  function (this: IUserMoel, next: (err?: Error | undefined) => void) {
    // if (this.isModified('password')) {
    //   bcrypt.genSalt(saltRounds, function (err, salt) {
    //     if (err) return next(err)

    //     bcrypt.hash(this.password, salt, function (err, hash) {
    //       if (err) return next(err)
    //       this.password = hash
    //       next()
    //     })
    //   })
    // } else {
    //   next()
    // }

    if (!this.isModified('password')) {
      return next()
    }
    bcrypt.genSalt(saltRounds, (err: Error, salt: string) => {
      if (err) return next(err)

      bcrypt.hash(this.password, salt, (err: Error, hash: string) => {
        if (err) return next(err)
        this.password = hash
      })
    })
  }
)

// https://www.youtube.com/watch?v=ePC_jwL4phg

// userSchema.methods.comparePassword = function (plainPassword : string, cb) {
//   bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//     if (err) return cb(err)
//     cb(null, isMatch)
//   })
// }

// userSchema.methods.generateToken = function (cb) {
//   const user = this
//   console.log('user', user)
//   console.log('userSchema', userSchema)
//   const token = jwt.sign(user._id.toHexString(), 'secret')
//   const oneHour = dayjs().add(1, 'hour').valueOf()

//   user.tokenExp = oneHour
//   user.token = token
//   user.save(function (err, user) {
//     if (err) return cb(err)
//     cb(null, user)
//   })
// }

// userSchema.statics.findByToken = function (token, cb) {
//   const user = this

//   jwt.verify(token, 'secret', function (err, decode) {
//     user.findOne({ _id: decode, token: token }, function (err, user) {
//       if (err) return cb(err)
//       cb(null, user)
//     })
//   })
// }

export default mongoose.models.User ||
  mongoose.model<IUserMoel>('User', userSchema)
