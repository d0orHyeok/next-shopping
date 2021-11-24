import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User, { IUserDocument } from '@models/User'
import database from '@middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.post((req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body)
  // Email에 해당하는 유저가 있는지 확인
  User.findOne({ email: body.email }, (err: Error, user: IUserDocument) => {
    if (err) {
      return res.status(400).json({
        success: false,
        err,
      })
    }
    if (!user) {
      return res.status(422).json({
        success: false,
        message: 'Email not found',
      })
    }
    // 비밀번호 확인
    user.comparePassword(body.password, (err, isMatch) => {
      if (err) {
        return res.status(400).json({
          success: false,
          err,
        })
      }
      if (!isMatch) {
        return res.status(422).json({
          success: false,
          message: 'Wrong password!',
        })
      }
      // 토큰 생성
      user.generateToken((err, user: IUserDocument) => {
        if (err) {
          return res.status(400).json({
            success: false,
            err,
          })
        }
        res.setHeader(
          'Set-Cookie',
          `w_auth=${user.token}; Max-Age=3600; HttpOnly; Secure`
        )
        res.status(200).json({ success: true, userId: user._id })
      })
    })
  })
})

export default handler
