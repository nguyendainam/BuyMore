import React, { useEffect, useState } from "react";
import style from "./reccommend.module.scss";
import {
  getProductLoginUser,
  getProductReccommend,
} from "../../../../components/GetProduct";
import { useSelector } from "react-redux";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { Image, Pagination } from "antd";
export default function ReccomendProduct() {
  const { isLogin } = useSelector((state) => state.user);

  const [dataProduct, setDataProduct] = useState([]);
  const handleGetListProduct = async () => {
    try {
      let result;

      if (isLogin === true) {
        result = await getProductLoginUser();
      } else {
        result = await getProductReccommend();
      }

      // Kiểm tra xem result có giá trị không rỗng và không null
      if (result) {
        setDataProduct(result);
      } else {
        setDataProduct([]);
        // Hoặc xử lý trường hợp khi không có dữ liệu
      }
    } catch (error) {
      console.error("Error in handleGetListProduct:", error);
      // Xử lý lỗi nếu có
    }
  };

  const itemsPerPage = 15; // Số lượng sản phẩm muốn hiển thị trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = dataProduct.slice(startIndex, endIndex);
  const handlePagination = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    handleGetListProduct();
  }, [isLogin]);

  return (
    <>
      <div className={style.title}>Sản phẩm gợi ý cho bạn</div>
      <div className={style.mainView}>
        {displayedProducts.length &&
          displayedProducts.map((item) => (
            <div
              className={style.itemProduct}
              // onClick={() => onchangeProduct(item)}s
            >
              <div className={style.formImage}>
                <Image src={URL_SERVER_IMG + item.image} preview={false} />
              </div>
              {item.savingPrice > 0 ? (
                <div className={style.savingMoney}>
                  <span>Tiết kiệm</span>
                  <span>
                    {item.savingPrice.toLocaleString().replace(/,/g, ".")}
                  </span>
                </div>
              ) : (
                ""
              )}

              <div className={style.brands}> {item.brand} </div>
              <div className={style.formNameProduct}>{item.nameVI}</div>

              <div className={style.price}>
                {item.priceAfterDiscount.toLocaleString().replace(/,/g, ".")}{" "}
                <u className={style.iconvnd}>đ</u>{" "}
              </div>
              {item.savingPrice > 0 ? (
                <div className={style.oldPrice}>
                  {item.price.toLocaleString().replace(/,/g, ".")} đ
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
      </div>
      <div className={style.pagination}>
        <Pagination
          onChange={handlePagination}
          total={displayedProducts.length}
        />
      </div>
    </>
  );
}
