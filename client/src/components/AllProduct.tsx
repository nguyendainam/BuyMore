import {
  getAllProduct,
  getAllProductByTags,
  getAllProductByType,
  getAllProductByTypeByFirst,
  getAllProductToUpdate,
} from "../services/product";

export interface IItemProduct {
  idProduct: string;
  nameVI: string;
  nameEN: string;
  brand: string;
  descVI?: string;
  descEN?: string;

  discount: number;
  image: string;
  productInventory: [];
  priceShow: number;
  productPrice: number;
  saveMoney: number;

  // Options
  brand_id?: string;
  category?: [];
  type_product?: string;
  totalProduct?: number;
  discount_id?: string
}

export const getAllProductByKey = async (key: string) => {
  const allProduct = await getAllProductByType(key);
  const products: IItemProduct[] = allProduct.data.items.map((item) => {
    const productInventory = JSON.parse(item.ProductInventory);
    const price = productInventory[0]
      ? JSON.parse(productInventory[0].Price)
      : null;
    const after = price - (price * item.Discount) / 100;
    const saveMoney = price - after;
    return {
      idProduct: item.Id,
      nameVI: item.NameVI,
      nameEN: item.NameEN,
      brand: item.NameBrand,
      discount: item.Discount,
      image: item.Image,
      productInventory: productInventory,

      priceShow: after,
      productPrice: price,
      saveMoney: saveMoney,
    };
  });
  return products;
};

export const getTopProductTop6 = async (key: string) => {
  const allProduct = await getAllProductByTypeByFirst(key);
  if (allProduct.data.items.length > 0) {
    const products: IItemProduct[] = allProduct.data.items.map((item) => {
      const productInventory = JSON.parse(item.ProductInventory);
      const price = productInventory[0]
        ? JSON.parse(productInventory[0].Price)
        : null;
      const after = price - (price * item.Discount) / 100;
      const saveMoney = price - after;
      return {
        idProduct: item.Id,
        nameVI: item.NameVI,
        nameEN: item.NameEN,
        brand: item.NameBrand,
        discount: item.Discount,
        image: item.Image,
        productInventory: productInventory,
        priceShow: after,
        productPrice: price,
        saveMoney: saveMoney,
      };
    });
    return products;
  } else {
    return [];
  }
};

export const getAllProductByTag = async (key: string) => {
  const allProduct = await getAllProductByTags(key);
  const products: IItemProduct[] = allProduct.data.items.map((item) => {
    const productInventory = JSON.parse(item.ProductInventory);
    const price = productInventory[0]
      ? JSON.parse(productInventory[0].Price)
      : null;
    const after = price - (price * item.Discount) / 100;
    const saveMoney = price - after;
    return {
      idProduct: item.Id,
      nameVI: item.NameVI,
      nameEN: item.NameEN,
      brand: item.NameBrand,
      discount: item.Discount,
      image: item.Image,
      productInventory: productInventory,
      priceShow: after,
      productPrice: price,
      saveMoney: saveMoney,
    };
  });
  return products;
};

export const getAllProductDashboard = async () => {
  const getdata = await getAllProduct();

  const resultData: IItemProduct[] = getdata.data.items.map((i) => {
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
      nameEN: i.NameEN,
      image: i.Image,
      price: price,
      discount: i.Discount,
      priceAfterDiscount: priceAfterDiscount,
      savingPrice: discountAmount,
      category: i.Category_Id.split(","),
      brand_id: i.Brand_Id,
      type_product: i.Type_Product,
      totalProduct: i.TotalQuantity,
    };
  });

  return resultData;
};

export const getAllProductToEdit = async () => {
  const getdata = await getAllProductToUpdate();
  const resultData: IItemProduct[] = getdata.data.items.map((i) => {
    const productEventory = i.ProductInventory;
    const price = JSON.parse(productEventory)[0].Price;
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
      nameEN: i.NameEN,
      image: i.Image,
      price: price,
      discount: i.Discount,
      discount_id: i.Discount_Id,
      priceAfterDiscount: priceAfterDiscount,
      savingPrice: discountAmount,
      category: i.Category_Id.split(","),
      brand_id: i.Brand_Id,
      type_product: i.Type_Product,
      totalProduct: i.TotalQuantity,
      listInventory: JSON.parse(productEventory),
    };
  });

  return resultData;
};
