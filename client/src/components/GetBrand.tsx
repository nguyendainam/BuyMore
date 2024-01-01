import { GetAllBrands } from "../services/product";

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
