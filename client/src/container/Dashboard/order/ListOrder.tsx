import React, { useEffect, useState } from "react";
import style from "./ListOrder.module.scss";
import Search from "antd/es/input/Search";
import { Input, Modal, Select, Table, message } from "antd";
import { getAllListOrder } from "../../../components/ManageOrder";
import Column from "antd/es/table/Column";
import moment from "moment";
import { CiSearch } from "react-icons/ci";
import FormData from "form-data";
import { getOnchageOrder } from "../../../services/user";

export const arrOption = [
  { key: "Processing", value: "Processing" },
  { key: "Accepted", value: "Accepted" },
  { key: "Cancel", value: "Cancel" },
  { key: "Sending", value: "Sending" },
];

export default function ListOrder() {
  const [dataItems, setDataItems] = useState([]);
  const [selectItem, setSelectedItem] = useState({
    id: "",
    status: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleGetListData = async () => {
    const result = await getAllListOrder();
    setDataItems(result);
  };

  useEffect(() => {
    handleGetListData();
  }, []);

  const onClose = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleOpenModal = (idOrder: string, status: string) => {
    setSelectedItem({
      id: idOrder,
      status: status,
    });
    console.log(idOrder);
    console.log(status);

    setIsModalVisible(!isModalVisible);
  };
  const handleChangeStatus = (value) => {
    setSelectedItem((prevState) => ({
      ...prevState,
      status: value,
    }));
  };

  const handleOnSave = async () => {
    const formData = new FormData();
    formData.append("id", selectItem.id);
    formData.append("status", selectItem.status);

    const result = await getOnchageOrder(formData);
    if (result.data.err === 0) {
      message.success("Update success full");
      handleGetListData();
      setIsModalVisible(!isModalVisible);
    }
  };



  return (
    <div className={style.mainViewForm}>
      <div className={style.formContent}>
        <div className={style.formSearch}>
          <Search placeholder="Search" enterButton />
        </div>

        <div className={style.formTable}>
          <Table dataSource={dataItems}>
            <Column
              title="Date"
              render={(value, record) => (
                <div>{moment(record.date).format("MMM DD,YYYY")}</div>
              )}
            />
            <Column title="User" dataIndex={"userName"} />
            <Column
              title="Items"
              render={(value, record) => (
                <div className={style.items}>{record.quantity} items</div>
              )}
            />
            <Column
              title="Paid"
              render={(value, record) => {
                return (
                  <div className={style.itemPaid}>
                    {(record.paid = "paid" ? "Yes" : "No")}
                  </div>
                );
              }}
            />
            <Column
              title="Status"
              render={(value, record) => {
                let color;
                if (record.status === "Processing") {
                  color = "blue";
                } else if (record.status === "Accepted") {
                  color = "#65B741";
                }
                return <div style={{ color: `${color}` }}>{record.status}</div>;
              }}
            />
            <Column
              title="Price"
              render={(value, record) => (
                <div>
                  {record.totalPrice?.toLocaleString().replace(/,/g, ".")}
                </div>
              )}
            />
            <Column
              title=""
              render={(value, record) =>
                record.status !== "Accepted" ? (
                  <div
                    className={style.icon}
                    onClick={() => handleOpenModal(record.orderId, record.status)}
                  >
                    <CiSearch />
                  </div>
                ) : null
              }
            />

          </Table>
        </div>
      </div>
      {isModalVisible && (
        <Modal
          title="Change Status"
          visible={isModalVisible}
          onCancel={onClose}
          onOk={handleOnSave}
        >
          <div className={style.formInput}>
            <Select
              defaultValue={"Processing"}
              value={selectItem.status}
              onChange={(value) => handleChangeStatus(value)}
              options={arrOption}
              className={style.formRegister}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
