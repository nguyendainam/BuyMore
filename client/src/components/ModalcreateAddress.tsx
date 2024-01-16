import React, { useEffect, useState } from "react";
import { Select, Input, Modal, Typography, Button, Form, message } from "antd";
import style from "../assets/style/styleModal.module.scss";
import { UserOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { getDataLocation } from "./Location";
import FormData from "form-data";
import { addNewAddress } from "../services/user";
import { useTranslation } from "react-i18next";

interface IAddress {
  OpenModal: boolean;
  Onclose: () => void;
  updateAfterSave: () => void;
}

interface IOption {
  label: string;
  value: string;
  data: [];
}
interface Information {
  userName: string;
  phoneNumber: string;
  userCity: string;
  userDistrict: string;
  userWard: string;
  specificAddress: string;
}

const AddAddress: React.FC<IAddress> = ({
  OpenModal,
  Onclose,
  updateAfterSave,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(OpenModal);
  const [arrLocation, setArrLocation] = useState([]);
  const [dataCity, setDataCity] = useState<IOption[]>([]);
  const [districts, setDistricts] = useState<IOption[]>([]);
  const [wards, setWards] = useState<IOption[]>([]);
  const [inforUser, setInforUser] = useState<Information>({
    userName: "",
    phoneNumber: "",
    userCity: "",
    userDistrict: "",
    userWard: "",
    specificAddress: "",
  });

  const getLocation = async () => {
    const dataCity = await arrLocation.map((item) => ({
      label: item.label,
      value: item.key,
      data: item.districts,
    }));
    setDataCity(dataCity);
  };

  useEffect(() => {
    setIsModalOpen(OpenModal);
    const data = getDataLocation();
    setArrLocation(data);
    getLocation();
  }, [OpenModal]);

  const handleOnchange = (keySelect: string, type: string) => {
    if (type === "city") {
      const dataDistrists = dataCity.filter((item) => item.value === keySelect);
      setDistricts(dataDistrists[0].data);
      setInforUser((prev) => ({
        ...prev,
        userCity: keySelect,
        userDistrict: "",
        userWard: "",
      }));
    } else if (type === "district") {
      const dataWards = districts.filter((item) => item.value === keySelect);
      setWards(dataWards[0].wards);
      setInforUser((prev) => ({
        ...prev,
        userDistrict: keySelect,
        userWard: "",
      }));
    } else if (type === "wards") {
      setInforUser((prev) => ({
        ...prev,
        userWard: keySelect,
      }));
    } else {
      setInforUser((prev) => ({
        ...prev,
        [type]: keySelect,
      }));
    }
  };

  const handleOnSave = async () => {
    if (
      !inforUser.phoneNumber ||
      !inforUser.userName ||
      !inforUser.userDistrict ||
      !inforUser.userWard ||
      !inforUser.userCity ||
      !inforUser.specificAddress
    ) {
      message.error(t("notEmpty"));
    } else {
      const formdata = new FormData();
      formdata.append("userName", inforUser.userName);
      formdata.append("phoneNumber", inforUser.phoneNumber);
      formdata.append("userCity", inforUser.userCity);
      formdata.append("userDistrict", inforUser.userDistrict);
      formdata.append("userWard", inforUser.userWard);
      formdata.append("specificAddress", inforUser.specificAddress);

      const result = await addNewAddress(formdata);
      if (result.data.err === 0) {
        message.error(t("addItemSuccess"));
        setInforUser({
          userName: "",
          phoneNumber: "",
          userCity: "",
          userDistrict: "",
          userWard: "",
          specificAddress: "",
        });
        updateAfterSave();
        Onclose();
      } else {
        message.error(t("deleteItemFailed"));
        Onclose();
        setInforUser({
          userName: "",
          phoneNumber: "",
          userCity: "",
          userDistrict: "",
          userWard: "",
          specificAddress: "",
        });
      }
    }
  };

  return (
    <Modal
      title="Thêm địa chỉ nhận hàng"
      open={isModalOpen}
      className={style.modalCustom}
      onCancel={Onclose}
      footer={[
        <Button className={style.btnWhite} onClick={Onclose}>
          {" "}
          Hủy
        </Button>,
        <Button className={style.btnBlue} onClick={handleOnSave}>
          Thêm mới địa chỉ
        </Button>,
      ]}
    >
      <div className={style.fromInforUser}>
        <Form layout="inline">
          {/* <Typography.Title level={5}>User Name</Typography.Title> */}
          <Form.Item label="Tên" name="username" rules={[{ required: true }]}>
            <Input
              prefix={<UserOutlined />}
              className={style.inputForm}
              value={inforUser.userName}
              onChange={(event) =>
                handleOnchange(event.target.value, "userName")
              }
            />
          </Form.Item>

          {/* </div>
                <div className={style.item}> */}
          <Form.Item
            label="Số điện thoại"
            name="phone number"
            rules={[{ required: true }]}
          >
            <Input
              className={style.inputForm}
              value={inforUser.phoneNumber}
              onChange={(event) =>
                handleOnchange(event.target.value, "phoneNumber")
              }
            />
          </Form.Item>
        </Form>

        <Typography.Title level={5}>Tỉnh / Thành Phố</Typography.Title>
        <Select
          style={{ width: "100%", height: "35px" }}
          options={dataCity}
          onChange={(value, option) => handleOnchange(value, "city")}
          value={inforUser.userCity}
        />
        <Typography.Title level={5}>Quận Huyện</Typography.Title>
        <Select
          style={{ width: "100%", height: "35px" }}
          disabled={districts.length ? false : true}
          options={districts}
          onChange={(value, option) => handleOnchange(value, "district")}
          value={inforUser.userDistrict}
        />

        <Typography.Title level={5}>Phường Xã</Typography.Title>
        <Select
          style={{ width: "100%", height: "35px" }}
          options={wards}
          disabled={wards.length ? false : true}
          onChange={(value, option) => handleOnchange(value, "wards")}
          value={inforUser.userWard}
        />
        <TextArea
          rows={4}
          placeholder="Địa chỉ cụ thể"
          maxLength={400}
          style={{ resize: "none", marginTop: "15px" }}
          value={inforUser.specificAddress}
          onChange={(event) =>
            handleOnchange(event.target.value, "specificAddress")
          }
        />
      </div>
    </Modal>
  );
};

export default AddAddress;
