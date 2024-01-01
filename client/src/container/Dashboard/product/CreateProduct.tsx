import React, { useEffect, useState } from "react";
import style from "./CreateProduct.module.scss";
import {
  Button,
  Image,
  Input,
  Modal,
  Select,
  Tabs,
  Typography,
  Upload,
  message,
} from "antd";
import { TextEditor } from "../../../components/textEditor";
import type { UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import type { SelectProps } from "antd";
import { GetAllListsBrand } from "../../../components/GetBrand";
import { getListDiscount } from "../../../components/Discount";
import {
  AllProductType,
  getAllCategorybyItem,
} from "../../../components/GetdataCategory";
import selectDrop from "../../../components/datatest/Select";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { CreateProduct } from "../../../services/product";
const items = [
  {
    key: "descVI",
    label: "Vietnamese",
  },
  {
    key: "descEN",
    label: "English",
  },
];
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
  discount: string;
  descVI: string;
  descEN: string;
  type_product: string;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

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

export const CreateNewProduct: React.FC = () => {
  const [product, setproduct] = useState<IProduct>({
    nameVI: "",
    nameEN: "",
    category: "",
    brand: "",
    discount: "1",
    descVI: "",
    descEN: "",
    type_product: "",
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [optionProduct, setOptionProduct] = useState([]);
  const [listTypeProduct, setListTypeProduct] = useState<
    SelectProps["options"]
  >([]);
  const [listBrand, setListBrand] = useState<SelectProps["options"]>([]);
  const [listCategory, setListCategory] = useState<SelectProps["options"]>([]);
  const [listDiscount, setListDiscount] = useState<SelectProps["options"]>([]);
  const [imgMain, setImgMain] = useState("");

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
  const handleChange: UploadProps["onChange"] = async ({
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

  const handleCreateNew = () => {
    setListInventory((prevState) => [...prevState, newProduct]);
  };
  const handleOptionProduct = (option) => {
    setOptionProduct(option);
  };
  const handleOnchangeProduct = (value, id: string) => {
    const coppyState = { ...product };
    coppyState[id] = value;
    setproduct(coppyState);
  };

  const handleSearch = (value: string, key: string) => {
    setproduct((prevProduct) => ({
      ...prevProduct,
      [key]: value,
    }));
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

  const handleSaveDesc = (data, key) => {
    setproduct((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  const renderTabContent = (key: string) => {
    // You can customize this function to render different content for each tab
    return (
      <TextEditor
        handleSendContext={(data, key) => handleSaveDesc(data, key)}
        editorKey={key}
      />
    );
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
  useEffect(() => {
    handleGetList();
  }, []);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSaveProduct = async () => {
    const formData = new FormData();
    formData.append("Inventory", JSON.stringify(listInventory));
    formData.append(`ImageProduct`, JSON.stringify(imgMain));
    formData.append("Product", JSON.stringify(product));
    const createProduct = await CreateProduct(formData);

    if (createProduct.data.err === 0) {
      message.success(createProduct.data.errMessage);

      setproduct({
        nameVI: "",
        nameEN: "",
        category: "",
        brand: "",
        discount: "1",
        descVI: "",
        descEN: "",
        type_product: "",
      });
      setFileList([]);
      setListInventory([
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
    } else {
      message.error(createProduct.data.errMessage);
    }
  };

  return (
    <>
      <div className={style.formTitlePage}>
        <div className={style.formTitlePage}>Add Product</div>
        <div className={style.formBtn}>
          <Button className={style.btnBlue} onClick={handleSaveProduct}>
            Add
          </Button>{" "}
          <Button className={style.btnWhite}>Clear</Button>
        </div>
      </div>

      <div className={style.mainCreateProduct}>
        <div className={style.productImage}>
          <div className={style.formTitle}> Product Image</div>
          <div className={style.froductImage}>
            <Typography.Title level={5} className={style.fontTitle}>
              Product Image
            </Typography.Title>
            <div className={style.formUpload}>
              <Upload
                accept=".png,.jpeg,.jpg,"
                fileList={fileList}
                onChange={handleChange}
              >
                {fileList.length >= 1 ? null : (
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                )}
              </Upload>
            </div>
            {imgMain && (
              <div className={style.ImgProduct}>
                <Image src={imgMain} alt="Product" />

                {/* <img alt="example" style={{ width: "100%" }} src={previewImage} /> */}
              </div>
            )}
          </div>

          <div className={style.tag}>
            <Typography.Title level={5} className={style.fontTitle}>
              Tags
            </Typography.Title>
            <Select
              mode="multiple"
              className={style.formTags}
              onChange={(value) => handleSearch(value, "category")}
              value={product.category ? product.category : undefined}
              options={listCategory ? listCategory : undefined}
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
            />
          </div>
        </div>

        <div className={style.generalForm}>
          <div className={style.formTitle}> General Information</div>
          <div className={style.formInfomation}>
            <div className={style.inputWidth45}>
              <Typography.Title
                level={5}
                className={style.fontTitle}
                aria-required
              >
                Product Name
              </Typography.Title>
              <Input
                className={style.formInputcustom}
                onChange={(event) =>
                  handleOnchangeProduct(event.target.value, "nameVI")
                }
                value={product.nameVI}
              />
            </div>
            <div className={style.inputWidth45}>
              <Typography.Title level={5} className={style.fontTitle}>
                Product Name Other
              </Typography.Title>
              <Input
                className={style.formInputcustom}
                value={product.nameEN}
                onChange={(event) =>
                  handleOnchangeProduct(event.target.value, "nameEN")
                }
              />
            </div>

            <div className={style.inputWidth45}>
              <Typography.Title level={5} className={style.fontTitle}>
                Brand
              </Typography.Title>
              <Select
                showSearch
                options={listBrand}
                className={style.formInputcustom}
                onChange={(value, option) => handleSearch(value, "brand")}
                value={product.brand}
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
              />
            </div>

            <div className={style.inputWidth45}>
              <Typography.Title level={5} className={style.fontTitle}>
                Type Category
              </Typography.Title>
              <Select
                options={listTypeProduct}
                className={style.formInputcustom}
                onChange={(value, option) =>
                  handleSearch(value, "type_product")
                }
                value={product.type_product}
              />
            </div>

            <div className={style.inputWidth45}>
              <Typography.Title level={5} className={style.fontTitle}>
                Discount
              </Typography.Title>
              <Select
                options={listDiscount}
                className={style.formInputcustom}
                value={product.discount}
                onChange={(value, option) => handleSearch(value, "discount")}
              />
            </div>
            <div className={style.inputWidth45}>
              <Typography.Title level={5} className={style.fontTitle}>
                Options
              </Typography.Title>
              <Select
                mode="multiple"
                className={style.formInputcustom}
                options={selectDrop.OptionsPr}
                onChange={(value, option) => handleOptionProduct(option)}
              />
            </div>
            <div className={style.inputTextEditor}>
              <Typography.Title level={5} className={style.fontTitle}>
                Description
              </Typography.Title>
              <Tabs defaultActiveKey="1">
                {items.map((item) => (
                  <Tabs.TabPane tab={item.label} key={item.key}>
                    {renderTabContent(item.key)}
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className={style.optionProduct}>
        {listInventory.map((item, index) => {
          const dataImage = listInventory[index].Image;
          return (
            <div className={style.option}>
              <div className={style.inputWidthMinOption}>
                <Typography.Title level={5} className={style.fontTitle}>
                  Color
                </Typography.Title>
                <Select
                  className={style.formInputOption}
                  placeholder="Color"
                  onChange={(event, option) =>
                    handleOnchange(index, option.value, "Color")
                  }
                  options={selectDrop.Color}
                  value={listInventory.Color}
                />
              </div>
              <div className={style.inputWidthMinOption}>
                <Typography.Title level={5} className={style.fontTitle}>
                  Quantity
                </Typography.Title>
                <Input
                  className={style.formInputOption}
                  value={item.quantity2}
                  onChange={(event) =>
                    handleOnchange(index, event.target.value, "quantity")
                  }
                  min={1}
                  type="number"
                />
              </div>
              <div className={style.inputWidthMinOption}>
                <Typography.Title level={5} className={style.fontTitle}>
                  Price
                </Typography.Title>
                <Input
                  className={style.formInputOption}
                  value={item.price}
                  onChange={(event) =>
                    handleOnchange(index, event.target.value, "price")
                  }
                  type="number"
                />
              </div>

              <div className={style.inputWidthImage}>
                <Typography.Title level={5}> Image</Typography.Title>
                <Upload
                  listType="picture-card"
                  onChange={(file) => handleImageListIv(file.file, index)}
                  fileList={dataImage}
                  onRemove={(file) => handleRemoveImage(file, index)}
                  onPreview={handlePreview}
                  multiple
                >
                  {listInventory[index].Image.length >= 4 ? null : uploadButton}
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

              {optionProduct.map((item1, index1) => {
                // const selectedOption = selectDrop.OptionsPr.find((option) => option.value === item1);
                const arr = selectDrop[item1.value];
                return (
                  <div className={style.inputWidth} key={index1}>
                    <Typography.Title level={5}>{item1.label}</Typography.Title>
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

              <div className={style.cancelForm}>
                <div className={style.icon}>
                  <ImCancelCircle
                    onClick={() => handleDeleteInventory(index)}
                  />
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
      </div>
    </>
  );
};
