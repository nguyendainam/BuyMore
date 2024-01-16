import React from "react";
import Header from "../container/Clients/Header/Header";
import style from "../assets/style/home.module.scss";
import { Route, Routes } from "react-router-dom";
import DetailProduct from "../container/Clients/Product/Details/DetailProduct";
import AllProduct from "../container/Clients/Product/Allproduct/AllProduct";
import AllProductByTag from "../container/Clients/Product/Allproduct/AllProductByTag";
import ProductByBrands from "../container/Clients/Brand/ProductByBrands";
import Fotter from "../container/Clients/Footer/Fotter";
export default function HomeRouter() {
  return (
    <div className={style.mainView}>
      <Header />

      <div className={style.contentpage}>
        <Routes>
          <Route path="d/:nameproduct" element={<DetailProduct />} />
          {/* <Route path="/all-product" element={<AllProduct />} /> */}
          <Route path="p/:namepath" element={<AllProduct />} />
          <Route path="t/:nametag" element={<AllProductByTag />} />
          <Route path="brand/:idbrand" element={<ProductByBrands />} />
        </Routes>

      </div>
      <Fotter />
    </div>
  );
}
