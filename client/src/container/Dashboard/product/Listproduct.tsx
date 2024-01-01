import React, { useEffect, useState } from "react";
import style from "./Listproduct.module.scss";
import { Checkbox, Slider, message } from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import Column from "antd/es/table/Column";
import { HiDotsVertical } from "react-icons/hi";
import { getAllProductDashboard } from "../../../components/AllProduct";
import { URL_SERVER_IMG } from "../../../until/enum";
import { AllProductType } from "../../../components/GetdataCategory";
import { GetAllListsBrand } from "../../../components/GetBrand";
import { handleSearchProduct } from "../../../services/product";
export default function Listproduct() {
  const [money, setMoney] = useState({
    start: 0,
    end: 100000000,
  });

  const [funds, setFunds] = useState({
    start: 0,
    end: 0,
  });
  const onChange = (value: number | number[]) => {
    setFunds({
      start: value[0],
      end: value[1],
    });
  };

  const [data, setData] = useState([]);
  const [datafilter, setDataFilter] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionsBrand, setOptionsBrand] = useState([]);

  const handleGetAllProduct = async () => {
    const data = await getAllProductDashboard();
    const dataCat = await AllProductType();

    setDataCategory(dataCat);
    handleCreateOption(dataCat);

    const result = await data.map((item) => {
      const category = dataCat.filter((cat) => cat.Id === item.type_product);

      return {
        key: item.productId,
        image: item.image,
        name: item.nameVI,
        otherName: item.nameEN,
        brand: item.brand,
        quantity: 100,
        price: item.price,
        discount: item.discount + "%",
        totalProduct: item.totalProduct,
        category: category[0].nameVI,
        category_id: category[0].Id,
        brand_id: item.brand_id,
      };
    });

    setData(result);
    setDataFilter(result);
  };

  const handleCreateOption = (dataCategory) => {
    const arr = dataCategory.map((item) => ({
      value: item.Id,
      label: item.nameVI,
    }));
    setOptions(arr);
  };
  const handleGetBrandOption = async () => {
    {
      const arrBrand = await GetAllListsBrand();
      const arr = arrBrand.map((item) => ({
        value: item.idBrand,
        label: item.nameBrand,
      }));
      setOptionsBrand(arr);
    }
  };

  useEffect(() => {
    Promise.all([handleGetAllProduct(), handleGetBrandOption()]);
  }, []);

  const handleOnchangeBox = async (value) => {
    if (value && value.length > 0) {
      const findProduct = await datafilter.filter((item) => {
        return value.includes(item.category_id);
      });
      setData(findProduct);
    } else {
      setData(datafilter);
    }
  };

  const handleOnchangeBoxBrand = async (value) => {
    console.log(value);
    if (value && value.length > 0) {
      const findProduct = await data.filter((item) => {
        return value.includes(item.brand_id);
      });
      setData(findProduct);
    } else {
      setData(datafilter);
    }
  };

  const handleOnSearch = async (key: string) => {
    if (key.length > 0) {
      const searchProduct = datafilter.filter((item) =>
        item.name.toLowerCase().includes(key.toLowerCase())
      );
      setData(searchProduct);
    } else {
      setData(datafilter);
    }
  };

  return (
    <div className={style.mainViewList}>
      <div className={style.formLeft}>
        <div className={style.category}>
          <div>Category</div>
          <div className={style.listCheckBox}>
            <Checkbox.Group
              options={options}
              onChange={(value) => handleOnchangeBox(value)}
            />
          </div>
        </div>

        <div className={style.category}>
          <div>Brand</div>
          <div className={style.listCheckBox}>
            <Checkbox.Group
              options={optionsBrand}
              onChange={(value) => handleOnchangeBoxBrand(value)}
            />
          </div>
        </div>
      </div>

      <div className={style.formRight}>
        <div className={style.formSearch}>
          <Search
            placeholder="input search text"
            enterButton
            className={style.search}
            onChange={(event) => handleOnSearch(event.target.value)}
          />
        </div>

        <div className={style.table}>
          <Table dataSource={data}>
            <Column
              title="Product"
              width={"35%"}
              render={(value, record) => {
                return (
                  <div className={style.products}>
                    <div className={style.imageProduct}>
                      {" "}
                      <img src={`${URL_SERVER_IMG}${record?.image}`} />
                    </div>
                    <div className={style.formInfor}>
                      <div className={style.name}>{record.name}</div>
                      <div className={style.name}>{record.brand}</div>
                    </div>
                  </div>
                );
              }}
            />
            <Column title="Category" width={"10%"} dataIndex={"category"} />
            <Column title="Stock" width={"10%"} dataIndex={"totalProduct"} />
            <Column title="Discount" width={"10%"} dataIndex={"discount"} />
            <Column
              title="Price"
              width={"10%"}
              render={(value, record) => {
                return (
                  <div>
                    {record.price?.toLocaleString().replace(/,/g, ".") + " đ"}
                  </div>
                );
              }}
            />
            <Column
              width={"5%"}
              render={(value, record) => {
                return (
                  <>
                    <div className={style.icons}>
                      <HiDotsVertical />
                    </div>

                    <div className={style.optProduct}>
                      <div>Edit</div>
                      <div>Delete</div>
                    </div>
                  </>
                );
              }}
            />
          </Table>
        </div>
      </div>
    </div>
  );
}
