import React, { useEffect, useState } from "react";
import style from "./EditProduct.module.scss";
import {
  Button,
  Image,
  Input,
  Select,
  SelectProps,
  Typography,
  Upload,
  UploadFile,
  message,
} from "antd";
import { IoAddCircleSharp } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import { getAllProductToEdit } from "../../../components/AllProduct";
import { GetAllListsBrand } from "../../../components/GetBrand";
import {
  AllProductType,
  getAllCategorybyItem,
} from "../../../components/GetdataCategory";
import { URL_SERVER_IMG } from "../../../until/enum";
import SelectDrop from "../../../components/datatest/Select";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadProps } from "antd/es/upload";
import {
  addOptionProductEdit,
  deleteImage,
  deleteOptionProductEdit,
  updateProduct,
  uploadImageSingleToServer,
} from "../../../services/product";
import FormData from "form-data";
import { getListDiscount } from "../../../components/Discount";
import { useTranslation } from "react-i18next";

// export interface IlistInventory {
//   Size: [];
//   Color: string;
//   quantity: number;
//   price: number;
//   Image?: UploadFile[];
//   screenSizeOptions: [];
//   memoryOptions: [];
//   scanFrequency: [];
//   screenType: [];
// }

export default function EditProduct() {
  const [options, setOptions] = useState([]);
  const { t } = useTranslation();
  const [listBrand, setListBrand] = useState<SelectProps["options"]>([]);
  const [listCategory, setListCategory] = useState<SelectProps["options"]>([]);
  const [listDiscount, setListDiscount] = useState<SelectProps["options"]>([]);
  const [listTypeProduct, setListTypeProduct] = useState<
    SelectProps["options"]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState({
    idProduct: "",
    nameVI: "",
    nameEN: "",
    brandId: "",
    category: "",
    discountId: "",
    listTag: [],
    image: "",
    listIventory: [],
    optionsProduct: [],
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imgMain, setImgMain] = useState("");

  const fetchData = async () => {
    try {
      const productData = await getAllProductToEdit();
      const productOptions = productData.map((item) => ({
        label: item.nameVI,
        value: item.productId,
        brand: item.brand,
        nameVI: item.nameVI,
        nameEN: item.nameEN,
        category: item.category,
        brandId: item.brand_id,
        discountId: item.discount_id,
        typeProduct: item.type_product,
        image: item.image,
        listInventory: item.listInventory,
      }));

      setOptions((prevOptions) => [...prevOptions, ...productOptions]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGetAllOption = async () => {
    const itemsDiscount = await getListDiscount();
    const brandData = await GetAllListsBrand();
    const typeProductData = await AllProductType();
    const categoryData = await getAllCategorybyItem();

    const brandOptions = brandData.map((item) => ({
      value: item.idBrand,
      label: item.nameBrand,
    }));

    const typeProductOptions = typeProductData.map((item) => ({
      value: item.Id,
      label: item.nameVI,
    }));

    const categoryOptions = categoryData.map((item) => ({
      value: item.IdItemCat,
      label: item.nameVI,
    }));

    const discountOptions = itemsDiscount.map((item) => ({
      value: item.Id,
      label: `${item.NameVI + "(" + item.Discount_Percent + "%)"}`,
    }));

    setListBrand((prevListBrand) => [...prevListBrand, ...brandOptions]);
    setListTypeProduct((prevListTypeProduct) => [
      ...prevListTypeProduct,
      ...typeProductOptions,
    ]);
    setListCategory((prevListCategory) => [
      ...prevListCategory,
      ...categoryOptions,
    ]);
    setListDiscount(discountOptions);
  };

  useEffect(() => {
    fetchData();
    handleGetAllOption();
  }, []);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleOnChange = async (option) => {
    console.log("ssssssssssss", option);

    handleRemove();
    let result = option.listInventory.map((item) => {
      const filteredKeys = Object.keys(item).filter(
        (key) =>
          item[key] !== undefined &&
          item[key] !== "" &&
          key !== "Price" &&
          key !== "Quantity" &&
          key !== "Id_Product" &&
          key !== "Id" &&
          key !== "ImageInventory" &&
          key !== "Color"
      );
      return {
        ...item,
        optionsProduct: filteredKeys,
      };
    });

    if (option) {
      setSelectedProduct({
        idProduct: option.value,
        nameVI: option.nameVI,
        nameEN: option.nameEN,
        brandId: option.brandId,
        discountId: option.discountId,
        category: option.typeProduct,
        listTag: option.category,
        image: option.image,
        listIventory: result,
        optionsProduct: Object.values(result[0].optionsProduct),
      });
    }
  };

  // const
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

  const handleAddInventory = async (idProduct: string) => {
    const result = await addOptionProductEdit(idProduct);

    if (result.data.err === 0) {
      const newProduct = {
        Id: result.data.IdInventory,
        Id_Product: idProduct,
        Size: "",
        Color: "",
        quantity: 1,
        price: 0,
        ImageInventory: [],
        memory: "",
        scanFrequency: "",
        screenType: "",
        screenSize: "",
        optionsProduct: selectedProduct.optionsProduct,
      };

      setSelectedProduct((prevState) => ({
        ...prevState,
        listIventory: [...prevState.listIventory, newProduct],
      }));
    }
  };

  const deleteOption = async (IdInventory, index) => {
    if (selectedProduct.listIventory.length < 2) {
      message.error(t("cannotDelete"));
    } else {
      const result = await deleteOptionProductEdit(IdInventory);
      if (result.data.err === 0) {
        setSelectedProduct((prevState) => {
          const newListIventory = [...prevState.listIventory];
          newListIventory.splice(index, 1); // Xóa phần tử tại vị trí index
          return { ...prevState, listIventory: newListIventory };
        });
      } else {
        message.error("Delete failed");
      }
    }
    //
  };

  const handleOnChangeOption = (option, key) => {
    const data = option.map((item) => item.value);

    setSelectedProduct((prevState) => {
      const updatedListIventory = [...prevState.listIventory];

      updatedListIventory.forEach((obj) => {
        // Thêm các key từ mảng data với giá trị là chuỗi trống
        data.forEach((itemKey) => {
          obj[itemKey] = [];
        });
      });

      return {
        ...prevState,
        listIventory: updatedListIventory,
        [key]: data,
      };
    });
  };

  const handleOnchangeInforOption = (value, key) => {
    console.log(value, key);

    setSelectedProduct((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleOnChangeInventory = (index: number, value: any, key: string) => {
    // console.log(key)
    // console.log(value)
    setSelectedProduct((prevState) => {
      const updatedListIventory = [...prevState.listIventory];
      const getItemInArr = updatedListIventory[index];
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
      // console.log(getItemInArr)
      getItemInArr[key] = value;
      return {
        ...prevState,
        listIventory: updatedListIventory,
      };
    });
  };

  const handleUpdateProduct = async () => {
    const formdata = new FormData();
    formdata.append("dataProduct", JSON.stringify(selectedProduct));
    if (fileList.length > 0) {
      // console.log(fileList)
      const baseImage = await getBase64(fileList[0].originFileObj);
      const filename = fileList[0].name;
      formdata.append("imageProduct", JSON.stringify(baseImage));
      formdata.append("filename", filename);
    }

    const result = await updateProduct(formdata);

    if (result.data.err === 0) {
      message.success("Update success ");
      fetchData();
    } else {
      message.error("Update failed");
    }
  };

  return (
    <div className={style.mainViewDesc}>
      <div className={style.left}>
        <div className={style.basicFormProduct}>
          <div className={style.formBtnSave}>
            <Button className={style.btnBlue} onClick={handleUpdateProduct}>
              Cập nhật
            </Button>
          </div>
          <div className={style.title}>Open Product</div>
          <div className={style.selectProduct}>
            <Select
              className={style.formRegister}
              options={options}
              onChange={(value, option) => handleOnChange(option)}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
            />
          </div>
          <div className={style.inforProduct}>
            <div className={style.inputWidth45}>
              <Typography.Title
                level={5}
                className={style.fontTitle}
                aria-required
              >
                Product Name VI
              </Typography.Title>
              <Input
                className={style.formInputcustom}
                value={selectedProduct.nameVI}
                onChange={(event) =>
                  handleOnchangeInforOption(event.target.value, "nameVI")
                }
              />
            </div>
            <div className={style.inputWidth45}>
              <Typography.Title
                level={5}
                className={style.fontTitle}
                aria-required
              >
                Product Name Other
              </Typography.Title>
              <Input
                className={style.formInputcustom}
                value={selectedProduct.nameEN}
                onChange={(event) =>
                  handleOnchangeInforOption(event.target.value, "nameEN")
                }
              />
            </div>
          </div>
        </div>

        {selectedProduct.listIventory?.map((item, index) => {
          const idInventory = item.Id;
          // cón
          return (
            <>
              <div className={style.optionProduct} key={index}>
                <div className={style.inputWidthMinOption}>
                  <Typography.Title level={5} className={style.fontTitle}>
                    Color
                  </Typography.Title>
                  <Select
                    className={style.formInputOption}
                    placeholder="Color"
                    options={SelectDrop.Color}
                    value={item.Color}
                    onChange={(value) =>
                      handleOnChangeInventory(index, value, "Color")
                    }
                  />
                </div>
                <div className={style.inputWidthMinOption}>
                  <Typography.Title level={5} className={style.fontTitle}>
                    Quantity
                  </Typography.Title>
                  <Input
                    className={style.formInputOption}
                    value={item.Quantity}
                    onChange={(event) =>
                      handleOnChangeInventory(
                        index,
                        event.target.value,
                        "Quantity"
                      )
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
                    value={item.Price}
                    onChange={(event) =>
                      handleOnChangeInventory(
                        index,
                        event.target.value,
                        "Price"
                      )
                    }
                    min={1}
                    type="number"
                  />
                </div>
                <div className={style.inputWidthImage}>
                  <Typography.Title level={5} style={{ width: 150 }}>
                    Image
                  </Typography.Title>
                  <Upload
                    accept=".png,.jpeg,.jpg"
                    fileList={
                      item.ImageInventory?.map((image) => ({
                        uid: image.uid,
                        name: `Image ${image.uid}`,
                        status: "done",
                        url: `${URL_SERVER_IMG}${image.Image}`,
                      })) || []
                    }
                    listType="picture-card"
                    beforeUpload={async (file) => {
                      try {
                        const image = await getBase64(file);
                        const formData = new FormData();
                        formData.append("image", image);
                        formData.append("nameImage", file.name);
                        formData.append("type", "Inventory_Product");
                        formData.append("idProduct", idInventory);

                        const result = await uploadImageSingleToServer(
                          formData
                        );
                        if (result.data.err === 0) {
                          setSelectedProduct((prevProduct) => {
                            const updatedItem = { ...prevProduct };
                            const updatedImageInventory = (
                              updatedItem.listIventory[index]?.ImageInventory ||
                              []
                            ).map((img) => ({
                              ...img,
                            }));

                            const newImage = {
                              Image: `${result.data.filename}`,
                            };

                            updatedImageInventory.push(newImage);
                            updatedItem.listIventory[index].ImageInventory =
                              updatedImageInventory;
                            return updatedItem;
                          });
                        }
                      } catch (error) {
                        console.error("Error during file upload:", error);
                        // Handle error if needed
                      }
                    }}
                    onRemove={async (removedFile) => {
                      const fileName = removedFile.url?.split("server/")[1];
                      const formData = new FormData();
                      formData.append("type", "Inventory_Product");
                      formData.append("image", fileName);
                      formData.append("idProduct", idInventory);

                      const result = await deleteImage(formData);
                      if (result.data.err === 0) {
                        setSelectedProduct((prevProduct) => {
                          const updatedItem = { ...prevProduct };
                          // Create a copy of the existing ImageInventory array
                          if (
                            updatedItem.listIventory[index].ImageInventory
                              .length >= 2
                          ) {
                            const updatedImageInventory =
                              updatedItem.listIventory[
                                index
                              ].ImageInventory.filter(
                                (img) => img.Image !== fileName
                              );
                            // Update the ImageInventory property in the existing data structure
                            updatedItem.listIventory[index].ImageInventory =
                              updatedImageInventory;
                          } else {
                            message.error(t("smaller1"));
                          }
                          return updatedItem;
                        });
                      } else {
                        message.error(t("deleteItemFailed"));
                      }
                    }}
                  >
                    {item.ImageInventory?.length < 4 ? "+ Upload" : null}
                  </Upload>
                </div>

                {Object.values(selectedProduct.optionsProduct)?.map(
                  (i1, key) => {
                    // console.log('i1', item)
                    return (
                      <div key={key} className={style.inputWidthMinOption}>
                        <Typography.Title level={5} className={style.fontTitle}>
                          {i1}
                        </Typography.Title>
                        <Select
                          mode="multiple"
                          className={style.formInputOption}
                          options={SelectDrop[i1]}
                          value={
                            typeof item[i1] === "string"
                              ? item[i1]?.split(",")
                              : item[i1]
                          }
                          onChange={(value) =>
                            handleOnChangeInventory(index, value, i1)
                          }
                        />
                      </div>
                    );
                  }
                )}

                <div
                  className={style.itemDelete}
                  onClick={() => deleteOption(idInventory, index)}
                >
                  {" "}
                  <TiDeleteOutline />{" "}
                </div>
              </div>
            </>
          );
        })}

        {selectedProduct.idProduct && (
          <div className={style.addInventory}>
            <div
              className={style.icon}
              onClick={() => handleAddInventory(selectedProduct.idProduct)}
            >
              <IoAddCircleSharp />
            </div>
          </div>
        )}
      </div>

      <div className={style.right}>
        <div className={style.ImageProduct}>
          <div className={style.title}>Image</div>

          <Image
            width={200}
            height={200}
            src={imgMain ? imgMain : URL_SERVER_IMG + selectedProduct.image}
          />
          <div className={style.formUpload}>
            <Upload
              accept=".png,.jpeg,.jpg,"
              onChange={handleChangeImageProduct}
              onRemove={handleRemove}
              // value={fileList[0].name}
              // showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div>
        </div>
        <div className={style.otherInformation}>
          <div className={style.title}>Options</div>

          <div className={style.inputMaxWidth}>
            <Select
              mode="multiple"
              className={style.formTags}
              showSearch
              options={SelectDrop.OptionsPr}
              value={selectedProduct.optionsProduct}
              onChange={(value, option) =>
                handleOnChangeOption(option, "optionsProduct")
              }
            />
          </div>
        </div>
        <div className={style.otherInformation}>
          <div className={style.title}>Categoty</div>

          <div className={style.inputMaxWidth}>
            <Select
              className={style.formTags}
              showSearch
              options={listTypeProduct}
              value={selectedProduct.category}
              onChange={(value) => handleOnchangeInforOption(value, "category")}
            />
          </div>
        </div>

        <div className={style.otherInformation}>
          <div className={style.title}>Tags</div>
          <div className={style.inputMaxWidth}>
            <Select
              mode="multiple"
              className={style.formTags}
              showSearch
              placeholder="Option Product"
              options={listCategory}
              value={selectedProduct.listTag}
              onChange={(value, option) =>
                handleOnChangeOption(option, "listTag")
              }
            />
          </div>
        </div>

        <div className={style.otherInformation}>
          <div className={style.title}>Brand</div>
          <div className={style.inputMaxWidth}>
            <Select
              className={style.formTags}
              showSearch
              placeholder="Option Product"
              options={listBrand}
              value={selectedProduct.brandId}
              onChange={(value) => handleOnchangeInforOption(value, "brandId")}
            />
          </div>
        </div>
        <div className={style.otherInformation}>
          <div className={style.title}>Discount</div>
          <div className={style.inputMaxWidth}>
            <Select
              className={style.formTags}
              showSearch
              placeholder="Option discount"
              options={listDiscount}
              value={selectedProduct.discountId}
              onChange={(value) =>
                handleOnchangeInforOption(value, "discountId")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
