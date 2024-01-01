import React, { useEffect, useState } from "react";
import style from "./DetailProduct.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { inforProductById } from "../../../../components/GetProduct";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { Button, Image, Input, Rate, message } from "antd";
import selectDrop from "../../../../components/datatest/Select";
import { useSelector } from "react-redux";
import { AddproductToCard } from "../../../../components/Cart";
import VoteBar from "../../../../components/VoteBar";
import Ratting from "../../../../components/Ratting";
import { TextArea } from "@progress/kendo-react-inputs";
import Comment from "../../../../components/Comment";
import FormData from "form-data";
import { ratingProduct } from "../../../../services/user";
import { getDataInforProduct } from "../../../../components/getInforCommentProduct";
import { RelatedProduct } from "./RalatedProduct";

interface IProduct {
  nameProduct: string;
  description: string;
  brand: string;
}
export default function DetailProduct() {
  const idProduct = useLocation().search.split("?product=")[1];

  const interestedProperties = [
    "Color",
    "Size",
    "memory",
    "screenSize",
    "scanFrequency",
    "screenType",
  ];
  const navigate = useNavigate();
  const [dataProduct, setDataProduct] = useState({});
  const [productInventory, setProductInventory] = useState([]);
  const [optionProduct, setOptionProduct] = useState([]);
  const [optionTypeColor, setOptionTypeColor] = useState([]);
  const [listImageProduct, setListImageProduct] = useState([]);
  const [dataComment, setDataComment] = useState({
    rating: "",
    content: "",
  });
  const [isOpenComment, setOpenComment] = useState<boolean>(false);
  const getInformation = async () => {
    const dataProduct = await inforProductById(idProduct);
    const listItems = JSON.parse(dataProduct.ListItems);

    setProductInventory(listItems);
    handleSelectImage(listItems[0]?.ListImage);
    const filteredObject = listItems.reduce((acc, currentItem) => {
      interestedProperties.forEach((property) => {
        if (!acc[property]) {
          acc[property] = [];
        }
        // Kiểm tra nếu thuộc tính hiện tại không rỗng hoặc không phải là chuỗi trống
        if (
          currentItem[property] !== "" &&
          currentItem[property] !== null &&
          currentItem[property] !== undefined
        ) {
          const values = currentItem[property].split(","); // Chuyển chuỗi thành mảng
          values.forEach((value) => {
            const valueExists = acc[property].some((item) => item === value);

            if (!valueExists) {
              acc[property].push(value);
            }
          });
        }
      });
      return acc;
    }, {});

    for (const property in filteredObject) {
      filteredObject[property].sort((a, b) => a.localeCompare(b));
    }

    setDataProduct(dataProduct);
    setOptionProduct(filteredObject);
    handleSelectedOption(listItems[0]);
    setOptionTypeColor(filteredObject);
  };

  const handleChangeOption = (item, options, e) => {
    const IsActive = e.target.id;
    if (IsActive === "Active") {
      if (options === "Color") {
        const data = productInventory.filter((i) => i.Color === item);

        const filterByColor = data.reduce((acc, currentItem) => {
          interestedProperties.forEach((property) => {
            // Kiểm tra thuộc tính hiện tại có phải là "Color" hay không
            if (property === "Color") {
              acc["Color"] = optionProduct.Color;
              setSelectedOption((prevOptions) => ({
                ...prevOptions,
                Color: item,
              }));

              const CreateOptionByColor = productInventory.filter(
                (i) => i.Color === item
              );
              handleSelectedOption(CreateOptionByColor[0]);
              // console.log(item);

              const key = property;
              if (key !== "Color") {
                acc[property] = [];
                data.forEach((currentItem) => {
                  if (currentItem[property] && currentItem[property] !== "") {
                    const values = currentItem[property].split(",");
                    values.forEach((value) => {
                      if (
                        value !== "" &&
                        !acc[property].includes(value.trim())
                      ) {
                        acc[property].push(value.trim());
                      }
                    });
                  }
                });
              }
            }
            if (!acc[property]) {
              acc[property] = [];
            }

            // Kiểm tra nếu thuộc tính hiện tại không rỗng, không phải là chuỗi trống, và không phải là null hoặc undefined
            if (
              currentItem[property] !== "" &&
              currentItem[property] !== null &&
              currentItem[property] !== undefined
            ) {
              const values = currentItem[property].split(","); // Chuyển chuỗi thành mảng
              values.forEach((value) => {
                // Kiểm tra giá trị trước khi thêm vào mảng
                if (value !== "" && !acc[property].includes(value)) {
                  acc[property].push(value);
                }
              });
            }
          });

          return acc;
        }, {});

        for (const property in filterByColor) {
          filterByColor[property].sort((a, b) => a.localeCompare(b));
        }
        setOptionTypeColor(filterByColor);
      } else {
        setSelectedOption((prevOptions) => ({
          ...prevOptions,
          [options]: item,
        }));
      }
    } else if (IsActive === "UnActive") {
    }
  };

  const [selectedOption, setSelectedOption] = useState({
    Color: "",
    Size: "",
    memory: "",
    screenSize: "",
    scanFrequency: "",
    screenType: "",
    Price: "",
    Id_Product: "",
    Id: "",
    Quantity: "",
  });

  const handleSelectedOption = (dataSelected) => {
    const dataKey = Object.keys(selectedOption);
    const updatedSelectedOption = { ...selectedOption };
    for (const key in dataSelected) {
      if (
        key !== "Price" &&
        key !== "Id_Product" &&
        key !== "Id" &&
        key !== "Quantity"
      ) {
        if (dataKey.includes(key) && dataSelected[key].length) {
          const values = dataSelected[key].split(",");
          updatedSelectedOption[key] = values[0];
        }
      } else {
        // Nếu key là "Price"
        updatedSelectedOption[key] = dataSelected[key];
      }
    }

    setSelectedOption(updatedSelectedOption);
  };

  const getOptionProduct = (dataListOption) => {
    return interestedProperties.map((property) => {
      const propertyData = dataListOption[property];
      if (propertyData && propertyData.length > 0) {
        const selectedItem = selectDrop[property]?.find(
          (item) => item.value === selectedOption[property]
        );

        return (
          <div className={style.formOptionItems}>
            <div className={style.OptionShow}>
              {selectDrop.OptionsPr.find((item) => item.value === property)
                ?.label || property}
              : {selectedItem.label}
            </div>
            <div className={style.items}>
              {propertyData.map((item, index) => (
                <div
                  className={`${style.item} `}
                  key={index}
                  onClick={(e) => handleChangeOption(item, property, e)}
                  id={
                    optionTypeColor[property]?.includes(item)
                      ? "Active"
                      : "UnActive"
                  }
                  choose={selectedOption[property] === item ? "choosen" : ""}
                >
                  {
                    selectDrop[property].find((data) => data.value === item)
                      ?.label
                  }
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        return <React.Fragment key={property}></React.Fragment>;
      }
    });
  };

  const [mainImage, setMainImage] = useState<string>("");

  const handleSetImage = (image?: string) => {
    setMainImage(image);
  };

  const handleSelectImage = (ListImage) => {
    if (ListImage.length > 0) {
      setListImageProduct(ListImage);
      handleSetImage(ListImage[0].Image);
    }
  };

  const [isCommentPr, setIsCommentPr] = useState({
    ListComment: [],
    averageStars: 0,
    startCount: [],
    total: 0,
  });

  const handleGetCommendProduct = async () => {
    const result = await getDataInforProduct(idProduct);

    const newData = {
      ListComment: [...result.ListComment], // Sử dụng spread operator để sao chép mảng
      averageStars: result.averageStars,
      startCount: [...result.startCount], // Sử dụng spread operator để sao chép mảng
      total: result.ListComment.length,
    };
    setIsCommentPr(newData);

    console.log();
  };

  useEffect(() => {
    getInformation();
    handleGetCommendProduct();
  }, []);

  const selectorLng = useSelector((state) => state?.system.language);
  const { isLogin, current } = useSelector((state) => state.user);

  const handleAddToCart = async () => {
    if (isLogin) {
      const dataSend = {
        Color: selectedOption.Color,
        Id: selectedOption.Id,
        Id_Product: selectedOption.Id_Product,
        Price: selectedOption.Price,
        Quantity: 1,
        Size: selectedOption.Size,
        memory: selectedOption.memory,
        scanFrequency: selectedOption.scanFrequency,
        screenSize: selectedOption.screenSize,
        screenType: selectedOption.screenType,
      };

      const saveProduct = await AddproductToCard(dataSend);
      if (saveProduct.data.err === 0) {
        message.success("Add Product To cart Successfull");
      }
    } else if (isLogin === false && !current) {
      message.error("Vui lòng đăng nhập");
    }
  };

  const handleBuyProduct = async () => {
    if (isLogin) {
      const dataSend = {
        Color: selectedOption.Color,
        Id: selectedOption.Id,
        Id_Product: selectedOption.Id_Product,
        Price: selectedOption.Price,
        Quantity: 1,
        Size: selectedOption.Size,
        memory: selectedOption.memory,
        scanFrequency: selectedOption.scanFrequency,
        screenSize: selectedOption.screenSize,
        screenType: selectedOption.screenType,
      };

      const saveProduct = await AddproductToCard(dataSend);
      if (saveProduct.data.err === 0) {
        message.success("Add Product To cart Successfull");
        navigate("/us/cart");
      }
    } else if (isLogin === false && !current) {
      message.error("Vui lòng đăng nhập");
    }
  };

  const openComment = () => {
    setOpenComment(!isOpenComment);
  };

  const handleOnComment = (value, key) => {
    setDataComment((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleAddComment = async () => {
    if (isLogin === false) {
      message.error("Vui lòng đăng nhập");
    } else {
      const formdata = new FormData();
      formdata.append("id_Product", idProduct);
      formdata.append("start", dataComment.rating);
      formdata.append("content", dataComment.content);

      const result = await ratingProduct(formdata);
      if (result.data.err === 0) {
        message.success("Create comment Success");
        handleGetCommendProduct();
      } else {
        message.error("Bạn đã đánh giá sản phẩm này rồi");
      }
    }
  };

  // console.log(dataProduct);

  return (
    <div className={style.mainFormDetail}>
      <div className={style.formProduct}>
        <div className={style.productItems}>
          <div className={style.Product}>
            <div className={style.leftProduct}>
              <div className={style.Image}>
                <div className={style.mainImg}>
                  <Image
                    src={URL_SERVER_IMG + mainImage}
                    width={300}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className={style.itemChild}>
                  {listImageProduct?.length &&
                    listImageProduct.map((item) => (
                      <div
                        className={style.item}
                        onClick={() => handleSetImage(item.Image)}
                      >
                        <img
                          src={URL_SERVER_IMG + item.Image}
                          style={{ width: "90%", height: "90%" }}
                        />
                      </div>
                    ))}
                </div>
              </div>
              <div className={style.aboutProduct}>
                {`
- CPU: Intel Core i7-12700H
- Màn hình: 15.6" IPS (1920 x 1080),144Hz
- RAM: 1 x 8GB DDR4 3200MHz
- Đồ họa: RTX 3050Ti 4GB GDDR6 | Intel Iris Xe Graphics
- Lưu trữ: 512GB SSD M.2 NVMe /
- Hệ điều hành: Windows 11 Home
- Pin: 4 cell 57 Wh
- Khối lượng: 2.5kg
- Chuẩn Non-EVO
              `}
              </div>
            </div>
            <div className={style.rightProduct}>
              <div className={style.formTitle}>
                <div className={style.nameProduct}>
                  {selectorLng === "vi"
                    ? dataProduct.NameVI
                    : dataProduct.NameEN}
                </div>

                <div className={style.nameBrand}>
                  {selectorLng === "vi" ? (
                    <span className={style.fontTilte}>Thương Hiệu: </span>
                  ) : (
                    <span className={style.fontTilte}>Thương Hiệu: </span>
                  )}
                  {dataProduct.NameBrand}
                </div>

                <div className={style.priceProduct}>
                  {dataProduct.Discount > 0 ? (
                    <div className={style.formMoney}>
                      <div className={style.price}>
                        {(
                          selectedOption.Price -
                          selectedOption.Price * (dataProduct.Discount / 100)
                        )
                          .toLocaleString()
                          .replace(/,/g, ".")}
                        đ
                      </div>
                      <div className={style.befordiscount}>
                        giá cũ:
                        {selectedOption.Price.toLocaleString().replace(
                          /,/g,
                          "."
                        )}
                        đ
                      </div>
                    </div>
                  ) : (
                    <div className={style.formMoney}>
                      <div className={style.price}>
                        {selectedOption.Price.toLocaleString().replace(
                          /,/g,
                          "."
                        )}
                        đ
                      </div>
                    </div>
                  )}
                </div>
                {/* <div className={style.quantity} ><span>Số Lượng </span><Input addonBefore="+" addonAfter="-" type="number" min={1} /> </div> */}

                <div className={style.fromButton}>
                  <Button onClick={handleBuyProduct}>BUY</Button>

                  <Button onClick={handleAddToCart}>ADD TO CART</Button>
                </div>
              </div>
              <div className={style.formOption}>
                <div className={style.option}>
                  {getOptionProduct(optionProduct)}
                </div>
              </div>
            </div>
          </div>

          <div className={style.information}></div>
        </div>

        <div className={style.formDes}>
          {/* <DescribeProduct /> */}
          <div className={style.title}>Customer Reviews</div>
          <div className={style.formReview}>
            <div className={style.formRating}>
              <Ratting
                total={isCommentPr.total}
                persent={isCommentPr.averageStars}
              />
            </div>
            <div className={style.formVoteBar}>
              {isCommentPr.startCount.reverse().map((count, index) => (
                <VoteBar
                  number={index + 1}
                  ratingCount={count}
                  ratingTotal={isCommentPr.total}
                />
              ))}
            </div>
          </div>
          <div className={style.formAddRating}>
            <Button className={style.btnOranged} onClick={openComment}>
              Thêm dánh giá
            </Button>
            <div
              className={style.addComment}
              id={isOpenComment ? "Active" : undefined}
            >
              <div className={style.formInfo}>
                <div className={style.users}>
                  <span>User: </span>{" "}
                  <Input
                    className={style.formRegister}
                    value={current.UserName}
                    disabled
                  />
                </div>
                <div className={style.formRating}>
                  <div className={style.labelRating}>Rating</div>
                  <Rate
                    onChange={(value) => handleOnComment(value, "rating")}
                  />
                </div>
                <TextArea
                  className={style.textAreaCustome}
                  onChange={(e) => handleOnComment(e.target.value, "content")}
                  placeholder="Thêm Bình Luận"
                />

                <div className={style.btnSaveComment}>
                  <Button onClick={handleAddComment}>Comment</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listCommentUser}>
          <div className={style.formComment}>
            <Comment data={isCommentPr.ListComment} />
          </div>
        </div>
      </div>
      {dataProduct && Object.keys(dataProduct).length > 0 && (
        <RelatedProduct
          product={{
            Id: dataProduct.Id,
            Type_Product: dataProduct.Type_Product,
          }}
        />
      )}
    </div>
  );
}
