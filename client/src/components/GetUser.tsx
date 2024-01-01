import {
  getListAddress,
  getListOderUser,
  handleTotalUserWelcome,
} from "../services/user";

export const ListAddUser = async () => {
  const data = await getListAddress();
  return data.data.items;
};

export const ListOrder = async () => {
  const data = await getListOderUser();
  return data.data.items;
};

interface IITotalWelcome {
  activeUsers: number;
  totalUsers: number;
  totalPrice: number;
  TotalOrders: number;
}

export const TotalUsersWelcome = async () => {
  const result = await handleTotalUserWelcome();

  console.log(result.data);

  const data = {
    activeUsers: result.data.activeUsers,
    totalUsers: result.data.totalUsers,
    totalPrice: result.data.totalPrice,
    TotalOrders: result.data.TotalOrders,
  };

  return data;
};
