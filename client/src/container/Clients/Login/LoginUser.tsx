import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
// import Header from '../Header/Header'
import style from './LoginUser.module.scss'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import { validateEmail } from '../../../components/Validate'
import { loginUser } from '../../../services/user'
import { MdErrorOutline, MdOutlineCancel } from "react-icons/md";
import FormData from 'form-data'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { saveAccessToken } from '../../../redux/Slice/userSlice'
type FieldType = {
  username?: string
  password?: string
  remember?: boolean // Change the type to boolean
}



interface IDataLogin {
  email: string,
  password: string
}

const LoginUser: React.FC = () => {
  const [correctEmail, setCorrectEmail] = useState<boolean>(false)
  const [dataLogin, setDataLogin] = useState<IDataLogin>({
    email: '',
    password: ''
  })
  const [err, setErr] = useState({
    isShow: false,
    errMessage: ''

  })

  const handleOnChange = (value: string, key: string) => {
    setDataLogin(prevState => (
      {
        ...prevState,
        [key]: value
      }
    ))
  }
  const naviage = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = async () => {
    if (correctEmail) {
      const formdata = new FormData
      formdata.append('Email', dataLogin.email)
      formdata.append('Password', dataLogin.password)
      const result = await loginUser(formdata)
      if (result.data.err === 0) {

        const token = result.data.accessToken
        dispatch(saveAccessToken({ accessToken: token }));

        message.success('Create data successfull ')
        setTimeout(() => {
          naviage("/")
        }, 3000);
      } else {
        setErr(prevState => ({
          ...prevState,
          isShow: true,
          errMessage: 'Login failed'
        })


        )
        setTimeout(() => {
          setErr(prevState => ({
            ...prevState,
            isShow: false,
            errMessage: 'Login failed'
          }))

        }, 3000);

      }
    } else {
      message.error("Vui lòng nhập đúng thông tin")
    }
  }

  return (
    <>
      <div className={style.mainFormLogin}>
        {/* <Header /> */}
        <div className={style.formLogin}>
          <div className={style.formMaxWidth}>
            <div className={style.formTitle}>
              Đăng nhập
            </div>
            {err.isShow && (
              <div className={style.messageBar}>
                <div className={style.left}>
                  <MdErrorOutline />
                  <span className={style.notify}>{err.errMessage}</span>
                </div>
                <div className={style.right}>
                  <MdOutlineCancel />
                </div>
              </div>
            )}
            <Form
              labelCol={{ span: 10 }}
              className={style.Logincustome}
            >
              <Form.Item<FieldType>
                label='Email'
                name='username'
                required
                rules={[
                  { required: true, message: 'Please input your username!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const isValistEmail = validateEmail(value)
                      if (!value || (isValistEmail && getFieldValue('username') === value)) {
                        setCorrectEmail(true)
                        return Promise.resolve();
                      }

                      setCorrectEmail(false)
                      return Promise.reject('Email KhÔNG hợp lệ')

                    }
                  })
                ]}


              >
                <Input className={style.formInputcustomMin}
                  value={dataLogin.email}
                  onChange={(event) => handleOnChange(event.target.value, 'email')}

                />
              </Form.Item>

              <Form.Item<FieldType>
                label='Password'
                name='password'
                required
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password className={style.formInputcustomMin}
                  value={dataLogin.password}
                  onChange={(event) => handleOnChange(event.target.value, 'password')}
                />
              </Form.Item>
            </Form>
            <div className={style.formButton}>
              <Button className={style.btnPrimary}
                onClick={handleLogin}
              >Login </Button>
            </div>

            <div className={style.formSocial}>
              <div className={style.icons}>
                <FcGoogle />
              </div>
              <div className={style.icons}>
                <FaFacebook />
              </div>
            </div>

            <div>Bạn chưa có tài khoản <Link to={'/register'} >Đăng Ký ngay</Link></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginUser
