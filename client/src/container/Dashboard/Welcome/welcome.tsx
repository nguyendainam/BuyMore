import React, { useEffect, useState } from "react";
// import { ShowLoading } from '../../../components/Loading'
import style from "./welcome.module.scss";
import { FaUserFriends, FaGifts, FaHandHoldingUsd } from "react-icons/fa";
// import { FaHandHoldingUsd } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import { Rate, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { ChartEccommer } from "./Chart";
import { ActiveUser } from "./AvitceUser";
import { getTopRattingProduct } from "../../../components/getRating";
import Column from "antd/es/table/Column";
import { URL_SERVER_IMG } from "../../../until/enum";
import { TotalUsersWelcome } from "../../../components/GetUser";

export default function Welcome() {
  const [dataTopRating, setDataTopRating] = useState([]);
  const [dataTotal, setDataTotal] = useState({});
  const handleGetTopProduct = async () => {
    const result = await getTopRattingProduct();
    console.log('sssssssssssss', result);
    setDataTopRating(result);
  };

  const handleTotal = async () => {
    const result = await TotalUsersWelcome();
    setDataTotal(result);
  };

  useEffect(() => {
    handleGetTopProduct();
    handleTotal();
  }, []);

  return (
    <div className={style.mainFormView}>
      <div className={style.topListInformation}>
        <div className={style.tab}>
          <div className={style.nametab}>USER</div>
          <div className={style.statistics}>
            <div>
              <FaUserFriends />
            </div>
            <div>{dataTotal.totalUsers}</div>
          </div>
        </div>
        <div className={style.tab}>
          <div className={style.nametab}>TOTAL</div>
          <div className={style.statistics}>
            <div>
              <FaHandHoldingUsd color={"#4CB9E7"} />
            </div>
            <div>{dataTotal.totalPrice?.toLocaleString()}</div>
          </div>
        </div>
        <div className={style.tab}>
          <div className={style.nametab}>ODER</div>
          <div className={style.statistics}>
            <div>
              <FaGifts color={"red"} />
            </div>
            <div>{dataTotal.TotalOrders}</div>
          </div>
        </div>
      </div>

      <div className={style.Chart}>
        <div className={style.formActive}>
          <ActiveUser />
        </div>
        <div className={style.formChar}>
          <Table dataSource={dataTopRating} tableLayout="auto">
            <Column
              width={10}
              title="Image"
              render={(value, record) => {
                return (
                  <div style={{ width: "50px", height: "50px" }}>
                    <img
                      src={URL_SERVER_IMG + record.Image}
                      style={{ width: "100%" }}
                    />
                  </div>
                );
              }}
            />
            <Column
              width={35}
              title="Name Product"
              render={(value, record) => {
                return (
                  <div
                    style={{ width: "250px", height: "50px", fontSize: "12px" }}
                  >
                    {record.NameEN}
                  </div>
                );
              }}
            />
            <Column
              title="Rating"
              render={(valur, record) => (
                <Rate
                  value={record.AverageRating}
                  disabled
                  style={{ cursor: "pointer" }}
                />
              )}
            />
          </Table>
        </div>
      </div>

      <div className={style.formContent}></div>
    </div>
  );
}
//  <div className={style.formTopUser}>
//    <div className={style.title}>Top Users</div>
//    {/* <Table columns={columns} dataSource={data} scroll={{ y: 350 }} /> */}
//  </div>;
