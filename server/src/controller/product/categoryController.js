import categoryServices from '../../services/product/categoryServices.js'

//  category => create List Category
const createCategory = async (req, res) => {
  try {
    let result = await categoryServices.createOrUpdateCategory(req.body)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

const getAllcategory = async (req, res) => {
  try {
    let result = await categoryServices.getAllCategoryServices()
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

/*
 *
 *
 *
 *
 */
const createItemListCat = async (req, res) => {
  try {
    let result = await categoryServices.createOrUpdateItesmToList(req.body)

    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}

const getAllListCategory = async (req, res) => {
  try {
    let result = await categoryServices.getAllListCategoryServices()
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

/*
 *
 *
 *
 *
 */

const createOrUpdateItemCategory = async (req, res) => {
  try {
    let result = await categoryServices.createOrUpdateItemCategory(req.body)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}

const getItemCategoryById = async (req, res) => {
  try {
    let result = await categoryServices.getItemCategoryById(req.query.key)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

const ProductType = async (req, res) => {
  try {
    let result = await categoryServices.createOrUpdateProductType(req.body)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

const getAllProductType = async (req, res) => {
  try {
    let result = await categoryServices.getAllProductType()
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}


const getListCategoryHomepage = async (req, res) => {
  try {
    let result = await categoryServices.getListCatHomePage()
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}

export default {
  createCategory,
  createItemListCat,
  createOrUpdateItemCategory,
  getAllcategory,
  getAllListCategory,
  getItemCategoryById,
  ProductType,
  getAllProductType,
  getListCategoryHomepage
}
