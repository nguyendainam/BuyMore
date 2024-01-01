import crypto from 'crypto'
import { ResetExpires } from './enum.js'
export const randomInterger = () => {
  const min = Math.pow(10, 8)
  const max = Math.pow(10, 9) - 1
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const createPasswordChangeToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex')
  const passwordResetToken = crypto
    .createHash('SHA256')
    .update(resetToken)
    .digest('hex')
  const passwordResetExpires = ResetExpires
  return {
    resetToken,
    passwordResetToken,
    passwordResetExpires
  }
}
export const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result + Date.now();
};


