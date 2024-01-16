import { getOrderDetails } from "../services/product"
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


interface UserInformation {
    Username: string,
    Email: string,
}


export const detailsOrder = async (key: string) => {
    const result = await getOrderDetails(key)



    const itemIncart = result.data.items[0].CartList
    const dataItems = JSON.parse(itemIncart)
    const address = result.data.items[0].AddressOrder
    const numberPhone = result.data.items[0].PhoneNumber

    const UserInformation: UserInformation = result.data.items.map((item) => ({
        Username: item.UserName,
        Email: item.Email
    }))

    const quantity = dataItems.map((i) => { return i.Quantity })
    const tong = quantity.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const schedule = result.data.items[0].CreatedAT

    let discount = 0
    let totalAllProduct = 0
    dataItems.map((item) => {
        const count = item.Quantity * item.Price
        if (item.Discount_Percent > 0) {
            discount += count * item.Discount_Percent / 100
            totalAllProduct += count
        }
    })

    const status = result.data.items[0].Status
    const StatusOrder = result.data.items[0].StatusOrder
    const TotalPrice = totalAllProduct - discount

    const inforTitle = {
        tong,
        schedule,
        TotalPrice,
        discount,
        totalAllProduct,
        status,
        StatusOrder
    }

    return {
        address: {
            address,
            numberPhone
        },
        dataItems,
        UserInformation,
        inforTitle

    }

}

export const handleGetSelectOrder = async () => {
    try {
        const resultdata = await getListManageOrder();

        const options = resultdata.data.items
            .map((item) => ({
                value: item.Id_Order,
                label: item.Id_Order.slice(0, 5)
            }));

        return options;
    } catch (error) {
        console.error("Error in handleGetSelectOrder:", error);
        return [];
    }
};


