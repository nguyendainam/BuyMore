import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Empty,
  Input,
  Typography,
  Select,
  Form,
  message,
  Radio,
  Checkbox,
} from "antd";
import style from "./ModelAddress.module.scss";
import { ListAddUser } from "../../../components/GetUser";
import { getDataLocation } from "../../../components/Location";
// import AddAddress from '../../../components/ModalcreateAddress';
import { UserOutlined } from "@ant-design/icons";

import TextArea from "antd/es/input/TextArea";
import { addNewAddress } from "../../../services/user";
import { useTranslation } from "react-i18next";

// import { Button,  } from 'antd';
interface IOption {
  key: string;
  label: string;
}

interface IOption1 {
  value: string;
  label: string;
}

interface dataUserAdd {
  City: IOption;
  District: IOption1;
  Id_Address: string;
  IsDefault: boolean;
  Line1: string;
  PhoneNumber: string;
  UserName: string;
  Ward: IOption1;
}

interface handleAddressShip {
  isOpen: boolean;
  handleClose: () => void;
  handleGetKeyAddress: (value: string) => void;
  onLoading: () => void;
}

const ListAddressToShip: React.FC<handleAddressShip> = ({
  isOpen,
  handleClose,
  handleGetKeyAddress,
  onLoading,
}) => {
  const [dataUserAdd, setDataUserAdd] = useState<dataUserAdd[]>([]);
  const [inforUser, setInforUser] = useState({
    userName: "",
    phoneNumber: "",
    userCity: "",
    userDistrict: "",
    userWard: "",
    specificAddress: "",
  });

  const [dataCity, setDataCity] = useState<IOption[]>([]);
  const [arrLocation, setArrLocation] = useState([]);
  const [districts, setDistricts] = useState<IOption[]>([]);
  const [wards, setWards] = useState<IOption[]>([]);
  const [listCase, setListCase] = useState<number>(0);
  const getLocation = async () => {
    const dataCity = await arrLocation.map((item) => ({
      label: item.label,
      value: item.key,
      data: item.districts,
    }));
    setDataCity(dataCity);
  };

  useEffect(() => {
    const data = getDataLocation();
    setArrLocation(data);
    getLocation();
  }, [isOpen]);

  const handleGetListUser = async () => {
    const list = await ListAddUser();
    const local = getDataLocation();

    if (list.length > 0) {
      const data: dataUserAdd[] = list.map((item) => ({
        City: local.filter((city) => city.key === item.City)[0],
        District: local
          .filter((city) => city.key === item.City)[0]
          .districts?.find((dis) => dis.value === item.District),
        Id_Address: item.Id_Address,
        IsDefault: item.IsDefault,
        Line1: item.Line1,
        PhoneNumber: item.PhoneNumber,
        UserName: item.UserName,
        Ward: local
          .filter((city) => city.key === item.City)[0]
          .districts?.filter((dis) => dis.value === item.District)[0]
          .wards?.find((w) => w.value === item.Ward),
      }));
      setDataUserAdd(data);
    } else {
      setDataUserAdd([]);
    }
  };

  useEffect(() => {
    handleGetListUser();
  }, [listCase]);
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

  const [selectedChecked, setSelectedChecked] = useState<string>("");

  const handleChangeCheckbox = (key: string) => {
    setSelectedChecked(key);
  };

  const { t } = useTranslation();

  const renderAddnewAddress = () => {
    const casearr = listCase;
    switch (casearr) {
      case 1:
        return (
          <>
            <Form layout="inline">
              {/* <Typography.Title level={5}>User Name</Typography.Title> */}
              <Form.Item
                label="Tên"
                name="username"
                rules={[{ required: true }]}
              >
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

            {/* </div> */}

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
          </>
        );

      case 0:
        return dataUserAdd.length > 0 ? (
          <div className={style.items}>
            {dataUserAdd.map((item) => {
              return (
                <div
                  className={style.item}
                  onClick={() => handleChangeCheckbox(item.Id_Address)}
                >
                  <div>
                    <Checkbox
                      onChange={() => handleChangeCheckbox(item.Id_Address)}
                      checked={item.Id_Address === selectedChecked}
                    />
                  </div>
                  <div className={style.formName}>
                    Tên Người Nhận: {item.UserName} / SĐT: {item.PhoneNumber}
                  </div>
                  <div className={style.formAddress}>
                    {item.Line1} / {item.Ward.label} / {item.District.label} /{" "}
                    {item.City.label}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
            description={
              <span>Bạn chưa có địa chỉ nào, Vui lòng tạo mới địa chỉ</span>
            }
          >
            <Button type="primary" onClick={() => setListCase(1)}>
              Tạo Mới{" "}
            </Button>
          </Empty>
        );

      default:
        return <></>;
    }
  };

  const handleCreateNewAddress = async () => {
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
        message.success(t("updateSuccess"));
        setInforUser({
          userName: "",
          phoneNumber: "",
          userCity: "",
          userDistrict: "",
          userWard: "",
          specificAddress: "",
        });
        onLoading();
        handleClose();
      } else {
        message.error(t("addAddressfail"));

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

  const handleSetAddress = () => {
    handleGetKeyAddress(selectedChecked);
    onLoading();
    handleClose();
  };

  return (
    <>
      <Modal
        title="Địa chỉ nhận hàng"
        open={isOpen}
        onCancel={handleClose}
        className={style.ModalCustome}
        width={1000}
        centered
        footer={
          listCase === 1
            ? [
                <Button key="back" onClick={() => setListCase(0)}>
                  Trở lại
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={handleCreateNewAddress}
                >
                  Lưu
                </Button>,
              ]
            : [
                <Button key="choosen" type="primary" onClick={handleSetAddress}>
                  Chọn
                </Button>,
                <Button
                  key="creatnew"
                  type="primary"
                  onClick={() => setListCase(1)}
                >
                  Tạo Mới
                </Button>,
              ]
        }
      >
        <div className={style.items}>{renderAddnewAddress()}</div>
      </Modal>
    </>
  );
};

export default ListAddressToShip;
