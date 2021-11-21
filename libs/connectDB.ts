import mongoose from 'mongoose'

const uri: string = process.env.MONGO_URI

if (!uri) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env.local'
  )
}

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    console.log('DB connected')
    return
  }
  mongoose.connection.on('connected', () => {
    console.log('connected to mongo db')
  })
  //   mongoose.connection.on('error', (err) => {
  //     console.log(`db connection problem`, err.message)
  //   })

  return mongoose.connect(uri)
}

export default dbConnect
