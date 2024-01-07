import { getAllUser, getInformationUser } from "../services/user"
import { getDataLocation } from "./Location"



interface IUser {
    idUser: string,
    UserName: string,
    Email: string,
    Gender: string,
    Active: boolean,
    CreatedAt?: string
}

export const getAllUserComponent = async () => {
    const getListUser = await getAllUser()


    const data: IUser[] = getListUser.data.items.map((item) => ({
        idUser: item.UserID,
        UserName: item.UserName,
        Email: item.Email,
        Gender: item.Gender,
        Active: item.IsActive
    }))
    return data
}

export const getAllUserSelect = async () => {
    const getListUser = await getAllUser()

    // console.log("xxxxxxxxxxxx", getListUser.data.items)
    const data: IUser[] = getListUser.data.items.map((item) => ({
        idUser: item.UserID,
        UserName: item.UserName,
        Email: item.Email,
        Gender: item.Gender,
        Active: item.IsActive,
        CreatedAt: item.CreatedAt
    }))
    return data
}


export const getInforUserById = async (id: string) => {
    const result = await getInformationUser(id)

    const listAddress = result.data.addressUser
    const listOrder = result.data.orderUser



    let dataAddress = []
    if (listAddress.length > 0) {
        const local = await getDataLocation()
        const getData = listAddress.map(item => ({
            City: local.filter(city => city.key === item.City)[0],
            District: local.filter(city => city.key === item.City)[0].districts?.find((dis) => dis.value === item.District),
            Id_Address: item.Id_Address,
            IsDefault: item.IsDefault,
            Line1: item.Line1,
            PhoneNumber: item.PhoneNumber,
            UserName: item.UserName,
            Ward: local.filter(city => city.key === item.City)[0].districts?.filter((dis) => dis.value === item.District)[0].wards?.find((w) => w.value === item.Ward),
        }))

        dataAddress.push(getData)
    }

    const dataOrder = []

    if (listOrder.length > 0) {
        const arrPrice = listOrder.map((item) => {
            return item.TotalPrice;
        });
        const total = arrPrice.reduce((acc, value) => acc + value, 0);
        const numberOfOrders = arrPrice.length;
        const aov = numberOfOrders > 0 ? total / numberOfOrders : 0;

        dataOrder.push({
            aov,
            listOrder
        })
    }
    return {
        dataOrder,
        dataAddress
    }




}