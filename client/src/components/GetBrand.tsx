import { GetAllBrands, getProductByBrand } from "../services/product";

interface IListBrand {
  idBrand: string;
  nameBrand: string;
  imageBrand: string;
  descVI: string;
  descEN: string;
}

export const GetAllListsBrand = async () => {
  const listItem = await GetAllBrands();

  const ListBrand: IListBrand[] = listItem.data.item.map((i) => ({
    idBrand: i.IdBrand,
    nameBrand: i.NameBrand,
    imageBrand: i.ImageBrand,
    descVI: i.DescVI,
    descEN: i.DescEN,
  }));

  return ListBrand;
};


interface InforBrand {
  DescEN: string
  DescVI: string
  NameBrand: string
  ImageBrand: string
}

export interface IProductHomePage {
  productId: string;
  brand?: string;
  nameVI: string;
  nameEN: string;
  image: string;
  price: number; // get price Product
  discount?: number; // discount product
  priceAfterDiscount: number; // after discout
  savingPrice: number; // price after using discount
}


export const getAllAboutBrand = async (key: string) => {
  const listData = await getProductByBrand(key)
  const aboutBrand: InforBrand = listData.data.map((item) => (
    {
      DescEN: item.DescEN,
      DescVI: item.DescVI,
      NameBrand: item.NameBrand,
      ImageBrand: item.ImageBrand
    }
  ))



  let itemProduct: IProductHomePage[];
  if (listData.data[0]?.Product) {
    const allproducts = JSON.parse(listData.data[0]?.Product)

    itemProduct = allproducts?.map((i) => {

      const Price = i.ProductInventory[0].Price


      let priceAfterDiscount = Price
      let saving = 0
      if (i.Discount_Percent > 0) {
        priceAfterDiscount = Price - (Price * i.Discount_Percent) / 100
        saving = parseInt((Price * i.Discount_Percent) / 100).toFixed(0)
      }


      return ({
        productId: i.Id,
        nameVI: i.NameVI,
        nameEN: i.NameEN,
        image: i.Image,
        price: Price,
        discount: i.Discount_Percent,
        priceAfterDiscount: priceAfterDiscount,
        savingPrice: saving
      })
    });
  } else {
    itemProduct = []
  }



  console.log(itemProduct)



  return {
    aboutBrand: aboutBrand[0],
    product: itemProduct
  }
}



