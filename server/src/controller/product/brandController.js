import brandServices from '../../services/product/brandServices.js'

const createOrUpdate = async (req, res) => {
  try {
    let result = await brandServices.CreateOrUpdateBrand(req.body)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      err: -1,
      about: e
    })
  }
}

const getAllBrands = async (req, res) => {
  try {
    let result = await brandServices.getAllBrands()
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

export default {
  createOrUpdate,
  getAllBrands
}
