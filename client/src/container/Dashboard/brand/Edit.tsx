import React, { useEffect, useState } from "react";
import style from "./Edit.module.scss";
import { Button, Image, Select, Upload, UploadFile, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { TextEditor } from "../../../components/textEditor";
import { GetAllListsBrand } from "../../../components/GetBrand";
import { URL_SERVER_IMG } from "../../../until/enum";
import FormData from "form-data";
import { RcFile } from "antd/es/upload";
import { CreateorUpdateBrand } from "../../../services/product";
import { useTranslation } from "react-i18next";
export const EditBrand = () => {
  const [dataBrand, setDataBrand] = useState([]);
  const [option, setOption] = useState([]);
  const [getBrand, setBrand] = useState({
    id: "",
    nameBrand: "",
    descVI: "",
    descEN: "",
    Image: "",
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imgMain, setImgMain] = useState("");

  const handleGetAllListBrand = async () => {
    const result = await GetAllListsBrand();
    const dataOption = await result.map((item) => ({
      value: item.idBrand,
      label: item.nameBrand,
    }));

    setDataBrand(result);
    setOption(dataOption);
  };

  const handleSelected = (key) => {
    const data = dataBrand.filter((item) => item.idBrand === key);
    setBrand({
      id: data[0].idBrand,
      nameBrand: data[0].nameBrand,
      descVI: data[0].descVI,
      descEN: data[0].descEN,
      Image: data[0].imageBrand,
    });
  };
  useEffect(() => {
    handleGetAllListBrand();
  }, []);

  const handleGetContent = (value, key) => {
    setBrand((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const { t } = useTranslation();

  const ValidateFileUpload = (file) => {
    const isJpgorPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgorPng) {
      message.error(t("onlyPngJpg"));
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t("smaller2MB"));
      return false;
    }

    return isJpgorPng && isLt2M;
  };

  const handleChangeImageProduct: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    if (newFileList) {
      const isValidFiles = newFileList.every((file) =>
        ValidateFileUpload(file)
      );
      if (isValidFiles) {
        const data = newFileList.map((obj) => {
          if (obj.status === "error") {
            return { ...obj, status: "done" };
          }
          return obj;
        });

        setFileList(data);
      }
      if (newFileList.length > 0) {
        const mainImage = await getBase64(
          newFileList[0].originFileObj as RcFile
        );
        setImgMain(mainImage);
      }
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setImgMain("");
  };

  const handleOnUpdate = async () => {
    if (!getBrand.id) {
      message.error(t("choosenBrand"));
    } else {
      const action = "update";
      const formdata = new FormData();
      formdata.append("NameBrand", getBrand.nameBrand);
      formdata.append("DescVI", getBrand.descVI);
      formdata.append("action", action);
      formdata.append("DescEN", getBrand.descEN);
      formdata.append("IdBrand", getBrand.id);

      if (fileList.length > 0) {
        // console.log(fileList)
        const baseImage = await getBase64(fileList[0].originFileObj);
        const filename = fileList[0].name;
        formdata.append("imageProduct", JSON.stringify(baseImage));
        formdata.append("filename", filename);
      }

      const result = await CreateorUpdateBrand(formdata);
      if (result.data.err === 0) {
        message.success(t("updateSuccess"));
      } else {
        message.error(t("updateFailed"));
      }
    }
  };

  return (
    <div className={style.mainView}>
      <div className={style.containerTop}>
        <div className={style.left}>
          <Select
            className={style.formInputOption}
            options={option}
            onChange={(value) => handleSelected(value)}
          />
          <Button className={style.btnPrimary} onClick={handleOnUpdate}>
            {t("update")}
          </Button>
        </div>
        <div className={style.right}>
          <div className={style.formImg}>
            <Image
              width={200}
              src={imgMain ? imgMain : URL_SERVER_IMG + getBrand.Image}
            />
            <Upload
              accept=".png,.jpeg,.jpg,"
              onChange={handleChangeImageProduct}
              onRemove={handleRemove}
              // value={fileList[0].name}
              // showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>{t("upload")}</Button>
            </Upload>
          </div>
          <div className={style.formInformation}>{getBrand?.nameBrand}</div>
        </div>
      </div>
      <div className={style.containerContent}>
        <TextEditor
          content={getBrand.descVI ? getBrand.descVI : "<p></p>"}
          handleSendContext={(value, key) => handleGetContent(value, key)}
          editorKey={"descVI"}
        />
      </div>
      <div className={style.containerContent}>
        <TextEditor
          content={getBrand.descEN ? getBrand.descEN : "<p></p>"}
          handleSendContext={(value, key) => handleGetContent(value, key)}
          editorKey={"descEN"}
        />
      </div>
    </div>
  );
};
