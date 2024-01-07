import React, { useEffect, useState } from "react";
import style from "./RelatedProduct.module.scss";

import { useSelector } from "react-redux";
import Carousel from "react-simply-carousel";
import styles from "./RelatedProduct.module.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { getAllProductByKey } from "../../../../components/AllProduct";

export const RelatedProduct: React.FC = (product: any) => {
  const [listProduct, setListProduct] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const getProductByKey = async () => {
    const TypeProduct = Object.values(product)[0].Type_Product;
    const Id = Object.values(product)[0].Id;

    const result = await getAllProductByKey(TypeProduct);
    const avoidDuplication = result.filter((item) => item.idProduct !== Id);
    setListProduct(avoidDuplication);
  };

  useEffect(() => {
    getProductByKey();
  }, []);

  return (
    <div className={style.container}>
      <div className={styles.mainView}>
        <div className={styles.title}>Các sản phẩm liên quan</div>
        <div className={styles.listProduct}>
          <Carousel
            containerProps={{
              style: {
                width: "100%",
                // minWidth: "500px",
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
                // onClick={() => handleOnChangeProduct(item.idProduct)}
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
    </div>
  );
};
