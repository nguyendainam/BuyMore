import React, { useEffect, useState } from "react";
import style from "./ChangeProfile.module.scss";
import { useSelector } from "react-redux";
import { Button, Input, Radio, message } from "antd";
import FormData from "form-data";
import { updateProfileByUser } from "../../../services/user";
import { useTranslation } from "react-i18next";

export default function ChangeProfile() {
  const { current } = useSelector((state) => state.user);
  const gender = [
    { label: "Male", value: "M" },
    { label: "FeMale", value: "F" },
    { label: "Other", value: "O" },
  ];
  const [userInfor, setUserInfor] = useState({
    userName: "",
    gender: "",
  });

  useEffect(() => {
    const handler = async () => {
      setUserInfor({
        userName: current.UserName,
        gender: current.Gender,
      });
    };

    handler();
  }, []);

  const handleOnChange = (value: string, key: string) => {
    setUserInfor((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const { t } = useTranslation();

  const handleOnUpdate = async () => {
    const formdata = new FormData();
    formdata.append("userName", userInfor.userName);
    formdata.append("gender", userInfor.gender);
    const result = await updateProfileByUser(formdata);
    if (result.data.err === 0) {
      message.success(t("updateSuccess"));
    } else {
      message.error(t("updateFailed"));
    }
  };

  return (
    <div className={style.mainChangeProfile}>
      <div className={style.formTitlePro}>
        <div className={style.f14gray}>Hồ sơ của tôi</div>
        <div className={style.smallfont}>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>

      <div className={style.information}>
        <div className={style.itemInfor}>
          <div className={style.des}>Tên Đăng Nhập</div>
          <span>{current.Email}</span>
        </div>
        <div className={style.itemInfor}>
          <div className={style.des}>Name</div>
          <Input
            className={style.formInputcustomMin}
            value={userInfor.userName}
            onChange={(event) => handleOnChange(event.target.value, "userName")}
          />
        </div>
        <div className={style.itemInfor}>
          <div className={style.des}>Email</div>
          <span>{current.Email}</span>
        </div>

        <div className={style.itemInfor}>
          <div className={style.des}>Số điện thoại</div>
          {/* <span>{current.Email}</span> */}
        </div>

        <div className={style.itemInfor}>
          <div className={style.des}>Gender</div>
          <Radio.Group
            options={gender}
            value={userInfor.gender}
            onChange={(event) => handleOnChange(event.target.value, "gender")}
          />
        </div>

        <Button className={style.btnBlue} onClick={handleOnUpdate}>
          Lưu
        </Button>
      </div>
    </div>
  );
}
