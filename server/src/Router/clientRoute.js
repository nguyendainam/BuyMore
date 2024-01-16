import { Router } from 'express'
import UserController from '../controller/user/UserController.js'
import LoginController from '../controller/login/LoginController.js'
import { verifyAccessToken, isAdmin } from '../component/verifyToken.js'
import OrderController from '../controller/order/OrderController.js'
import recommendController from '../controller/reccommend/recommendController.js'
const router = Router()



router.post('/login', LoginController.LoginUser)
router.post('/logout', LoginController.LogOut)

//  get AccessToken and return the information  User
router.post('/registerUser', UserController.RegisterUser)
router.get('/comfirmEmail', UserController.comfirmEmail)

router.post('/updateProfile', verifyAccessToken, UserController.updateProfile)


// /////////////
router.get('/currentUser', verifyAccessToken, UserController.getCurrentUser)
router.post('/refreshToken', UserController.refreshNewAccessToken)
router.get('/forgotPassword', UserController.forgotPassword)
router.post('/api/user/reset-password', UserController.resetNewPassword)
router.get('/api/updateUser', verifyAccessToken, UserController.UpdateUser)
router.get('/api/updateUser', verifyAccessToken, UserController.UpdateUser)
router.post('/api/createAddress', verifyAccessToken, UserController.createUserAddress)
router.get('/api/getUserAddress', verifyAccessToken, UserController.getUserAddress)
router.post('/api/ratingProduct', verifyAccessToken, UserController.ratingProduct)
//  
router.get('/system/getUsers', verifyAccessToken, isAdmin, UserController.getUsers)
router.get('/system/deleteUser', verifyAccessToken, isAdmin, UserController.DeleteUser)
router.get('/system/getAllListOrder', verifyAccessToken, isAdmin, UserController.GetListOrder)
router.get('/system/getInforUserById', verifyAccessToken, isAdmin, UserController.GetInforUserById)
router.post('/system/changeStatusItem', verifyAccessToken, isAdmin, UserController.ChangeStatusOrder)
router.get('/system/getInforAboutOrder', UserController.getInforAboutOrder)
// 
router.post('/addToCart', verifyAccessToken, UserController.CreateNewCart)
router.post('/order/createNewOrder', verifyAccessToken, OrderController.CreateNewOrder)
router.get('/getAllItemInCart', verifyAccessToken, UserController.getItemInCart)
router.get('/getUpdateItemCart', verifyAccessToken, UserController.updateItemCart)
router.get('/getOrderByUser', verifyAccessToken, UserController.getListOrderByUser)
router.get('/system/getTotalUserActive', UserController.getAllUserIsActive)
router.get('/delete/ItemsInCart', verifyAccessToken, UserController.deleteItemInCart)





// 
router.get('/api/reccommendProduct', recommendController.getDataTraining)





export default router
