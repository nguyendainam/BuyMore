import {
  validateEmail,
  confirmPassword
} from '../../component/checkInformation.js'
import { connectDB } from '../../connectDB/index.js'
import jwt from '../../component/jwt.js'
import mssql from 'mssql'
import { randomInterger } from '../../component/random.js'

const LoginUserServices = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.Email || !data.Password) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        let checkEmail = validateEmail(data.Email)
        if (!checkEmail) {
          resolve({
            err: -2,
            errMessage: 'Email is not validate'
          })
        } else {
          let pool = await connectDB()
          let findOneEmail = await pool
            .request()
            .query(`SELECT * from Users WHERE Email = '${data.Email}'`)
          if (findOneEmail.rowsAffected[0] === 1) {
            let passwordHardUser = findOneEmail.recordset[0].Password
            let checkPassword = await confirmPassword(
              data.Password,
              passwordHardUser
            )
            if (checkPassword) {
              const iUs = findOneEmail.recordset[0].UserID
              const role = findOneEmail.recordset[0].RoleId
              const accessToken = await jwt.generateAccessToken(iUs, role)
              const refreshToken = await jwt.generateRefreshToken(iUs)

              const Id = randomInterger()
              const ExpiryTime = new Date()
              // Update or create accout to UserSessions
              await pool
                .request()
                .input('SessionID', mssql.Int, Id)
                .input('UserID', mssql.VarChar, iUs)
                .input('Token', mssql.VarChar, refreshToken)
                .input('ExpiryTime', mssql.DateTime, ExpiryTime).query(`
                MERGE INTO UserSessions AS target
                USING (VALUES (@SessionID, @UserID, @Token, @ExpiryTime)) AS source (SessionID, UserID, Token, ExpiryTime)
                ON target.UserID = source.UserID
                WHEN MATCHED THEN
                UPDATE SET
                        Token = source.Token,
                        ExpiryTime = source.ExpiryTime
                WHEN NOT MATCHED THEN
                    INSERT (SessionID, UserID, Token, ExpiryTime)
                    VALUES (source.SessionID, source.UserID, source.Token, source.ExpiryTime);
                `)
              const currenUser = {
                UserName: findOneEmail.recordset[0].UserName,
                Gender: findOneEmail.recordset[0].Gender,
                // Role: findOneEmail.recordset[0].Role
              }



              resolve({
                err: 0,
                errMessage: 'Login Successfull',
                currenUser,
                accessToken,
                refreshToken
              })
            } else {
              resolve({
                err: 3,
                errMessage: 'Incorrect password'
              })
            }
          } else {
            resolve({
              err: 2,
              errMessage: 'Email not found'
            })
          }
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

const LogoutUserServices = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await connectDB()
      const updateSession = await pool.request().query(`UPDATE UserSessions SET Token = '' WHERE Token = '${refreshToken}'`)
      if (updateSession) {
        resolve({
          err: 0,
          errMessage: 'Logout Success'
        })
      }
      resolve({
        err: 1,
        errMessage: 'Logout Failed'
      })

    } catch (e) {
      reject(e)
    }
  })
}

export default {
  LoginUserServices,
  LogoutUserServices
}
