// ViewedProduct.tsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Carousel from "react-simply-carousel";
import styles from "./viewedProduct.module.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { useNavigate } from "react-router-dom";
export function ViewedProduct() {
  const { listProduct } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const handleOnChangeProduct = (item: string) => {
    navigate(`/d/chi-tiet-san-pham?product=${item}`);
  };

  useEffect(() => {}, [listProduct]);

  // console.log(listProduct);
  const [activeSlide, setActiveSlide] = useState(0);
  return (
    <div className={styles.mainView}>
      <div className={styles.title}>Các sản phẩm vừa xem</div>
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
          // activeSlideProps={{
          //   style: {
          //     border: "10px solid red",
          //   },
          // }}
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
          itemsToShow={4}
          speed={500}
          centerMode
        >
          {listProduct.map((item, index) => (
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
                  <div>Tiết kiệm</div>
                  <div>{item.saveMoney}</div>
                </div>
              ) : (
                ""
              )}

              <div className={styles.brand}>{item.brand}</div>
              <div className={styles.name}>{item.nameVI}</div>
              <div className={styles.price}>
                {item.priceShow?.toLocaleString()} <u>đ</u>
              </div>
              {item.discount > 0 ? (
                <div className={styles.oldPrice}>
                  {item.productPrice?.toLocaleString()} <i>đ</i>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
