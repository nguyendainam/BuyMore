import React, { useEffect, useState } from "react";
import style from "./EditProduct.module.scss";
import {
  Button,
  Image,
  Input,
  Modal,
  Select,
  SelectProps,
  Tabs,
  TabsProps,
  Typography,
  Upload,
  UploadFile,
  message,
} from "antd";

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
export default function EditProduct() {
  const [options, setOptions] = useState([]);
  const [listBrand, setListBrand] = useState<SelectProps["options"]>([]);
  const [listCategory, setListCategory] = useState<SelectProps["options"]>([]);
  const [listTypeProduct, setListTypeProduct] = useState<
    SelectProps["options"]
  >([]);
  const [description, setDescription] = useState({
    basicInforVI: "",
    basicInforEN: "",
    descVI: "",
    descEN: "",
  });

  const [selectedProduct, setSelectedProduct] = useState({
    idProduct: "",
    nameVI: "",
    nameEN: "",
    brandId: "",
    category: "",
    listTag: [],
    image: "",
    listIventory: [],
    optionsProduct: {},
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imgMain, setImgMain] = useState("");
  useEffect(() => {
    // Fetch data and update options, listBrand, etc.
    const fetchData = async () => {
      try {
        const productData = await getAllProductToEdit();
        const brandData = await GetAllListsBrand();
        const typeProductData = await AllProductType();
        const categoryData = await getAllCategorybyItem();

        const productOptions = productData.map((item) => ({
          label: item.nameVI,
          value: item.productId,
          brand: item.brand,
          nameVI: item.nameVI,
          nameEN: item.nameEN,
          category: item.category,
          brandId: item.brand_id,
          typeProduct: item.type_product,
          image: item.image,
          listInventory: item.listInventory,
        }));

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

        setOptions(productOptions);
        setListBrand(brandOptions);
        setListTypeProduct(typeProductOptions);
        setListCategory(categoryOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Run this effect only once on mount

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleOnChange = async (option) => {
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
        category: option.typeProduct,
        listTag: option.category,
        image: option.image,
        listIventory: result,
        optionsProduct: result[0],
      });
    }
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

  return (
    <div className={style.mainViewDesc}>
      <div className={style.left}>
        <div className={style.basicFormProduct}>
          <div className={style.formBtnSave}>
            <Button className={style.btnBlue}>Cập nhật</Button>
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
              />
            </div>
          </div>
        </div>

        {selectedProduct.listIventory?.map((item) => {
          return (
            <div className={style.optionProduct}>
              <div className={style.inputWidthMinOption}>
                <Typography.Title level={5} className={style.fontTitle}>
                  Color
                </Typography.Title>
                <Select
                  className={style.formInputOption}
                  placeholder="Color"
                  // onChange={(event, option) =>
                  //   handleOnchange(index, option.value, "Color")
                  // }
                  options={SelectDrop.Color}
                  value={item.Color}
                />
              </div>
              <div className={style.inputWidthMinOption}>
                <Typography.Title level={5} className={style.fontTitle}>
                  Quantity
                </Typography.Title>
                <Input
                  className={style.formInputOption}
                  value={item.Quantity}
                  // onChange={(event) =>
                  //   handleOnchange(index, event.target.value, "quantity")
                  // }
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
                  // onChange={(event) =>
                  //   handleOnchange(index, event.target.value, "quantity")
                  // }
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
                  fileList={item.ImageInventory?.map((image) => ({
                    uid: image.uid,
                    name: `Image ${image.uid}`,
                    status: "done",
                    url: `${URL_SERVER_IMG}${image.Image}`,
                  }))}
                  listType="picture-card"
                  beforeUpload={async (file) => {
                    // Chuyển đổi file thành base64
                    const base64String = await getBase64(file);

                    // Thêm ảnh mới vào ImageInventory
                    setSelectedProduct((prevProduct) => {
                      const updatedItem = { ...prevProduct };
                      updatedItem.ImageInventory.push({
                        uid: `__AUTO__${Date.now()}_${Math.random()}__`,
                        Image: base64String,
                      });
                      return updatedItem;
                    });

                    // Return false để ngăn chặn việc tự động upload
                    return false;
                  }}
                  onRemove={(file) => {
                    console.log(file);
                    // // Xử lý khi người dùng xóa ảnh
                    // setSelectedProduct((prevProduct) => {
                    //   const updatedItem = { ...prevProduct };
                    //   updatedItem.ImageInventory =
                    //     updatedItem.ImageInventory.filter(
                    //       (img) => img.uid !== file.uid
                    //     );
                    //   return updatedItem;
                    // });
                  }}
                >
                  {item.ImageInventory?.length < 4 && "+ Upload"}
                </Upload>
              </div>

              {item.optionsProduct?.map((i1, key) => {
                const arr = item[i1]?.split(",");

                return (
                  <div key={key} className={style.inputWidthMinOption}>
                    <Typography.Title level={5} className={style.fontTitle}>
                      {i1}
                    </Typography.Title>
                    <Select
                      mode="multiple"
                      className={style.formInputOption}
                      options={SelectDrop[i1]}
                      value={arr?.map((ichild) => ichild)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
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
              options={SelectDrop.OptionClient}
              value={selectedProduct.optionsProduct}
              // onChange={(value) => handleOnChange(value)}
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
              // onChange={(value) => handleOnChange(value)}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

//  <div className={style.optionProduct}>
//    <div className={style.inputWidthMinOption}>
//      <Typography.Title level={5} className={style.fontTitle}>
//        Color
//      </Typography.Title>
//      <Select
//        className={style.formInputOption}
//        placeholder="Color"
//        // onChange={(event, option) =>
//        //   handleOnchange(index, option.value, "Color")
//        // }
//        options={SelectDrop.Color}
//        // value={listInventory.Color}
//      />
//    </div>
//    <div className={style.inputWidthMinOption}>
//      <Typography.Title level={5} className={style.fontTitle}>
//        Quantity
//      </Typography.Title>
//      <Input
//        className={style.formInputOption}
//        // value={item.quantity2}
//        // onChange={(event) =>
//        //   handleOnchange(index, event.target.value, "quantity")
//        // }
//        min={1}
//        type="number"
//      />
//    </div>

//    <div className={style.inputWidthMinOption}>
//      <Typography.Title level={5} className={style.fontTitle}>
//        Price
//      </Typography.Title>
//      <Input
//        className={style.formInputOption}
//        // value={item.quantity2}
//        // onChange={(event) =>
//        //   handleOnchange(index, event.target.value, "quantity")
//        // }
//        min={1}
//        type="number"
//      />
//    </div>

//    <div className={style.inputWidthMinOption}>
//      <Typography.Title level={5} className={style.fontTitle}>
//        Size
//      </Typography.Title>
//      <Select
//        className={style.formInputOption}
//        placeholder="Size"
//        // onChange={(event, option) =>
//        //   handleOnchange(index, option.value, "Color")
//        // }
//        options={SelectDrop.Size}
//        // value={listInventory.Color}
//      />
//    </div>

//    <div className={style.inputWidthMinOption}>
//      <Typography.Title level={5} className={style.fontTitle}>
//        Memory
//      </Typography.Title>
//      <Select
//        className={style.formInputOption}
//        placeholder="Color"
//        // onChange={(event, option) =>
//        //   handleOnchange(index, option.value, "Color")
//        // }
//        options={SelectDrop.memory}
//        // value={listInventory.Color}
//      />
//    </div>
//    <div className={style.inputWidthMinOption}>
//      <Typography.Title level={5} className={style.fontTitle}>
//        Scan Frequency
//      </Typography.Title>
//      <Select
//        className={style.formInputOption}
//        options={SelectDrop.scanFrequency}
//      />
//    </div>

//    <div className={style.inputWidthMinOption}>
//      <Typography.Title level={5} className={style.fontTitle}>
//        Screen Size
//      </Typography.Title>
//      <Select
//        className={style.formInputOption}
//        options={SelectDrop.screenSize}
//      />
//    </div>
//    <div className={style.inputWidthMinOption}>
//      <Typography.Title level={5} className={style.fontTitle}>
//        ScreenType
//      </Typography.Title>
//      <Select
//        className={style.formInputOption}
//        placeholder="Color"
//        options={SelectDrop.screenType}
//      />
//    </div>

//    <div className={style.inputWidthImage}>
//      <Typography.Title level={5}> Image</Typography.Title>
//      <Upload
//        listType="picture-card"
//        // onChange={(file) => handleImageListIv(file.file, index)}
//        // fileList={dataImage}
//        // onRemove={(file) => handleRemoveImage(file, index)}
//        // onPreview={handlePreview}
//        multiple
//      >
//        {/* {listInventory[index].Image.length >= 4 ? null : uploadButton} */}
//      </Upload>

//      {/* <Modal
//               open={previewOpen}
//               title={previewTitle}
//               footer={null}
//               onCancel={() => setPreviewOpen(false)}
//             >
//               <img alt="example" style={{ width: "100%" }} src={previewImage} />
//             </Modal> */}
//    </div>
//  </div>;
