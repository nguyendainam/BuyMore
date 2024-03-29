import React, { useEffect, useState } from "react";
import style from "./RecommendByRating.module.scss";
import { getProductByRating } from "../../../../components/GetProduct";
import { Image } from "antd";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProductViewed } from "../../../../redux/Slice/productSlice";
import { useTranslation } from "react-i18next";

export const GetProductByRating = () => {
  const [dataProduct, setDataProduct] = useState([]);
  const { t } = useTranslation();
  const getDataProduct = async () => {
    const result = await getProductByRating();
    setDataProduct(result);
  };

  const { current } = useSelector((state) => state.user);
  useEffect(() => {
    getDataProduct();
  }, [current.Email]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onchangeProduct = (item) => {
    const id = item.productId;
    dispatch(addProductViewed({ product: item }));
    navigate(`d/chi-tiet-san-pham?product=${id}`);
  };

  return (
    <>
      {dataProduct.length > 0 && (
        <div className={style.mainView}>
          <div className={style.title}>{t("like")}</div>
          <div className={style.products}>
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
                        {item.savingPrice?.toLocaleString().replace(/,/g, ".")}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className={style.brands}> {item.brand} </div>
                  <div className={style.formNameProduct}>{item.nameVI}</div>

                  <div className={style.price}>
                    {item.priceAfterDiscount
                      ?.toLocaleString()
                      .replace(/,/g, ".")}{" "}
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
      )}
    </>
  );
};
