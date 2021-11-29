import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '@models/User'
import { IUserDocument } from '@interfaces/iModels/iUser.interfaces'
import database from '@middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.post((req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body
  // Email에 해당하는 유저가 있는지 확인
  User.findOne({ email: body.email }, (err: Error, user: IUserDocument) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: '서버 오류',
        err,
      })
    }
    if (!user) {
      return res.status(422).json({
        success: false,
        message: '해당하는 Email을 찾을 수 없습니다.',
      })
    }
    // 비밀번호 확인
    user.comparePassword(body.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: '서버 오류',
          err,
        })
      }
      if (!isMatch) {
        return res.status(422).json({
          success: false,
          message: '잘못된 비밀번호 입니다.',
        })
      }
      // 토큰 생성
      user.generateToken((err, user: IUserDocument) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: '서버 오류',
            err,
          })
        }
        res.setHeader(
          'Set-Cookie',
          `w_auth=${user.token}; Max-Age=3600; HttpOnly; Secure`
        )
        res.status(200).json({ success: true })
      })
    })
  })
})

export default handler
