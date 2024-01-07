import React, { useEffect, useState } from "react";
import { Button, Result, Spin } from "antd";
import style from "./ComfirmRegister.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { comfirmEmail } from "../../../services/user";
import { LoadingOutlined } from "@ant-design/icons";
export default function ComfirmRegister() {
  const [caseRender, setCate] = useState<number>(1);
  const navigate = useNavigate();

  const [isComfirmed, setIsComfirmed] = useState(false);

  const renderCase = () => {
    switch (caseRender) {
      case 1:
        return (
          <div className={style.formMain}>
            <Result
              status="success"
              title="Đăng ký thành công!"
              extra={[
                <Button onClick={() => navigate("/login")}>Đăng nhập</Button>,
              ]}
            />
          </div>
        );

      case 2:
        return (
          <div className={style.formMain}>
            <Result
              status="error"
              title="Đăng ký không thành công!"
              extra={[
                <Button onClick={() => navigate("/")}>
                  Trở về trang chính
                </Button>,
                <Button onClick={() => navigate("/register")}>
                  Quay Lại trang đăng ký
                </Button>,
              ]}
            />
          </div>
        );
      default:
        return (
          <div>
            <Result
              title="Đang kiểm tra...."
              extra={[
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />}
                />,
              ]}
            />
          </div>
        ); // or some default case
    }
  };

  const { token } = useParams();

  const handleComfirmEmail = async () => {
    try {
      const result = await comfirmEmail(token);
      console.log(result.data);

      if (result.data.err === -1) {
        setCate(2);
        setIsComfirmed(true);
      }

      if (result.data.err === 0) {
        setCate(1);
        setIsComfirmed(true);
      }
    } catch (error) {
      console.error("Error confirming email:", error);
    }
  };

  return (
    <div className={style.mainView}>
      {isComfirmed === false ? (
        <div className={style.formMain}>
          <Result
            title="Xác nhận đăng ký...."
            extra={[
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />}
              />,
            ]}
          />
          <Button className={style.btnComfirm} onClick={handleComfirmEmail}>
            Xác Nhận{" "}
          </Button>
          <Button className={style.btnCancel}>Hủy </Button>
        </div>
      ) : (
        renderCase()
      )}
    </div>
  );
}
