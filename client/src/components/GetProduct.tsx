import { getAllProduct, getProductById } from "../services/product";
import {
  handleGetProductReccommend,
  handleGetProductReccommendAfterLogin,
} from "../services/user";

export interface IProductHomePage {
  productId: string;
  brand: string;
  nameVI: string;
  nameEn: string;
  image: string;
  price: number; // get price Product
  discount?: number; // discount product
  priceAfterDiscount: number; // after discout
  savingPrice: number; // price after using discount
}

export const getAllProductHomePage = async () => {
  const getdata = await getAllProduct();
  const resultData: IProductHomePage[] = getdata.data.items.map((i) => {
    const priceInven = i.ProductInventory;
    const price = JSON.parse(priceInven)[0].Price;
    const discount = i.Discount;
    let discountAmount = 0;
    let priceAfterDiscount = 0;
    if (i.Discount === 0) {
      discountAmount = 0;
      priceAfterDiscount = price;
    } else {
      discountAmount = (price * discount) / 100;
      priceAfterDiscount = price - discountAmount;
    }

    return {
      productId: i.ProductId,
      brand: i.NameBrand,
      nameVI: i.NameVI,
      nameEn: i.NameEN,
      image: i.Image,
      price: price,
      discount: i.Discount,
      priceAfterDiscount: priceAfterDiscount,
      savingPrice: discountAmount,
    };
  });

  return resultData;
};

export const inforProductById = async (idProd: string) => {
  const data = await getProductById(idProd);

  // console.log("Get product by Id", data.data.items)

  const resultdata = data.data.items[0];
  // const Image = resultdata.ListItems
  return resultdata;
};

export interface IProductHomePage {
  productId: string;
  brand: string;
  nameVI: string;
  nameEn: string;
  image: string;
  price: number; // get price Product
  discount?: number; // discount product
  priceAfterDiscount: number; // after discout
  savingPrice: number; // price after using discount
}

export const getProductReccommend = async () => {
  const result = await handleGetProductReccommend();
  const resultData: IProductHomePage[] = result.data.items.map((i) => {
    const priceInven = i.ProductInventory;
    const price = JSON.parse(priceInven)[0].Price;
    const discount = i.Discount;
    let discountAmount = 0;
    let priceAfterDiscount = 0;
    if (i.Discount === 0) {
      discountAmount = 0;
      priceAfterDiscount = price;
    } else {
      discountAmount = (price * discount) / 100;
      priceAfterDiscount = price - discountAmount;
    }

    return {
      productId: i.Id,
      brand: i.NameBrand,
      nameVI: i.NameVI,
      nameEn: i.NameEN,
      image: i.Image,
      price: price,
      discount: i.Discount,
      priceAfterDiscount: priceAfterDiscount,
      savingPrice: discountAmount,
    };
  });

  return resultData;
};

export const getProductLoginUser = async () => {
  const result = await handleGetProductReccommendAfterLogin();

  const resultData: IProductHomePage[] = result.data.items.map((i) => {
    const priceInven = i.ProductInventory;
    const price = JSON.parse(priceInven)[0].Price;
    const discount = i.Discount;
    let discountAmount = 0;
    let priceAfterDiscount = 0;
    if (i.Discount === 0) {
      discountAmount = 0;
      priceAfterDiscount = price;
    } else {
      discountAmount = (price * discount) / 100;
      priceAfterDiscount = price - discountAmount;
    }

    return {
      productId: i.Id,
      brand: i.NameBrand,
      nameVI: i.NameVI,
      nameEn: i.NameEN,
      image: i.Image,
      price: price,
      discount: i.Discount,
      priceAfterDiscount: priceAfterDiscount,
      savingPrice: discountAmount,
    };
  });

  return resultData;
};
