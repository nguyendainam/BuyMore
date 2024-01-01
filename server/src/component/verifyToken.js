import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

export const verifyAccessToken = asyncHandler(async (req, res, next) => {


  if (req?.headers?.authorization?.startsWith('Bearer')) {
    // Token bat dau bang Bearer moi lam viec tiep
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        console.log(err)
        res.status(401).json({
          err: -1,
          errMessage: 'Invalid access token '
        })
      } else {
        req.user = decode
        next()
      }
    })
  } else {
    return res.status(404).json({
      err: -1,
      errMessage: 'Require authorization !!! '
    })
  }
})


export const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user
  if (role !== 'Admin') return res.status(400).json({
    err: -1,
    errMessage: 'Require admin role'
  })
  next()
})