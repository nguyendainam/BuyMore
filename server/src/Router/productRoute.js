import { Router } from 'express'
import categoryController from '../controller/product/categoryController.js'
import brandController from '../controller/product/brandController.js'
import productController from '../controller/product/productController.js'
import discountController from '../controller/product/discountController.js'
import manageUIController from '../controller/ui/manageUIController.js'
import recommendController from '../controller/reccommend/recommendController.js'
import { verifyAccessToken } from '../component/verifyToken.js'
const router = Router()

router.post('/system/CandUCategory', categoryController.createCategory)
router.post('/system/CandUListCategory', categoryController.createItemListCat)
router.post(
  '/system/CandUItemsCategory',
  categoryController.createOrUpdateItemCategory
)

router.get(
  '/system/getAllItemCategorybyId',
  categoryController.getItemCategoryById
)
router.post('/system/creOrUpdProductType', categoryController.ProductType)
router.get('/system/getAllProductType', categoryController.getAllProductType)

router.get('/system/getAllCategory', categoryController.getAllcategory)
router.get('/system/getAllListCategory', categoryController.getAllListCategory)



router.get('/system/getCategoryHomeClient', categoryController.getListCategoryHomepage)
// CRUD BRAND

router.post('/system/createOrupdateBrand', brandController.createOrUpdate)
router.get('/system/getAllBrand', brandController.getAllBrands)
//  CRUD DISCOUNT
router.post(
  '/system/createOrUpdateDiscount',
  discountController.createOrUpdateDiscount
)
router.get('/system/getAllDiscount', discountController.getAllDiscount)


// CRUD PRODUCT

router.post('/system/createProduct', productController.createProduct)
router.get('/system/getAllProduct', productController.getAllProduct)
router.get('/system/getAllProductDashboad', productController.getAllProductDashboard)
router.get('/system/getProductbyId', productController.getProductById)
router.get('/system/getProductbyType', productController.getProductbyTypeProduct)
router.get('/system/getProductbyTypeNew', productController.getProductbyTypeProductNew)
// router.get('/system/getProductByOptions', productController.getListOrderByOption)
router.get('/system/handleSearchProduct', productController.handleOnSearch)

router.get('/system/getProductByTags', productController.getProductByTag)
router.post('/system/createDescription', productController.createDescriptionPR)
router.get('/system/getDescription', productController.getDescriptionPR)
router.get('/system/getRatingProduct', productController.getRatingProduct)
router.get('/system/getAllRatingProduct', productController.getRatingAllProduct)
router.get('/system/createProductIvenEdit', productController.createProductIvenEdit)
router.get('/system/deleteProductIvenEdit', productController.deleteProductIvenEdit)
router.post('/system/updateProduct', productController.updateProduct)

//  CRUD UI

router.post('/system/ui/createCarousel', manageUIController.createCarouselImage)
router.get('/system/ui/getImgCarousel', manageUIController.getCarouselImage)


router.post('/system/uploadImage', manageUIController.uploadImageProduct)
router.post('/system/deleteImage', manageUIController.deleteImageProduct)

//  training data

router.get('/system/createDataTraining', recommendController.createdataToSql)
router.get('/system/createDataTrainingAfterLogin', verifyAccessToken, recommendController.createdataToSqlHaveAccount)
router.get('/system/getProductByRating', verifyAccessToken , recommendController.getProductByRating)







export default router
