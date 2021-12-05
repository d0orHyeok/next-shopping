import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'

interface ExtendRequset {
  file: {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size: number
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})
const upload = multer({ storage: storage }).single('file')

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(upload)

handler.post<ExtendRequset>(async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      filePath: req.file.path.replace(/\\/gi, '/').replace('public', ''),
      fileName: req.file.filename,
    })
  } catch (err) {
    return res.status(500).json({ success: false, err })
  }
})

export default handler

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}
