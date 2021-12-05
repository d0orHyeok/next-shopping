import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler.post(async (req, res) => {
  fs.unlink(`public/${req.body.path}`, (err) => {
    if (err) return res.json({ success: false, err })
    return res.json({ success: true })
  })
})

export default handler
