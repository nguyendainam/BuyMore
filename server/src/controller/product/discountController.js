import discountServices from '../../services/product/discountServices.js'

const createOrUpdateDiscount = async (req, res) => {
  try {
    let result = await discountServices.createOrupdate(req.body)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

const getAllDiscount = async (req, res) => {
  try {
    let result = await discountServices.getAllDiscountServices()
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

export default {
  createOrUpdateDiscount,
  getAllDiscount
}
