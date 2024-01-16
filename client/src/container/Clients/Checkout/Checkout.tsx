import React, { useEffect, useState } from "react";
import style from "./Checkout.module.scss";
import img from "../../../assets/image/payment.svg";
import { useSelector } from "react-redux";
import Column from "antd/es/table/Column";
import { Table } from "antd";
import { URL_SERVER_IMG } from "../../../until/enum";
import { ListAddUser } from "../../../components/GetUser";
import { getDataLocation } from "../../../components/Location";
import Paypal from "../../../components/Paypal";
import ListAddressToShip from "./ModelAddress";

export default function Checkout() {
  const [dataAddress, setDataAddress] = useState({});
  const [listAddress, setListAddress] = useState([]);
  const [idAddress, setIdAddress] = useState<string>('')
  const [total, setTotal] = useState(0);
  const [totalUSD, setTotalUSD] = useState<number>(0);
  const { userCart } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const handleGetSubTotal = () => {
    setIsLoading(true);

    const totalPriceArray = userCart.map((item) => {
      let total = 0;
      if (item.Discount > 0) {
        total += item.TotalPrice - item.TotalPrice * (item.Discount / 100);
      } else {
        total = item.TotalPrice;
      }
      return total;
    });

    // Sử dụng reduce để tính tổng của totalPriceArray
    const subtotal = totalPriceArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const changeUSD = (subtotal / 23550).toFixed(2);
    setTotal(subtotal);
    setTotalUSD(parseInt(changeUSD));
    setDataLoaded(true); // Đánh dấu là dữ liệu đã được tải xong từ hàm này
  };

  const handleGetListAddress = async () => {
    const list = await ListAddUser();
    const local = getDataLocation();

    if (list.length > 0) {
      const data = list.map((item) => ({
        City: local.filter((city) => city.key === item.City)[0],
        District: local
          .filter((city) => city.key === item.City)[0]
          .districts?.find((dis) => dis.value === item.District),
        Id_Address: item.Id_Address,
        IsDefault: item.IsDefault,
        Line1: item.Line1,
        PhoneNumber: item.PhoneNumber,
        UserName: item.UserName,
        Ward: local
          .filter((city) => city.key === item.City)[0]
          .districts?.filter((dis) => dis.value === item.District)[0]
          .wards?.find((w) => w.value === item.Ward),
      }));



      setListAddress(data);
    }
  };


  const handleSetData = (dataAddress?) => {
    let data = dataAddress
    if (!dataAddress) data = listAddress
    if (data.length > 0) {
      const address = {
        addressUser: `${data[0].Line1} / ${data[0].Ward.label} / ${data[0].District.label} / ${data[0].City.label}`,
        userName: data[0].UserName,
        PhoneNumber: data[0].PhoneNumber,
      };
      setDataAddress(address);
      setDataLoaded(true);
    }

  }



  const fetchData = async () => {
    await handleGetSubTotal();
    await handleGetListAddress();
  };


  useEffect(() => {
    fetchData().then(() => {

      handleSetData(listAddress)
      setIsLoading(false); // Tắt isLoading sau khi cả hai hàm đã hoàn thành
    });


  }, [idAddress]);


  const handleChangeAddess = () => {
    setOpenModal(!openModal)
  }

  const ChangeAddressOption = async (key) => {
    setIdAddress(key)
    const result = await listAddress?.filter((items) => items.Id_Address === key)
    handleSetData(result)
  }
  return (
    <div className={style.mainVieww}>
      <ListAddressToShip isOpen={openModal} handleClose={handleChangeAddess} handleGetKeyAddress={(value) => ChangeAddressOption(value)} onLoading={handleGetListAddress} />
      <div className={style.left}>
        <img src={img} className={style.imageBg} alt="payment" />
      </div>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <div className={style.right}>
          <h5>Thanh Toán đơn hàng</h5>
          <div className={style.contentProduct}>
            <div className={style.table}>
              <Table
                dataSource={userCart}
                pagination={false}
                scroll={{ y: "100%" }}
              >
                <Column
                  title="Image"
                  dataIndex="Image"
                  render={(Image) => (
                    <div>
                      <img
                        src={URL_SERVER_IMG + Image}
                        style={{ width: "70px", height: "70px" }}
                        alt="product"
                      />
                    </div>
                  )}
                />

                <Column title="Tên Sản Phẩm" dataIndex="NameVI" />
                <Column title="Số Lượng" dataIndex="Quantity" />
                <Column
                  title="Số Tiền Thanh Toán"
                  render={(value) => {
                    let price = value.TotalPrice;

                    if (value.Discount > 0) {
                      price =
                        value.TotalPrice -
                        value.TotalPrice * (value.Discount / 100);
                    }

                    return (
                      <div>{price?.toLocaleString().replace(/,/g, ".")}</div>
                    );
                  }}
                />
              </Table>
            </div>
            <div className={style.formtotal}>
              <span>Tổng Tiền Thanh Toán: </span>{" "}
              <span>{total?.toLocaleString().replace(/,/g, ".")} vnđ</span>
            </div>
          </div>

          <div className={style.address}>
            {dataAddress ? (
              <div className={style.formAddress}>
                <div className={style.FormName}>
                  <div>
                    <span>Tên Người Nhận:</span>{" "}
                    <span> {dataAddress.userName} </span>{" "}
                  </div>
                  <div>
                    <span>Số Điện Thoại:</span>{" "}
                    <span>{dataAddress.PhoneNumber}</span>
                  </div>
                </div>

                <span className={style.address}>
                  Địa Chỉ nhận:{dataAddress.addressUser}
                </span>

                <div style={{ marginTop: '20px', cursor: 'pointer' }} onClick={handleChangeAddess} >Chọn địa chỉ khác</div>
              </div>
            ) : (
              <div>Thêm Địa Chỉ Nhận hàng</div>
            )}
          </div>

          {total > 0 ? (
            <div className={style.formPaypal}>
              <Paypal
                amount={totalUSD}
                cart={userCart}
                address={dataAddress}
                totalVND={total}
                idAddress={idAddress}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      )}{" "}
    </div>
  );
}
