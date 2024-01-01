import { getTopProductRating } from "../services/product";

interface ITopRating {
  IdProduct: string;
  NameEN: string;
  NameVI: string;
  Image: string;
  AverageRating: string;
}

export const getTopRattingProduct = async () => {
  const result = await getTopProductRating();
  const dataMap: ITopRating[] = result.data.items.map((item) => ({
    IdProduct: item.Id_Product,
    Image: item.Image,
    NameEN: item.NameEN,
    NameVI: item.NameVI,
    AverageRating: item.AverageRating,
  }));

  return dataMap;
};
