import React, { useEffect, useState } from "react";
import style from "./CustomerInfor.module.scss";
import { List, Select, Spin, Table } from "antd";
import {
  getAllUserSelect,
  getInforUserById,
} from "../../../components/ManageUser";
import moment from "moment";
import Column from "antd/es/table/Column";

interface ICustomerInfor {
  Id?: string;
}

const CustomerInfor: React.FC<ICustomerInfor> = () => {
  const [listUser, setListUser] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);
  const [inforUser, setInforUser] = useState([]);
  const [dataAdress, setDataAddress] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);

  const handleGetListUser = async () => {
    const dataUser = await getAllUserSelect();
    setListUser(dataUser);
    const listArr = dataUser.map((i) => {
      return {
        value: i.idUser,
        label: i.UserName,
      };
    });
    setDataSelect(listArr);
  };

  useEffect(() => {
    handleGetListUser();
  }, []);

  const handleOnChangeUser = async (userId: string) => {
    const getDataUser = listUser.filter((item) => item.idUser === userId);

    const dataInfor = await getInforUserById(userId);
    setDataAddress(dataInfor.dataAddress[0]);
    setDataOrder(dataInfor.dataOrder);

    const dateObj = moment(getDataUser[0].CreatedAt);
    const distance = dateObj.fromNow();
    setInforUser({
      ...getDataUser[0],
      distance,
    });
  };

  return (
    <div className={style.mainView}>
      <div className={style.formSelect}>
        <Select
          showSearch
          className={style.formsearchUser}
          labelInValue
          filterOption={(input, option) =>
            (option?.label?.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          placeholder="Select users"
          notFoundContent={<Spin size="small" />}
          options={dataSelect}
          onChange={(value) => handleOnChangeUser(value.value)}
        />
      </div>
      <div className={style.container}>
        <div className={style.left}>
          <div className={style.image}>
            <img src="https://static.vecteezy.com/system/resources/previews/024/766/958/original/default-male-avatar-profile-icon-social-media-user-free-vector.jpg" />
          </div>
          <div className={style.infor}>
            <div>{inforUser?.UserName}</div>
            <div>{inforUser?.Email}</div>{" "}
          </div>

          <div className={style.aboutUser}>
            <div className={style.itemInfor}>
              <div className={style.title}>LastOrder</div>
              <div className={style.content}>
                {" "}
                {dataOrder[0]?.listOrder[0].CreatedAT &&
                  moment(dataOrder[0].listOrder[0].CreatedAT).format(
                    "DD-MM-YY HH:MM"
                  )}
              </div>
            </div>
            <div className={style.itemInfor}>
              <div className={style.title}>Average Order Value</div>
              <div className={style.content}>
                {dataOrder[0]?.aov?.toLocaleString().replace(/,/g, ".") || 0}{" "}
                .vnđ
              </div>
            </div>

            <div className={style.itemInfor}>
              <div className={style.title}>Registered</div>
              <div className={style.content}>{inforUser.distance}</div>
            </div>
          </div>
        </div>
        <div className={style.right}>
          <div className={style.tableOrder}>
            <div className={style.titleTable}>
              <span>Oder</span>
              <span>
                {dataOrder.length > 0 &&
                  dataOrder[0]?.listOrder
                    .reduce((acc, value) => acc + value.TotalPrice, 0)
                    ?.toLocaleString()
                    .replace(/,/g, ".")}
                .vnđ
              </span>
            </div>
            <div className={style.table}>
              <Table
                dataSource={dataOrder[0]?.listOrder}
                pagination={false}
                scroll={{ y: 300 }}
                bordered
              >
                <Column
                  title="Id"
                  render={(value, record) => {
                    return (
                      <div className={style.linkOrder}>{record.Id_Order}</div>
                    );
                  }}
                />
                <Column
                  title="Date"
                  render={(value, record) => {
                    return (
                      <div className={style.date}>
                        {moment(record.CreatedAT).format("DD-MM-YYYY")}
                      </div>
                    );
                  }}
                />
                <Column
                  title="Status"
                  render={(value, record) => {
                    return <div className={style.date}>{record.Status}</div>;
                  }}
                />
                <Column
                  title="Items"
                  render={(value, record) => {
                    const total = record?.CartList;
                    const paseData = JSON.parse(total);

                    return (
                      <div className={style.date}>
                        {paseData[0].TotalQuantity}
                      </div>
                    );
                  }}
                />
                <Column
                  title="Total"
                  render={(value, record) => {
                    return (
                      <div className={style.date}>
                        {record.TotalPrice?.toLocaleString().replace(/,/g, ".")}{" "}
                        .vnđ
                      </div>
                    );
                  }}
                />
              </Table>
            </div>
          </div>

          <div className={style.listAddress}>
            <div className={style.titleTable}>
              <span>Address</span>
              {/* <span>Total</span> */}
            </div>
            <div className={style.table}>
              <Table
                dataSource={dataAdress}
                pagination={false}
                scroll={{ y: 300 }}
                bordered
              >
                <Column
                  title="Address"
                  render={(value, record) => {
                    return (
                      <div className={style.linkOrder}>{record.Line1}</div>
                    );
                  }}
                />
                <Column
                  title="Ward"
                  render={(value, record) => {
                    return (
                      <div className={style.linkOrder}>{record.Ward.label}</div>
                    );
                  }}
                />
                <Column
                  title="District"
                  render={(value, record) => {
                    return (
                      <div className={style.linkOrder}>
                        {record.District.label}
                      </div>
                    );
                  }}
                />
                <Column
                  title="City"
                  render={(value, record) => {
                    return (
                      <div className={style.linkOrder}>{record.City.label}</div>
                    );
                  }}
                />
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfor;
