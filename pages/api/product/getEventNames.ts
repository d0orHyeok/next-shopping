import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.get(async (req, res) => {
  try {
    const eventNames = await Product.find()
      .select('event_name')
      .distinct('event_name')
      .exec()

    console.log(eventNames)

    res.status(200).json({ success: true, eventNames })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
