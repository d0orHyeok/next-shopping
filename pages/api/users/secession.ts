import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)

handler.get<IAuthExtendedRequest>(async (req, res) => {
  try {
    await req.user.delete()

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default handler
