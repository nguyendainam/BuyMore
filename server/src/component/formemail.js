import * as dotenv from 'dotenv'
import nodemailer from 'nodemailer'
// import asyncHandler from 'express-async-handler'
import { Subject } from './enum.js'

dotenv.config()
const sendEmail = async (email, html) => {
  console.log('Hello', email)

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
      ciphers: 'SSLv3'
    }
  })

  const info = await transporter.sendMail({
    from: {
      name: 'Buymore',
      address: 'no-reply@gmail.com'
    },
    to: email,
    subject: Subject.forgotPasswordEN,
    html: html // html body
  })

  return info
}

export default sendEmail
