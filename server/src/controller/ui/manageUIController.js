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
    return
  } catch (e) {
    return res.status(404).json(e)
  }
}

export default {
  createCarouselImage,
  getCarouselImage
}
