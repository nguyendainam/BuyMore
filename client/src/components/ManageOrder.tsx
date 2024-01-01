import { getListManageOrder } from "../services/user"


interface IItemListOrder {
    orderId: string,
    date: string,
    orderBy: string,
    userName: string,
    quantity: number,
    paid: string,
    status: string,
    totalPrice: number,

}
export const getAllListOrder = async () => {
    const resultdata = await getListManageOrder()
    const items: IItemListOrder[] = resultdata.data.items.map((i) => ({
        orderId: i.Id_Order,
        date: i.CreatedAT,
        orderBy: i.Order_By,
        userName: i.UserName,
        quantity: i.Quantity,
        paid: i.Status,
        status: i.StatusOrder,
        totalPrice: i.TotalPrice,
    }))
    return items
}