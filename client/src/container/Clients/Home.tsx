import React, { useEffect } from "react";
import Header from "./Header/Header";
import style from "./Home.module.scss";
import MainSlide from "./Slide/mainSlide";
import TabsProducts from "./Product/Tabs/Tabs";
import { OutStanding } from "./Product/OutStanding/main";
import Fotter from "./Footer/Fotter";
import Featured from "./Product/Featured/mainFeatured";
import ReccomendProduct from "./Product/Recommend/RecommendForYou";
import BrandProduct from "./Product/BrandProduct/BrandProduct";
import { ViewedProduct } from "./Product/ViewdProduct/ViewedProduct";
import { GetProductByRating } from "./Product/RecommendByRating/RecommendByRating";
import { useSelector } from "react-redux";
export default function Home() {
  const { isLogin } = useSelector((state) => state.user);
  return (
    <div className={style.mainHome}>
      <Header />

      <div className={style.mainView}>
        <MainSlide />
        {/* <TabsProducts /> */}
        <OutStanding />
        <Featured />
        <BrandProduct />
        <ReccomendProduct />
        {isLogin && <GetProductByRating />}
        <ViewedProduct />

        <Fotter />
      </div>
    </div>
  );
}
