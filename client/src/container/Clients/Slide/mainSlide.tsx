import React, { useEffect, useState } from "react";
import style from "./mainSlide.module.scss";
import { Carousel } from "antd";
import {
  AllProductType,
  ITypeProduct,
} from "../../../components/GetdataCategory";
// import useSelection from "antd/es/table/hooks/useSelection";
import { useSelector } from "react-redux";
import { URL_SERVER_IMG } from "../../../until/enum";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

export default function mainSlide() {
  const [dataTypeProduct, setDataTypeProduct] = useState<ITypeProduct[]>([]);
  const navigate = useNavigate()
  const selector = useSelector((state) => state.system);

  const handleGetTypeProduct = async () => {
    const data = await AllProductType();
    setDataTypeProduct(data);
  };


  const handleNavigate = (key: string, id: string) => {
    const inputKey = key.toLowerCase().replace(/\s+/g, '-')
    const converString = _.kebabCase(key)
    navigate(`/p/${converString}?t=${id}`)
  }

  useEffect(() => {
    handleGetTypeProduct();
  }, []);

  return (
    <>
      <div className={style.mainSlide}>
        <div className={style.itemSlide1}>
          <Carousel autoplay >

            <img src="https://i.pcmag.com/imagery/lineupitems/00pgtwjRZ8voRvBTHj8dVdS.fit_lim.size_1050x578.v1579197807.jpg" />
            <img src="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/05/macbook-doi-moi-nhat-cover-.jpg" />
            <img src="https://assets-global.website-files.com/605826c62e8de87de744596e/62b5a9572dab880f81c5d178_ajVzMkY7zNN-cU8hLJlTXR93WXkC09AI_0Dm-VBCfWe-kbHdRAAATBpSlNajuRsW7e0jHYCOVjdcHY1Sf-3X4tAI22KAFbbu31rgYGEmgCSV_WUrLFWhWl09ddXm7EhIITjKG0OggdxALfJeGQ.jpeg" />
            <img src="https://9to5mac.com/wp-content/uploads/sites/6/2017/07/screen-shot-2017-07-12-at-14-50-32.jpg?quality=82&strip=all" />
            <img src="https://pyxis.nymag.com/v1/imgs/4f9/ee6/e29ad8630fd55f4ae0a130185ca1d94f78-tech-gifts-lede.2x.rsocial.w600.jpg" />

          </Carousel>
        </div>
        <div className={style.itemSlide2}>
          <img src="https://img.lovepik.com/desgin_photo/45016/3904_detail.jpg!detail808" />
        </div >
      </div >
      <div className={style.Featured_categories}>
        {dataTypeProduct.length &&
          dataTypeProduct.map((item: ITypeProduct) => (
            <div className={style.itemCat} key={item.Id} onClick={() => handleNavigate(item.nameVI, item.Id)}>
              <div className={style.image}>
                <img
                  src={URL_SERVER_IMG + item.Image}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className={style.title}>
                {selector.language === "vi" ? item.nameVI : item.nameEN}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
