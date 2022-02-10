import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@libs/connectDB'
import User from '@models/User'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'test@test.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _) {
        await dbConnect()

        const user = await User.findOne({ email: credentials.email })

        if (!user) {
          throw new Error('User not found')
        }

        const isMatch = await user.asyncComparePassword(credentials.password)

        if (isMatch === false) {
          throw new Error('Incorrect Password')
        }

        return user
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECREAT,
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session, token }) {
      const user = await User.findOne({ _id: token.sub })
      if (user) {
        session.userData = {
          _id: user._id,
          isAdmin: user.role === 0 ? false : true,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          deliveryAddrs: user.deliveryAddrs,
          likes: user.likes,
          cart: user.cart,
        }
        return session
      }
      return null
    },
  },
})
