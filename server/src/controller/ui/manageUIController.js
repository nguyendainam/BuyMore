import uiServices from '../../services/UI/uiServices.js'

const createCarouselImage = async (req, res) => {
  try {
    const result = await uiServices.createCarouserServices(req.body)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(404).json(e)
  }
}

const getCarouselImage = async (req, res) => {
  try {
    const result = await uiServices.getCarouselImageService(req.query.key)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(404).json(e)
  }
}

const uploadImageProduct = async (req, res) => {
  try {
    const result = await uiServices.uploadImageServices(req.body)
    return res.status(200).json(result)
  } catch (e) {
    res.status(404).json(e)
  }
}

const deleteImageProduct = async (req, res) => {
  try {
    const result = await uiServices.removeImageServices(req.body)
    return res.status(200).json(result)

  } catch (e) {
    res.status(400).json(e)
  }
}




export default {
  createCarouselImage,
  getCarouselImage,
  uploadImageProduct,
  deleteImageProduct,

}
