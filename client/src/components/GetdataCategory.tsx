import FormData from "form-data";
import {
  getAllCategory,
  getAllListCategory,
  getItemCatById,
  getAllProductType,
  getListCatHomePage,
} from "../services/product";

interface ListCategoryDropdown {
  key: string | number;
  title: [object, object];
  image?: string;
}

const language: string = "en";

export const getListCategory = async () => {
  const response = await getAllCategory();
  const dataCategory: [ListCategoryDropdown] = response.data.items.map(
    (item) => ({
      key: item.Id,
      titleVi: item.NameVI,
      titleEN: item.NameEN,
      image: item.ImageCat,
    })
  );

  return dataCategory;
};

interface IdataListCategory {
  idListCat: string;
  nameENCategory: string;
  nameVICategory: string;
  nameEN: string;
  nameVI: string;
  IdCat: string;
}

export const AllListCategory = async () => {
  const response = await getAllListCategory(); // Assuming getAllListCategory is a function
  const resolveData: IdataListCategory[] = response.data.items.map((item) => ({
    idListCat: item.idListCat,
    nameENCategory: item.NameVICategory,
    nameVICategory: item.NameENCategory,
    nameEN: item.nameEN,
    nameVI: item.nameVI,
    IdCat: item.IdCat,
  }));

  return resolveData;
};

interface IItemCat {
  IdItemCat: string;
  nameVI: string;
  nameEN: string;
  IdListCat: string;
  ListNameEN: string;
  ListNameVI: string;
  CatNameEN: string;
  CatNameVI: string;
  IdCat: number;
}

export const getAllCategorybyItem = async (key?: string) => {
  let keyId = "ALL";
  if (key) {
    keyId = key;
  }
  const reponse = await getItemCatById(keyId);
  const resultData: IItemCat = reponse.data.items.map((i) => ({
    IdItemCat: i.IdItemCat,
    nameVI: i.nameVI,
    nameEN: i.nameEN,
    IdListCat: i.IdListCat,
    ListNameEN: i.ListNameEN,
    ListNameVI: i.ListNameVI,
    CatNameEN: i.CatNameEN,
    CatNameVI: i.CatNameVI,
    IdCat: i.IdCat,
  }));
  return resultData;
};

export interface ITypeProduct {
  Id: string;
  nameVI: string;
  nameEN: string;
  Image?: string;
  isShow: boolean;
}

export const AllProductType = async () => {
  const getdata = await getAllProductType();
  const resultData: ITypeProduct[] = getdata.data.items.map((i) => ({
    Id: i.Id,
    nameVI: i.NameVI,
    nameEN: i.NameEN,
    Image: i.Image,
    isShow: i.IsShow,
  }));

  return resultData;
};

interface IItem {
  keyItem: string;
  name: string;
}

interface IListItem {
  key: string;
  name: string;
  listItem?: IItem[];
}

interface IListCategory {
  title: string;
  key: string;
  image: string;
  list: IListItem[];
}

// Promise<IListCategory[]>
export const ListItemCategoryHome = async (): Promise<IListCategory[]> => {
  const data = await getAllCategorybyItem();
  // console.log(data)
  const listCate = await getListCategory();
  const groupedData: { [key: string]: IListCategory } = {};
  Object.values(listCate).forEach((item) => {
    const keyCat = item.key;
    if (keyCat in groupedData) {
      const existingCat = groupedData[keyCat];
    } else {
      groupedData[keyCat] = {
        title: item.titleVi,
        key: item.key,
        image: item.image,
        list: [],
      };
    }
  });

  Object.values(data).forEach((item) => {
    const keyCat = item.IdCat;
    const keyList = item.IdListCat;
    const keyItem = item.IdItemCat;

    if (keyCat in groupedData) {
      const existingCat = groupedData[keyCat];
      const existingList = existingCat.list.find(
        (list) => list.key === keyList
      );

      if (existingList) {
        const existingItem = existingList.listItem?.find(
          (i) => i.keyItem === keyItem
        );

        if (existingItem) {
          // Item already exists, you can handle this case if needed
        } else {
          // Add the item to an existing list
          existingList.listItem.push({
            keyItem: keyItem,
            name: item.nameVI,
          });
        }
      } else {
        // Create a new list
        existingCat.list.push({
          key: keyList,
          name: item.ListNameVI,
          listItem: [
            {
              keyItem: keyItem,
              name: item.nameVI,
            },
          ],
        });
      }
    } else {
      // Create a new category
      groupedData[keyCat] = {
        title: item.CatNameVI,
        key: keyCat,
        image: item.imageCat,
        list: [
          {
            key: keyList,
            name: item.ListNameVI,
            listItem: [
              {
                keyItem: keyItem,
                name: item.nameVI,
              },
            ],
          },
        ],
      };
    }
  });
  const resultMenu: IListCategory[] = Object.values(groupedData);
  return resultMenu;
};
