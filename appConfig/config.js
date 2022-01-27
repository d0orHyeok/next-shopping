const prod = process.env.NODE_ENV === 'production'
module.exports = {
  backendUrl: prod
    ? 'https://next-shopping-seven.vercel.app/'
    : 'http://localhost:3000',
}
