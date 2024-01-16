import React, { useEffect, useState } from "react";
import style from "./mainFeatured.module.scss";
import {
  getAllProductHomePage,
  IProductHomePage,
} from "../../../../components/GetProduct";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import CryptoJS from "crypto-js";
import { Image } from "antd";
import { addProductViewed } from "../../../../redux/Slice/productSlice";
import { useTranslation } from "react-i18next";

export default function Featured() {
  const [dataProduct, setDataProduct] = useState<IProductHomePage[]>([]);
  // const selector = useSelector((state) => state.system);
  const { t } = useTranslation();
  const handleGetProduct = async () => {
    const data = await getAllProductHomePage();
    setDataProduct(data.slice(0, 10));
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onchangeProduct = (item) => {
    // console.log(item)

    const id = item.productId;
    dispatch(addProductViewed({ product: item }));
    navigate(`d/chi-tiet-san-pham?product=${id}`);
  };

  useEffect(() => {
    handleGetProduct();
  }, []);
  return (
    <div className={style.main}>
      <div className={style.formTitle}>
        <span className={style.title}>{t("newProduct")}</span>

        <div onClick={() => navigate(`/p/san-pham-noi-bat?t=${"ALL"}`)}>
          {t("selectAll")}
        </div>
      </div>

      <div className={style.allProduct}>
        {dataProduct.length &&
          dataProduct.map((item) => (
            <div
              className={style.itemProduct}
              onClick={() => onchangeProduct(item)}
            >
              <div className={style.formImage}>
                <Image src={URL_SERVER_IMG + item.image} preview={false} />
              </div>
              {item.savingPrice > 0 ? (
                <div className={style.savingMoney}>
                  <span>{t("Save")}</span>
                  <span>
                    {item.savingPrice?.toLocaleString().replace(/,/g, ".")}.đ
                  </span>
                </div>
              ) : (
                ""
              )}

              <div className={style.brands}> {item.brand} </div>
              <div className={style.formNameProduct}>{item.nameVI}</div>

              <div className={style.price}>
                {item.priceAfterDiscount?.toLocaleString().replace(/,/g, ".")}{" "}
                <u className={style.iconvnd}>đ</u>{" "}
              </div>
              {item.savingPrice > 0 ? (
                <div className={style.oldPrice}>
                  {item.price?.toLocaleString().replace(/,/g, ".")} đ
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
