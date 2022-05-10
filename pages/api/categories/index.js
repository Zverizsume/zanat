import dbConnect from "../../../lib/dbConnect"
import Category from "../../../models/category"

export default async function handler ( req, res ) {
  const { method } = req

  await dbConnect()

  switch ( method ) {
    case 'GET':

      try {

        const categories = await Category.find({})
        res.status(200).json({
          success: true,
          data: categories
        })

      } catch ( error ) {

        res.status(400).json({
          success: false,
          message: error.message
        })

      }

      break

    case 'POST':

      try {

        console.log(req.body)
        const category = await Category.create(
          req.body
        )
        res.status(201).json({
          success: true,
          data: category
        })

      } catch ( error ) {

        res.status(400).json({
          success: false,
          message: error.message
        })

      }

      break

    case 'DELETE':

      try {

          let nOfDeletedCategories = await Category.deleteMany( { _id: { $in: req.body.ids } } )
          res.status(200).json({
            success: true,
            data: nOfDeletedCategories
          })

      } catch ( error ) {

        res.status(400).json({
          success: false,
          message: error.message
        })

      }

    break

    case 'PUT':

      try {

        const updatedCategory = await Category.findByIdAndUpdate( req.body.id, { title: req.body.title, description: req.body.description } )
        res.status(200).json({
          success: true,
          data: updatedCategory
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