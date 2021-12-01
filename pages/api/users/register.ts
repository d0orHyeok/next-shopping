import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '@models/User'
import database from '@middlewares/database'

const handler = nextConnect()

handler.use(database)
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = new User(req.body)
    await user.save()

    res.status(200).json({ success: true, message: '회원가입 되었습니다.' })
  } catch (error) {
    error.code === 11000
      ? res
          .status(400)
          .json({ success: false, message: '이미 존재하는 회원정보입니다.' })
      : res.status(500).json(error)
  }
})

export default handler
