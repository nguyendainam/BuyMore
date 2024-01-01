import React, { useEffect, useState } from "react";
import style from "./main.module.scss";
import typeMainProduct from "../../../../components/datatest/typeProduct";
import { useNavigate } from "react-router-dom";
import { getTopProductTop6 } from "../../../../components/AllProduct";
import { Image } from "antd";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { useDispatch } from "react-redux";
import { addProductViewed } from "../../../../redux/Slice/productSlice";

export const OutStanding: React.FC = () => {
  const navigate = useNavigate();
  const [productContent, setProductContent] = useState<
    (JSX.Element | JSX.Element[])[]
  >([]);

  const handleGetList = (path: string, id: string) => {
    navigate(`/p/${path}?t=${id}`);
  };

  const dispatch = useDispatch();
  const handleDetailProduct = (key: string, item?) => {
    dispatch(addProductViewed({ product: item }));
    navigate(`/d/chi-tiet-san-pham?product=${key}`);
  };

  const handleGetProduct = async (
    key?: string
  ): Promise<JSX.Element | JSX.Element[]> => {
    try {
      const data = await getTopProductTop6(key);
      if (data) {
        return data.map((item) => (
          <>
            <div
              key={item.idProduct}
              className={style.product}
              onClick={() => handleDetailProduct(item.idProduct, item)}
            >
              <div className={style.formImage}>
                <Image src={URL_SERVER_IMG + item.image} preview={false} />
              </div>
              {item.saveMoney > 0 ? (
                <div className={style.savingMoney}>
                  <span>Tiết kiệm </span>
                  <span>
                    {item.saveMoney.toLocaleString().replace(/,/g, ".")}
                  </span>
                </div>
              ) : (
                ""
              )}

              <div className={style.brands}>{item.brand}</div>
              <div className={style.formNameProduct}>{item.nameVI}</div>

              <div className={style.price}>
                {item.priceShow.toLocaleString().replace(/,/g, ".")}{" "}
                <u className={style.iconvnd}>đ</u>
              </div>
              {item.saveMoney > 0 ? (
                <div className={style.oldPrice}>
                  {item.productPrice.toLocaleString().replace(/,/g, ".")} đ
                </div>
              ) : (
                ""
              )}
            </div>
          </>
        ));
      }
      return []; // Return an empty array in case data is falsy
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; // Return an empty array in case of an error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const content = await Promise.all(
        typeMainProduct.map((item) => handleGetProduct(item.key))
      );
      setProductContent(content);
    };

    fetchData();
  }, []); // Run only once when the component is initially rendered; adjust dependencies if needed

  return (
    <div className={style.mainOutStading}>
      {typeMainProduct.map((item, index) => (
        <div className={style.formProduct} key={item.key}>
          <img src={item.image} alt={item.value} className={style.imgBg} />
          <div className={style.headerForm}>
            <div className={style.title}>{item.value}</div>
            <div
              className={style.smallfont}
              onClick={() => handleGetList(item.path, item.key)}
            >
              Xem tất cả
            </div>
          </div>
          <div className={style.contentForm}>{productContent[index]}</div>
        </div>
      ))}
    </div>
  );
};
