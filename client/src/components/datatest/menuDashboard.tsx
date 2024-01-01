import {} from "react-icons/fa6";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CiDiscount1 } from "react-icons/ci";
import { FaPaintbrush } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";
interface IMenuDashboard {
  key: string;
  label: string;
  icon: React.ReactElement;
  children: {
    key: string;
    label: string;
  }[];
}

export const menuDashboard: IMenuDashboard[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <HomeOutlined />,

    children: [
      {
        key: "/",
        label: "Dashboard",
      },
    ],
  },
  {
    key: "product",
    label: "Product",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "product",
        label: "List product",
      },
      // {
      //   key: "product/add",
      //   label: "Add Product",
      // },
      {
        key: "createProduct",
        label: "Create Product",
      },

      {
        key: "createDetails",
        label: "Create Description",
      },

      {
        key: "editProduct",
        label: "Edit Product",
      },
    ],
  },
  {
    key: "category",
    label: "Category",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "category",
        label: "Categories",
      },
      {
        key: "listCategory",
        label: "List Categories",
      },

      {
        key: "itemCategory",
        label: "Item Category",
      },
      {
        key: "productType",
        label: "Product Type",
      },
    ],
  },
  {
    key: "brand",
    label: "Brand",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "brand",
        label: "Brands",
      },
      {
        key: "listbrand",
        label: "List Brands",
      },
    ],
  },

  {
    key: "discount",
    label: "Discount",
    icon: <CiDiscount1 />,
    children: [
      {
        key: "discount",
        label: "Discout",
      },
    ],
  },
  {
    key: "user",
    label: "Customers",
    icon: <UserOutlined />,
    children: [
      {
        key: "listUser",
        label: "Customers List",
      },
      {
        key: "user",
        label: "Customers",
      },
    ],
  },
  {
    key: "order",
    label: "Oders",
    icon: <AiOutlineShoppingCart />,
    children: [
      {
        key: "listOrder",
        label: "Orders",
      },
    ],
  },
  {
    key: "ui",
    label: "Manage UI",
    icon: <FaPaintbrush />,
    children: [
      {
        key: "manage-carousel",
        label: "Carousel Image",
      },
    ],
  },
];

export default menuDashboard;
