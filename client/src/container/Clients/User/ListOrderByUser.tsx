import React, { useEffect, useState } from "react";
import { ListOrder } from "../../../components/GetUser";
import style from "./ListOrderByUser.module.scss";
import { URL_SERVER_IMG } from "../../../until/enum";
import Select from "../../../components/datatest/Select";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function ListOrderByUser() {
  const [listData, setListData] = useState([]);

  const interestedProperties = [
    "Color",
    "Size",
    "memory",
    "screenSize",
    "scanFrequency",
    "screenType",
  ];

  const statusOrder = [
    { value: "Wait", labelVI: "Đang đợi", labelEN: "Waitting " },
    { value: "Sending", labelVI: "Đang giao", labelEN: "Sending " },
    { value: "Bougth", labelVI: "Đã Mua", labelEN: "Bought " },
  ];

  const handleListOrder = async () => {
    const result = await ListOrder();
    setListData(result);
  };

  useEffect(() => {
    handleListOrder();
  }, []);

  const renderProperty = (key, value) => (
    <div key={key} style={{ margin: "5px" }}>
      <strong>{key}:</strong> {value}
    </div>
  );

  const { language } = useSelector((state) => state.system);
  const navigate = useNavigate()
  const handleGetDetailProduct = (item) => {
    navigate(`/d/chi-tiet-san-pham?product=${item}`);
  }


  return (
    <div className={style.mainListOrder}>
      {listData.length &&
        listData.map((item) => {
          const firstImage = item.Image.split(",")[0];
          const options =
            item.Options !== null ? JSON.parse(item.Options) : null;

          const resumeData = (options) =>
            interestedProperties.map((property) => {
              const data = options[property]
                ? Select[property].filter(
                  (item) => item.value === options[property]
                )
                : null;

              return data ? renderProperty(property, data[0].label) : null;
            });

          const status = statusOrder.filter(
            (status) => status.value === item.StatusCart
          );

          return (
            <div className={style.items} key={item.Id}>
              <div className={style.image}>
                <img src={`${URL_SERVER_IMG}${firstImage}`} alt={item.NameVI} />
              </div>
              <div className={style.information}>
                <div className={style.nameProduct}> {item.NameVI} </div>
                <div className={style.nameBrand}>{item.NameBrand}</div>
                <div className={style.nameOption}>
                  {options && resumeData(options)}
                </div>
              </div>
              <div className={style.formPrice}>
                {item.TotalPrice?.toLocaleString()} vnđ
              </div>
              <div className={style.formQuantity}>
                <input value={item.Quantity} disabled />
              </div>
              <div className={style.formInforOrder}>
                <div className={style.date}>
                  <span>Ngày Đặt Hàng:</span>{" "}
                  <span>
                    {moment(item.CreatedAT).format("DD-MM/YYYY HH:MM ")}
                  </span>
                </div>
                <div className={style.status}>
                  <span>Trạng Thái:</span>{" "}
                  <span>
                    {" "}
                    {language === "vi" ? status[0].labelVI : status[0].labelEN}
                  </span>
                </div>

                <div>
                  <Button className={style.btnBlue} onClick={() => handleGetDetailProduct(item.Id)} >Đánh giá</Button>
                  <Button className={style.btnWhite} onClick={() => handleGetDetailProduct(item.Id)} >Mua lại</Button>
                </div>
              </div>
              <div>{/* Render date here */}</div>
            </div>
          );
        })}
    </div>
  );
}
