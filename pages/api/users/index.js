import dbConnect from "../../../lib/dbConnect"
import User from "../../../models/user"

export default async function handler ( req, res ) {
  
  const { method } = req

  await dbConnect()

  switch ( method ) {

    case 'GET':

      try {

        const users = await User.find({})
        res.status(200).json({
          success: true,
          data: users
        })

      } catch ( error ) {

        res.status(400).json({
          success: false,
          message: error.message
        })

      }

    break

    default:

      res.status(400).json({
        success: false,
        message: 'Unknown method.'
      })

      break
  }
}