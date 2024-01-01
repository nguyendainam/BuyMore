import React, { useEffect, useState } from "react";
import style from "./AllProduct.module.scss";
import { Button, Checkbox, Input, Pagination, Slider } from "antd";
import { FaAngleDown } from "react-icons/fa6";
import { getAllProductByKey } from "../../../../components/AllProduct";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Select from "../../../../components/datatest/Select";
import { optionFilterProduct } from "../../../../components/datatest/typeProduct";
import { useSelector } from "react-redux";
import { IItemProduct } from "../../../../components/AllProduct";
import { Empty } from "antd";
import { URL_SERVER_IMG } from "../../../../until/enum";

export default function AllProduct() {
  const [activeOptions, setActiveOptions] = useState([]);
  const [btnFilter, setbtnFilter] = useState<string>(
    optionFilterProduct[3].key
  );
  const [products, setProducts] = useState<IItemProduct[]>([]);
  const { language } = useSelector((state) => state.system);
  const [totalProduct, setTotalProduct] = useState<number>(0);
  const [dataFilter, setDataFilter] = useState([]);

  const [money, setMoney] = useState({
    start: 0,
    end: 100000000,
  });

  const [funds, setFunds] = useState({
    start: 0,
    end: 0,
  });
  // const [selectedOptions, setSelectedOptions] = useState({
  //     size: [],
  //     color: [],
  //     screenSize: [],
  //     memory: [],
  //     scanFrequency: [],
  //     screenType: [],
  // });

  const t = useLocation().search.split("?t=")[1];
  const handleGetProduct = async () => {
    const getList = await getAllProductByKey(t);
    setDataFilter(getList);

    let total = 0;
    if (getList.length) {
      total = parseInt(getList.length);
    }
    setTotalProduct(total);
    setProducts(getList);
  };
  const handleOptionClick = (value) => {
    if (activeOptions.includes(value)) {
      // If the value is already in activeOptions, remove it
      setActiveOptions(activeOptions.filter((item) => item !== value));
    } else {
      // If the value is not in activeOptions, add it
      setActiveOptions([...activeOptions, value]);
    }
  };

  useEffect(() => {
    handleGetProduct();
    setFunds((prev) => ({
      ...prev,
      end: money.end,
    }));
  }, []);
  const navigate = useNavigate();
  const handleDetailProduct = (key: string) => {
    navigate(`/d/chi-tiet-san-pham?product=${key}`);
  };

  const handleFilterProduct = (value, key) => {
    let dataAfterFilter = [];
    if (value.length === 0) {
      if (dataAfterFilter.length) {
        setProducts(dataAfterFilter);
      } else {
        setProducts(dataFilter);
      }
      // setProducts(dataFilter)
    } else {
      dataAfterFilter = dataFilter.filter((item) => {
        return item?.productInventory.some((i) => value.includes(i[key]));
      });
      setProducts(dataAfterFilter);
    }
  };
  const onChange = (value: number | number[]) => {
    setFunds({
      start: value[0],
      end: value[1],
    });
    renderProductByPrice();
  };

  const renderProductByPrice = () => {
    const productByPrice = dataFilter.filter((product) => {
      return product.priceShow >= funds.start && product.priceShow <= funds.end;
    });
    // Cập nhật danh sách sản phẩm
    setProducts(productByPrice);
  };

  // const [dataSearch, setDataSearch] = useState('')

  const handleChangeFillter = (key: string) => {
    setbtnFilter(key);
    console.log(key);
    let arrangeProduct = [];
    if (key === "discount") {
      arrangeProduct = [...products].sort((a, b) => b.discount - a.discount);
    } else if (key === "upPrice") {
      arrangeProduct = [...products].sort((a, b) => a.priceShow - b.priceShow);
    } else if (key === "downPrice") {
      arrangeProduct = [...products].sort((a, b) => b.priceShow - a.priceShow);
    } else {
      arrangeProduct = dataFilter;
    }

    setProducts(arrangeProduct);
  };

  const itemsPerPage = 15; // Số lượng sản phẩm muốn hiển thị trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);
  const handlePagination = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={style.mainView}>
      <div className={style.content}>
        <div className={style.sideMenu}>
          <div className={style.priceProduct}>
            <div className={style.priceInput}>
              <Input
                className={style.formMoney}
                value={funds.start.toLocaleString() + "đ"}
              />
              <Input
                className={style.formMoney}
                value={funds.end.toLocaleString() + "đ"}
              />
            </div>
            <Slider
              className={style.sliderCustom}
              range
              step={100000}
              min={0}
              max={money.end}
              onChange={onChange}
              value={[
                typeof funds.start === "number" ? funds.start : 0,
                typeof funds.end === "number" ? funds.end : 0,
              ]}
            />
          </div>

          {Select.OptionClient.map((item) => {
            return (
              <div
                className={style.formOption}
                onClick={() => {
                  handleOptionClick(item.value);
                }}
              >
                <div
                  className={style.titleOption}
                  id="Active"
                  // id={activeOptions.includes(item.value) ? 'Active' : 'UnActive'}
                >
                  <span>{item.label}</span> <FaAngleDown />
                </div>
                <div className={style.option}>
                  <Checkbox.Group
                    options={Select[item.value]}
                    onChange={(value) => handleFilterProduct(value, item.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={style.listProduct}>
          <div className={style.title}>
            Laptop<span>({totalProduct} SẢN PHẨM)</span>{" "}
          </div>
          <div className={style.Option}>
            <span>Sắp Xếp Theo :</span>
            {optionFilterProduct.map((item) => {
              return (
                <Button
                  id={item.key === btnFilter ? "Active" : ""}
                  onClick={() => handleChangeFillter(item.key)}
                >
                  {language === "vi" ? item.labelVI : item.labelEN}
                </Button>
              );
            })}
          </div>

          <div className={style.products}>
            {displayedProducts && displayedProducts.length > 0 ? (
              displayedProducts.map((item) => {
                return (
                  <div
                    className={style.item}
                    onClick={() => handleDetailProduct(item.idProduct)}
                  >
                    <div className={style.image}>
                      <img src={`${URL_SERVER_IMG}${item.image}`} />
                    </div>

                    {item.saveMoney > 0 ? (
                      <div className={style.discount}>
                        <span>Tiết Kiệm</span>
                        <span>
                          {item.saveMoney.toLocaleString().replace(/,/g, ".")}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className={style.brand}>{item.brand}</div>

                    <div className={style.nameProduct}>
                      {language === "vi" ? item.nameVI : item.nameEN}
                    </div>

                    <div className={style.price}>
                      {item.priceShow
                        ? item.priceShow.toLocaleString().replace(/,/g, ".")
                        : item.productPrice
                            .toLocaleString()
                            .replace(/,/g, ".")}{" "}
                      <u>đ</u>
                    </div>
                    {item.saveMoney > 0 ? (
                      <div className={style.oldPrice}>
                        {item.productPrice.toLocaleString().replace(/,/g, ".")}đ
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            ) : (
              <div className={style.formEmpty}>
                <Empty />
              </div>
            )}
          </div>
          <div className={style.pagination}>
            <Pagination
              onChange={handlePagination}
              total={displayedProducts.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
