import React, { useEffect, useState } from "react";
import style from "./DetailsOrder.module.scss";
import { detailsOrder } from "../../../components/ManageOrder";
import { URL_SERVER_IMG } from "../../../until/enum";
import moment from "moment";
export default function DetailsOrder() {
  const [dataAddress, setDataAddress] = useState({});
  const [dataUser, setDataUser] = useState({});
  const [dataItems, setDataItems] = useState([]);
  const [aboutOder, setAboutOder] = useState({});

  const handleGetData = async (key: string) => {
    const resultdata = await detailsOrder(key);
    if (resultdata) {
      setDataAddress(resultdata.address);
      setDataUser(resultdata?.UserInformation[0]);
      setDataItems(resultdata?.dataItems);
      setAboutOder(resultdata?.inforTitle);
    }
  };

  useEffect(() => {
    handleGetData("MNIMzz7EPV1703349008328");
  }, []);

  return (
    <div className={style.mainView}>
      <div className={style.content}>
        <div className={style.aboutOrder}>
          <div className={style.itemTitle}>
            {moment(aboutOder.schedule).format("MMMM DD,YYYY: HH:MM")}
          </div>
          <div className={style.itemTitle}> {aboutOder.tong} items </div>
          <div className={style.itemTitle}>
            Total: {aboutOder.TotalPrice?.toLocaleString().replace(/,/g, ".")}{" "}
            .vnđ
          </div>
          <div className={style.itemTitle}>
            {" "}
            <div className={style.item}>{aboutOder.status}</div>{" "}
            <div className={style.item}>{aboutOder.StatusOrder}</div>
          </div>
        </div>

        <div className={style.information}>
          <div className={style.left}>
            <div className={style.items}>
              <div className={style.title}>Items</div>
              {dataItems &&
                dataItems.length &&
                dataItems.map((item) => {
                  const count = item.Quantity * item.Price;
                  let discount = 0;
                  if (item.Discount_Percent > 0) {
                    discount = (count * item.Discount_Percent) / 100;
                  }

                  return (
                    <div className={style.item}>
                      <div className={style.image}>
                        {item.ListImage &&
                          item.ListImage.length &&
                          item.ListImage.map((i) => {
                            return (
                              <div className={style.img}>
                                <img src={URL_SERVER_IMG + i.Image} />
                              </div>
                            );
                          })}
                      </div>
                      <div className={style.nameProduct}> {item.NameEN} </div>
                      <div className={style.quantity}>
                        {" "}
                        {item.Quantity} item{" "}
                      </div>
                      <div className={style.discount}>
                        {" "}
                        {item.Price?.toLocaleString().replace(/,/g, ".")}.vnđ
                      </div>
                      <div className={style.discount}>
                        {" "}
                        {count?.toLocaleString().replace(/,/g, ".")} .vnđ{" "}
                      </div>
                      {discount > 0 && (
                        <div className={style.afterdiscount}>
                          <div className={style.formDiscount}>
                            {item.Discount_Percent} %{" "}
                          </div>
                          <div className={style.price}>
                            {" "}
                            - {discount?.toLocaleString()}{" "}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              <div className={style.formTotal}>
                <div className={style.itemTotal}>
                  <div>Total All Product</div>
                  <div>
                    {aboutOder.totalAllProduct
                      ?.toLocaleString()
                      .replace(/,/g, ".")}{" "}
                    .vnđ
                  </div>
                </div>
                <div className={style.itemTotal}>
                  <div>Discount</div>
                  <div>
                    {aboutOder.discount?.toLocaleString().replace(/,/g, ".")}{" "}
                    .vnđ
                  </div>
                </div>
                <div className={style.itemTotal}>
                  <div>Total</div>
                  <div>
                    {aboutOder.TotalPrice?.toLocaleString().replace(/,/g, ".")}{" "}
                    .vnđ
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.right}>
            <div className={style.inforUser}>
              <div className={style.title}>Customer</div>
              <div className={style.aboutCustomer}>
                <div className={style.avatar}></div>
                <div className={style.usename}>{dataUser?.Username}</div>
              </div>
            </div>

            <div className={style.inforUser}>
              {" "}
              <div className={style.title}>Contact Person</div>
              <div className={style.contentContact}>
                <div>User Name:{dataUser?.Username}</div>
                <div>Email: {dataUser?.Email}</div>
                <div>PhoneNumber: {dataAddress?.numberPhone}</div>
              </div>
            </div>
            <div className={style.inforUser}>
              {" "}
              <div className={style.title}>Address</div>
              <div className={style.content}>{dataAddress.address}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
