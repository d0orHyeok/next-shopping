import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>((req, res) => {
  const { user, body } = req

  if (!body || !body.password) {
    return res
      .status(400)
      .json({ success: false, message: '잘못된 요청입니다.' })
  }

  user.comparePassword(body.password, (err, isMatch) => {
    if (err) {
      return res.status(500).json({ err })
    }
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '잘못된 비밀번호 입니다.',
      })
    } else {
      return res.status(200).json({ success: true })
    }
  })
})

export default handler
