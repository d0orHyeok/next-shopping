import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'
import fs from 'fs'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { password, image } = req.body

    if (!password === undefined && image === undefined) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const { user } = req

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        return res.status(400).json({
          success: false,
          message: '기존과 다른 비밀번호를 입력해주세요.',
        })
      }

      user.password = password

      await user.save()
      return res.status(200).json({ success: true })
    } else {
      const currentImage = user.image

      user.image = image === '' ? '/temp_user.png' : image
      const newUser = await user.save()

      console.log(currentImage)

      if (currentImage !== '/temp_user.png') {
        await fs.unlinkSync(`public${currentImage}`)
      }

      return res.status(200).json({ success: true, image: newUser.image })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
