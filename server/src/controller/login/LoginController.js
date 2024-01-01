import { MaxDays } from '../../component/enum.js'
import LoginServices from '../../services/login/LoginServices.js'
import jwt from 'jsonwebtoken'
let LoginUser = async (req, res) => {
  try {
    let data = await LoginServices.LoginUserServices(req.body)
    //  save refresh token in cookie
    res.cookie('refresh_token', data.refreshToken, {
      httpOnly: true,
      maxAge: MaxDays
    })

    console.log(data.refreshToken, 'cookieeeeeeeeeeeee')


    delete data.refreshToken
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json(e)
  }
}


const LogOut = async (req, res) => {
  try {
    const cookie = req.cookies
    if (!cookie || !cookie.refresh_token) return res.status(400).json({
      err: -1,
      errMessage: 'No refresh token in cookies'
    })
    let updateSession = await LoginServices.LogoutUserServices(cookie.refresh_token)

    //  delete refresh_token in cookie

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true
    })
    return res.status(200).json(updateSession)
  } catch (e) {
    return res.status(400).json(e)
  }


}

export default {
  LoginUser,
  LogOut
}
