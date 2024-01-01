import bcrypt from 'bcryptjs'



const salt = bcrypt.genSaltSync(10)
const hash = bcrypt.hashSync('B4c0//', salt)
export const validateEmail = email => {
  const token =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (email.match(token)) {
    return true
  } else {
    return false
  }
}

export const checkPasswordUser = password => {
  const token =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,}$/
  if (password.match(token)) {
    return true
  } else {
    return false
  }
}

export const hashUserPassword = async password => {
  if (!password) {
    return false
  } else {
    const hashPassword = await bcrypt.hash(password, hash)
    return hashPassword
  }
}

export const confirmPassword = async (password, hardPassword) => {
  if (!password | !hardPassword) {
    return false
  } else {
    let checkPassword = await bcrypt.compareSync(password, hardPassword)
    return checkPassword
  }
}



