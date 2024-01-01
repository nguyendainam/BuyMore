import * as dotenv from 'dotenv'
dotenv.config()

export const fomatForgetPassword = data => {
  if (!data) {
    return false
  } else {
    if (data.language === 'vi') {
      return `
                <p>Xin chào, </p><p>Vui lòng nhấn vào liên kêt <a href='${process.env.URL_REACT}/api/user/reset-password/${data.token}'> Nhấn vào đây </a>, yêu cầu thay đổi của bạn sẽ được thực hiện</p>
                <p>Thời gian hiệu lực của đường dẫn là 15 phút. Nếu sau thời gian này lệnh thay đổi mật khẩu sẽ bị hủy.</p>
                <p>Đây là tin nhắn tự động vui lòng không trả lời tin nhắn này</p>
                `
    } else if (data.language === 'en') {
      return `
            <p>Hello, </p><p>Please click on the link <a href='${process.env.URL_REACT}/api/user/reset-password/${data.token}'> Click here </a>, your change request will be processed</p><p>The link validity period is 15 minutes. If after this time, the password change order will be canceled.</p><p>This is an automatic message, please do not reply to this message</p>
            `
    }
  }
}


export const RegisterUser = (newRandomNumbers) => {
  return `
  <p>Xin chào, </p><p>Vui lòng nhấn vào liên kêt <a href='${process.env.URL_REACT}/api/user/register-user/${newRandomNumbers}'> Nhấn vào đây </a>, yêu cầu thay đổi của bạn sẽ được thực hiện</p>
  <p>Thời gian hiệu lực của đường dẫn là 15 phút. Nếu sau thời gian này lệnh thay đổi mật khẩu sẽ bị hủy.</p>
  <p>Đây là tin nhắn tự động vui lòng không trả lời tin nhắn này</p>
  `
}
