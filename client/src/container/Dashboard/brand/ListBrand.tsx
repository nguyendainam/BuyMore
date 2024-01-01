import React, { useEffect, useState } from "react";
import style from "./ListBrand.module.scss";
import { Space, Table } from "antd";
import { GetAllListsBrand } from "../../../components/GetBrand";
import Column from "antd/es/table/Column";
import { URL_SERVER_IMG } from "../../../until/enum";
import { MdDelete, MdEditSquare } from "react-icons/md";
export default function ListBrand() {
  const [listBrand, setListBrand] = useState([]);
  const handleGetListBrand = async () => {
    const data = await GetAllListsBrand();
    setListBrand(data);
  };
  useEffect(() => {
    handleGetListBrand();
  }, []);
  return (
    <>
      <Table dataSource={listBrand} pagination={false} scroll={{ y: 700 }}>
        <Column title="NameBrand" dataIndex="nameBrand" />
        <Column
          title="Description VI"
          dataIndex="descVI"
          render={(text) => <div dangerouslySetInnerHTML={{ __html: text }} />}
        />
        <Column
          title="Description EN"
          dataIndex="descEN"
          render={(text) => <div dangerouslySetInnerHTML={{ __html: text }} />}
        />
        <Column
          title="Image"
          dataIndex="imageBrand"
          render={(image) => (
            <div>
              <img src={URL_SERVER_IMG + image} />
            </div>
          )}
        />

        <Column
          title="Action"
          key="key"
          render={(record) => (
            <Space size="middle">
              <div className={style.buttonEdit}>
                <MdEditSquare />
              </div>

              <div className={style.buttonDelete}>
                <MdDelete />
              </div>
            </Space>
          )}
        />
      </Table>
    </>
  );
}
