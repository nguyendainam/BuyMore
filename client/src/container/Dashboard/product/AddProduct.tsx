import React, { useState, useEffect } from "react";
import style from "./AddProduct.module.scss";
import {
  Input,
  Typography,
  Select,
  Upload,
  Button,
  InputNumber,
  Modal,
  message,
} from "antd";

import type { SelectProps } from "antd";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";

import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { TfiWrite } from "react-icons/tfi";
import { TextEditor } from "../../../components/textEditor";
import FormData from "form-data";
import { CreateProduct } from "../../../services/product";
import { getListDiscount } from "../../../components/Discount";
import {
  AllProductType,
  getAllCategorybyItem,
} from "../../../components/GetdataCategory";
import { GetAllListsBrand } from "../../../components/GetBrand";
import selectDrop from "../../../components/datatest/Select";

const { Option } = Select;

// =================================================================  //
interface IlistInventory {
  Size: [];
  Color: string;
  quantity: number;
  price: number;
  Image?: UploadFile[];
  screenSizeOptions: [];
  memoryOptions: [];
  scanFrequency: [];
  screenType: [];
}

interface IProduct {
  nameVI: string;
  nameEN: string;
  category: string;
  brand: string;
  discount: number | string | null;
  descVI: string;
  descEN: string;
}
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

// ==================================================================================
// ==================================================================================
// ==================================================================================

export default function AddProduct() {
  const [product, setproduct] = useState<IProduct>({
    nameVI: "",
    nameEN: "",
    category: "",
    brand: "",
    discount: 1,
    descVI: "",
    descEN: "",
  });

  const [listInventory, setListInventory] = useState<IlistInventory[]>([
    {
      Size: [],
      Color: "",
      quantity: 1,
      price: 0,
      Image: [],
      screenSizeOptions: [],
      memoryOptions: [],
      scanFrequency: [],
      screenType: [],
    },
  ]);

  const newProduct: IlistInventory = {
    Size: [],
    Color: "",
    screenSizeOptions: [],
    quantity: 1,
    price: 0,
    Image: [],
    memoryOptions: [],
    scanFrequency: [],
    screenType: [],
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [openDesc, setOpenDesc] = useState<boolean>(false);

  useEffect(() => { }, [listInventory]);

  const handleCreateNew = () => {
    setListInventory((prevState) => [...prevState, newProduct]);
  };

  const handleDeleteInventory = (key) => {
    if (listInventory.length === 1) {
      message.error("Đéo đc xóa nữa");
    } else {
      setListInventory((prevState) => {
        const updateList = [...prevState];
        updateList.splice(key, 1);
        return updateList;
      });
    }
  };

  const handleOnchange = (key: number, option: any, id: string) => {
    // console.log(getValue);
    setListInventory((prevList) => {
      return prevList.map((item, index) => {
        if (index === key) {
          return {
            ...item,
            [id]: option,
          };
        }
        return item;
      });
    });
  };

  const handleOnchangeProduct = (value, id: string) => {
    const coppyState = { ...product };
    coppyState[id] = value;
    setproduct(coppyState);
  };
  const ValidateFileUpload = (file) => {
    const isJpgorPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgorPng) {
      message.error("You can only upload JPG or PNG files");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Images must be smaller than 2MB");
      return false;
    }

    return isJpgorPng && isLt2M;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
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
    }
  };

  const handleImageListIv = (files, key) => {
    const data = [files];
    if (data) {
      const isValidFiles = data.every((file) => ValidateFileUpload(file));

      if (isValidFiles) {
        const dataImg = data.map((obj) => {
          if (obj.status === "error" || obj.status === "uploading") {
            return { ...obj, status: "done" };
          }
          return obj;
        });

        if (dataImg[0] && dataImg[0].status === "done") {
          console.log("Dataa.........", dataImg);
          setListInventory((prevList) => {
            const updatedList = [...prevList];
            const existingUIDs = updatedList[key].Image.map((img) => img.uid);

            if (!existingUIDs.includes(dataImg[0].uid)) {
              updatedList[key] = {
                ...updatedList[key],
                Image: [...updatedList[key].Image, dataImg[0]], // Lưu trạng thái thứ tư của ảnh
              };
            }

            return updatedList;
          });
        }
      }
    }
  };

  const handleRemoveImage = (file, index) => {
    // Xóa ảnh khỏi danh sách
    const newList = listInventory[index].Image.filter(
      (image) => image.uid !== file.uid
    );

    setListInventory((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = {
        ...updatedList[index],
        Image: newList,
      };
      return updatedList;
    });
  };

  const handleGetDesc = (data: string, key?: string) => {
    const coppyState = { ...product };
    coppyState[key] = data;
    setproduct(coppyState);
  };
  const handleSaveProduct = async () => {
    const formData = new FormData();
    formData.append("Inventory", JSON.stringify(listInventory));
    formData.append(`ImageProduct`, JSON.stringify(fileList));
    formData.append("Product", JSON.stringify(product));

    // console.log(listInventory);
    // console.log(product);
    const createProduct = await CreateProduct(formData);
    if (createProduct.data.err === 0) {
      message.success(createProduct.data.errMessage);
    } else {
      message.error(createProduct.data.errMessage);
    }
  };

  /**
   *
   *
   *
   */

  const [listTypeProduct, setListTypeProduct] = useState<
    SelectProps["options"]
  >([]);
  const [listBrand, setListBrand] = useState<SelectProps["options"]>([]);
  const [listCategory, setListCategory] = useState<SelectProps["options"]>([]);
  const [listDiscount, setListDiscount] = useState<SelectProps["options"]>([]);

  const handleGetList = async () => {
    try {
      const listBrands = await GetAllListsBrand();
      const itemsDiscount = await getListDiscount();
      const itemTypeProduct = await AllProductType();
      const itemCategory = await getAllCategorybyItem();

      setListBrand(
        listBrands.map((item) => ({
          value: item.idBrand,
          label: item.nameBrand,
        }))
      );

      setListDiscount(
        itemsDiscount.map((item) => ({
          value: item.Id,
          label: item.NameVI,
        }))
      );

      setListTypeProduct(
        itemTypeProduct.map((item) => ({
          value: item.Id,
          label: item.nameVI,
        }))
      );

      setListCategory(
        itemCategory.map((item) => ({
          value: item.IdItemCat,
          label: item.nameVI,
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetList();
  }, []);

  const handleSearch = (value: string, key: string) => {
    setproduct((prevProduct) => ({
      ...prevProduct,
      [key]: value,
    }));
  };

  /**
   *
   *
   * OPTIONS PRODUCT
   *
   *
   *
   *  */
  const [optionProduct, setOptionProduct] = useState([]);

  const handleOptionProduct = (option) => {
    setOptionProduct(option);
  };

  /**
   *
   *
   *
   *
   *
   *
   * */

  return (
    <div className={style.mainAddProduct}>
      {/* <div className={style.titleheader}>Add product</div> */}
      <div className={style.formProduct}>
        <div className={style.inputWidth}>
          <Typography.Title level={5}>Name Product VI </Typography.Title>
          <Input
            value={product.nameVI}
            onChange={(event) =>
              handleOnchangeProduct(event.target.value, "nameVI")
            }
            className={style.formInputcustom}
          />
        </div>
        <div className={style.inputWidth}>
          <Typography.Title level={5}>Name Product EN </Typography.Title>
          <Input
            value={product.nameEN}
            onChange={(event) =>
              handleOnchangeProduct(event.target.value, "nameEN")
            }
            className={style.formInputcustom}
          />
        </div>

        <div className={style.inputWidthMin}>
          <Typography.Title level={5}> Type Product</Typography.Title>
          <Select
            showSearch
            placeholder="Category"
            onChange={(event, Option) => console.log(Option)}
            options={listTypeProduct}
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            className={style.formInputcustom}
          />
        </div>

        <div className={style.inputWidthMin}>
          <Typography.Title level={5}> Brand</Typography.Title>
          <Select
            showSearch
            placeholder="Brand"
            onChange={(value, option) => handleSearch(value, "brand")}
            value={product.brand}
            options={listBrand}
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            className={style.formInputcustom}
          >
            {/* Sử dụng Option component bên trong Select */}
            {listBrand?.map((item) => (
              <Option
                key={item.value}
                value={item.value}
                children={item.label}
              />
            ))}
          </Select>
        </div>

        <div className={style.inputWidthMin}>
          <Typography.Title level={5}> Discount</Typography.Title>
          <Select
            className={style.formInputcustom}
            showSearch
            placeholder="Discount"
            onChange={(event, Option) => console.log(Option)}
            options={listDiscount}
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
          ></Select>
        </div>
        <div className={style.inputWidthMin}>
          <Typography.Title level={5}> Tags</Typography.Title>
          <Select
            className={style.formInputcustom}
            mode="multiple"
            showSearch
            placeholder="Category"
            onChange={(value) => handleSearch(value, "category")}
            value={product.category ? product.category : undefined}
            options={listCategory ? listCategory : undefined}
          />
        </div>
        <div className={style.inputWidthMin}>
          <Typography.Title level={5}> Option Product</Typography.Title>
          <Select
            className={style.formInputcustom}
            mode="multiple"
            showSearch
            placeholder="Option Product"
            onChange={(value, option) => handleOptionProduct(option)}
            value={optionProduct.length > 0 ? optionProduct : undefined}
            options={selectDrop.OptionsPr}
          />
        </div>

        <div className={style.inputWidthMin}>
          <div className={style.viewFile}>
            <Typography.Title level={5}> Image Show</Typography.Title>

            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              multiple
              accept=".png,.jpeg,.jpg,"
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>

            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={() => setPreviewOpen(false)}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </div>
        </div>
      </div>

      <div className={style.formInventory}>
        {listInventory.map((item, index) => {
          const dataImage = listInventory[index].Image;
          return (
            <div className={style.productInve} key={index}>
              <div className={style.inputWidthMin}>
                <Typography.Title level={5}> Color</Typography.Title>
                <Select
                  placeholder="Color"
                  onChange={(event, option) =>
                    handleOnchange(index, option.value, "Color")
                  }
                  options={selectDrop.Color}
                  value={listInventory.Color}
                />
              </div>

              <div className={style.listOption}>
                {optionProduct.map((item1, index1) => {
                  // const selectedOption = selectDrop.OptionsPr.find((option) => option.value === item1);
                  const arr = selectDrop[item1.value];
                  return (
                    <div className={style.inputWidthMin} key={index1}>
                      <Typography.Title level={5}>
                        {item1.label}
                      </Typography.Title>
                      <Select
                        className={style.formInputcustom}
                        showSearch
                        placeholder="Option Product"
                        onChange={(value, option) =>
                          handleOnchange(index, value, item1.value)
                        }
                        value={item[item1.value]}
                        options={arr}
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        mode="multiple"
                      />
                    </div>
                  );
                })}

                <div className={style.inputWidthMin15}>
                  <Typography.Title level={5}> Price</Typography.Title>
                  <Input
                    className={style.formInputcustom}
                    value={item.price}
                    onChange={(event) =>
                      handleOnchange(index, event.target.value, "price")
                    }
                    type="number"
                  />
                </div>

                <div className={style.inputWidthMin15}>
                  <Typography.Title level={5}> Quantity</Typography.Title>
                  <InputNumber
                    value={item.quantity}
                    onChange={(event) =>
                      handleOnchange(index, event, "quantity")
                    }
                    min={1}
                  />
                </div>

                <div className={style.inputWidthMax}>
                  <Typography.Title level={5}> Image</Typography.Title>
                  <Upload
                    listType="picture-card"
                    onChange={(file) => handleImageListIv(file.file, index)}
                    fileList={dataImage}
                    onRemove={(file) => handleRemoveImage(file, index)}
                    onPreview={handlePreview}
                    multiple
                  >
                    {listInventory[index].Image.length >= 4
                      ? null
                      : uploadButton}
                  </Upload>

                  <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </div>

                <div className={style.cancelForm}>
                  <div className={style.icon}>
                    <ImCancelCircle
                      onClick={() => handleDeleteInventory(index)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className={style.addformInput}>
          {listInventory.length >= 5 ? null : (
            <div className={style.icon} onClick={handleCreateNew}>
              <MdOutlineAddCircleOutline />
            </div>
          )}
        </div>
        <div className={style.formSave}>
          <Button type="primary" onClick={handleSaveProduct}>
            Save
          </Button>
          <Button type="default">Clear</Button>
        </div>
      </div>
    </div>
  );
}
