import React, { useEffect, useState } from "react";
import style from "./brand.module.scss";
import { GetAllListsBrand } from "../../../../components/GetBrand";
import { URL_SERVER_IMG } from "../../../../until/enum";
import { useNavigate } from "react-router-dom";

export default function BrandProduct() {
  const [listBrand, setListBrand] = useState([]);

  const handleGetBrand = async () => {
    const data = await GetAllListsBrand();
    if (data.length > 6) {
      setListBrand(data.slice(0, 6));
    } else {
      setListBrand(data);
    }
  };
  useEffect(() => {
    handleGetBrand();
  }, []);

  const navigate = useNavigate()
  const handleonChange = (key) => {
    navigate(`/brand/${key}`)
  }

  return (
    <div className={style.mainView}>
      <div className={style.formContent}>
        {listBrand.length &&
          listBrand.map((item) => {
            return (
              <div className={style.itembrand} onClick={() => handleonChange(item.idBrand)}>
                <div className={style.image}>
                  <img src={URL_SERVER_IMG + item.imageBrand} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
