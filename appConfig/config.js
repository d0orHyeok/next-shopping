const prod = process.env.NODE_ENV === 'production'
module.exports = {
  backendUrl: prod
    ? process.env.NEXT_PUBLIC_BACKEND_URI
    : 'http://localhost:3000',
}
