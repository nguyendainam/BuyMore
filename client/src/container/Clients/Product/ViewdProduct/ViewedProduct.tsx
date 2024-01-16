// ViewedProduct.tsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Carousel from "react-simply-carousel";
import styles from "./viewedProduct.module.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export function ViewedProduct() {
  const { listProduct } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const handleOnChangeProduct = (item: string) => {
    navigate(`/d/chi-tiet-san-pham?product=${item}`);
  };

  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  return (
    <div className={styles.mainView}>
      <div className={styles.title}>{t("viewed")}</div>
      <div className={styles.listProduct}>
        <Carousel
          containerProps={{
            style: {
              width: "100%",
              justifyContent: "space-between",
              userSelect: "none",
            },
          }}
          preventScrollOnSwipe
          swipeTreshold={60}
          activeSlideIndex={activeSlide}
          onRequestChange={setActiveSlide}
          forwardBtnProps={{
            children: <FaArrowRight />,
            style: {
              width: 20,
              height: 60,
              minWidth: 60,
              alignSelf: "center",
              background: "#AFC8AD",
              border: "none",
            },
          }}
          backwardBtnProps={{
            children: <FaArrowLeft />,
            style: {
              width: 20,
              height: 60,
              minWidth: 60,
              alignSelf: "center",
              background: "#AFC8AD",
              border: "none",
            },
          }}
          itemsToShow={6}
          speed={500}
          centerMode
        >
          {listProduct.map((item, index) => {
            const priceProduct = item.price;
            const discount = item.discount;
            let priceShow = priceProduct;
            let savingMoney = 0;
            if (discount > 0) {
              priceShow = priceProduct - (priceProduct * discount) / 100;
              savingMoney = priceProduct - priceShow;
            }

            return (
              <div
                className={styles.itemProduct}
                key={index}
                onClick={() => handleOnChangeProduct(item.idProduct)}
              >
                <div className={styles.image}>
                  <img src={URL_SERVER_IMG + item.image} />
                </div>
                {item.discount > 0 ? (
                  <div className={styles.discount}>
                    <div>{t("Save")}</div>
                    <div>
                      {savingMoney?.toLocaleString().replace(/,/g, ".")} đ
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className={styles.brand}>{item.brand}</div>
                <div className={styles.name}>{item.nameVI}</div>
                <div className={styles.price}>
                  {priceShow?.toLocaleString()} <u> .đ</u>
                </div>
                {item.discount > 0 ? (
                  <div className={styles.oldPrice}>
                    {priceProduct?.toLocaleString()} <i>đ</i>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
}
