import jwt from 'jsonwebtoken'
import UserServices from '../../services/user/UserServices.js'
import uniqidToken from 'uniqid'
const RegisterUser = async (req, res) => {
  try {
    let data = await UserServices.RegisterUserService(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

const comfirmEmail = async (req, res) => {
  try {
    let result = await UserServices.comfirmEmailRegister(req.query.key)
    return res.status(200).json(result)

  } catch (error) {
    console.log(error)

    return res.status(400).json(error)
  }
}

const getCurrentUser = async (req, res) => {
  const _id = req.user
  try {
    let data = await UserServices.getCurrentService(_id)
    delete data.dataUser.Password
    delete data.dataUser.UserID
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

const refreshNewAccessToken = async (req, res) => {
  try {
    const cookie = req.cookies


    if (!cookie || !cookie.refresh_token)
      return res.status(400).json({
        err: -1,
        errMessage: 'No refresh Token in cookie'
      })


    // Check if the Token is still valid or not
    jwt.verify(
      cookie.refresh_token,
      process.env.JWT_SECRET,
      async (err, decode) => {
        if (err)
          return res.status(400).json({ err: 1, errMessage: 'Invalid Token' })
        //  if The token is still valid => check the Token with Database
        const data = await UserServices.refreshNewAccessTokenService(
          decode._id,
          cookie.refresh_token
        )
        return res.status(200).json(data)
      }
    )
  } catch (e) {
    return res.status(400).json(e)
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.query
    if (!email)
      return res.status(400).json({
        err: -1,
        errMessage: 'Missing data required'
      })
    let result = await UserServices.forgotPasswordServices(email)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}


const resetNewPassword = async (req, res) => {
  try {
    const result = await UserServices.resetPasswordServices(req.body)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}


const getUsers = async (req, res) => {
  try {
    const result = await UserServices.getAllUsers()
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}


const DeleteUser = async (req, res) => {
  try {
    const result = await UserServices.deleteUser(req.query.id)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}


const UpdateUser = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.updateUser(req.body, _id)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}


const CreateNewCart = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.createNewCartServices(req.body, _id)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}


const getItemInCart = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.getAllItemInCartServices(_id)
    return res.status(200).json(result)

  } catch (e) {
    return res.status(400).json(e)
  }
}

const createUserAddress = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.addAddressUser(req.body, _id)
    return res.status(200).json(result)

  } catch (e) {
    console.log(e)

    return res.status(400).json({
      errMessage: 'ERR FROM NERON',
      e
    })
  }
}

const getUserAddress = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.getAllAddressUser(_id)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errMessage: 'NERON BUGSSSS',
      e
    })

  }
}

const getListOrderByUser = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.getListOrderByUserServices(_id)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errMessage: 'Neron Bugggg',
      e
    })
  }
}

const updateItemCart = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.updateCartItem(req.query, _id)
    return res.status(200).json(result)

  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errMessage: 'Bug',
      e: e
    })
  }
}

const GetListOrder = async (req, res) => {
  try {
    const result = await UserServices.GetListOrderAdmin()
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}
const ChangeStatusOrder = async (req, res) => {
  try {
    const result = await UserServices.changeStatusOrder(req.body)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}

const ratingProduct = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.createRatingProduct(req.body, _id)
    return res.status(200).json(result)

  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

const getAllUserIsActive = async (req, res) => {
  try {
    const result = await UserServices.getTotalUserActive()
    return res.status(200).json(result)

  } catch (e) {
    return res.status(400).json(e)
  }
}


const GetInforUserById = async (req, res) => {
  try {
    const result = await UserServices.getInforUserById(req.query.idUser)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(400).json(e)
  }
}

const getInforAboutOrder = async (req, res) => {
  try {
    const result = await UserServices.getInforAboutOrderServices(req.query.key)
    return res.status(200).json(result)

  } catch (e) {

    return res.status(400).json(e)
  }
}

const deleteItemInCart = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.deleteItemInCart(req.query.key, _id)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}

const updateProfile = async (req, res) => {
  try {
    const { _id } = req.user
    const result = await UserServices.updateProfileByUser(req.body, _id)
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}
export default {
  RegisterUser,
  getCurrentUser,
  refreshNewAccessToken,
  forgotPassword,
  getUsers,
  resetNewPassword,
  DeleteUser,
  UpdateUser,
  CreateNewCart,
  getItemInCart,
  createUserAddress,
  getUserAddress,
  getListOrderByUser,
  updateItemCart,
  GetListOrder,
  ChangeStatusOrder,
  ratingProduct,
  comfirmEmail,
  getAllUserIsActive,
  GetInforUserById,
  getInforAboutOrder,
  deleteItemInCart,
  updateProfile
}
