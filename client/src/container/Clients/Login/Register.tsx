import React, { useState } from "react";
import style from "./Register.module.scss";

import {
  Alert,
  Button,
  Flex,
  Form,
  Input,
  Radio,
  Result,
  Spin,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../../components/Validate";
// import Select from '../../../components/datatest/Select'
import register from "../../../assets/image/register.png";
import FormData from "form-data";
import { registerUser } from "../../../services/user";
import { LoadingOutlined } from "@ant-design/icons";
type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean; // Change the type to boolean
};

const gender = [
  { key: "M", label: "Male" },
  { key: "F", label: "Female" },
  { key: "O", label: "Other" },
];

export default function Register() {
  const navigate = useNavigate();
  const [correctEmail, setCorrectEmail] = useState<boolean>(false);
  const [correctPass, setCorrectPass] = useState<boolean>(false);
  const [openLoading, setOpenLoading] = useState<boolean>(false);

  const [dataRegister, setDataRegister] = useState({
    username: "",
    email: "",
    gender: "M",
    password: "",
  });

  const handleOnChange = (value: string, key: string) => {
    setDataRegister((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    if (!correctEmail || !correctPass || !dataRegister.username) {
      message.error("Vui lòng kiểm tra lại thông tin ");
    } else {
      const formdata = new FormData();
      formdata.append("Email", dataRegister.email);
      formdata.append("UserName", dataRegister.username);
      formdata.append("Password", dataRegister.password);
      formdata.append("Gender", dataRegister.gender);

      const resultRegister = await registerUser(formdata);
      if (resultRegister.data.err === 0) {
        message.success("Đăng Ký thành công");
        setOpenLoading(true);
        // navigate('/login')
      } else {
        message.error("Đăng Ký thất bại");
      }
    }
  };

  return (
    <div className={style.mainRegister}>
      {openLoading ? (
        <div className={style.formLoading}>
          <Result
            icon={<LoadingOutlined />}
            title="Vui lòng kiểm tra email để xác nhận !"
          />
        </div>
      ) : (
        <div className={style.formRegister}>
          <div className={style.bgRight}>
            <img src={register} />
          </div>
          <div className={style.inputRegister}>
            <Form className={style.formTable} layout="vertical">
              <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  className={style.formInputReg}
                  value={dataRegister.username}
                  onChange={(event) =>
                    handleOnChange(event.target.value, "username")
                  }
                />
              </Form.Item>
              <Form.Item<FieldType> label="Gender">
                <Radio.Group
                  defaultValue={"M"}
                  onChange={(event) =>
                    handleOnChange(event.target.value, "gender")
                  }
                >
                  <Radio value="M">Nam</Radio>
                  <Radio value="F">Nữ </Radio>
                  <Radio value="O"> Khác </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item<FieldType>
                label="Email"
                name="email"
                required
                rules={[
                  { required: true, message: "Please input your username!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const isValistEmail = validateEmail(value);
                      if (
                        !value ||
                        (isValistEmail && getFieldValue("email") === value)
                      ) {
                        setCorrectEmail(true);
                        return Promise.resolve();
                      }

                      setCorrectEmail(false);
                      return Promise.reject("Email không hợp lệ");
                    },
                  }),
                ]}
              >
                <Input
                  className={style.formInputReg}
                  value={dataRegister.email}
                  onChange={(event) =>
                    handleOnChange(event.target.value, "email")
                  }
                />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                required
                hasFeedback
                rules={[
                  { required: true, message: "Please input your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const isValidPass = validatePassword(value);

                      if (
                        !value ||
                        (isValidPass && getFieldValue("password") === value)
                      ) {
                        setCorrectPass(true);
                        return Promise.resolve();
                      } else if (value.length < 8) {
                        setCorrectPass(false);
                        return Promise.reject("Password must less than 8");
                      }
                      setCorrectPass(false);
                      return Promise.reject(
                        "Password must contain capital letters and numbers"
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  className={style.formInputReg}
                  value={dataRegister.password}
                  onChange={(event) =>
                    handleOnChange(event.target.value, "password")
                  }
                />
              </Form.Item>

              <Form.Item<FieldType>
                label="Comfirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please input your Confirm Password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        setCorrectPass(true);
                        return Promise.resolve();
                      }
                      setCorrectPass(false);
                      return Promise.reject("The two passwords do not match!");
                    },
                  }),
                ]}
              >
                <Input.Password className={style.formInputReg} />
              </Form.Item>

              <div className={style.formBtn}>
                <Button className={style.btnPrimary} onClick={handleRegister}>
                  Register
                </Button>
                <Button
                  className={style.btnBlue}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
