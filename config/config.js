const prod = process.env.NODE_ENV === 'production'
module.exports = {
  backendUrl: prod ? 'http://localhost:3000' : 'http://localhost:3000',
}
