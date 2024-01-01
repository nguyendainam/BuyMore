
// export const validateEmail = (email: string) => {

//     return true
// }

export const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isValidEmail = emailRegex.test(email)
    return isValidEmail
}


export const validatePassword = (password: string) => {
    const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,}$/;
    const checkValidatePass = regExp.test(password)
    return checkValidatePass
}