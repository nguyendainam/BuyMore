import { getAllUser } from "../services/user"



interface IUser {
    idUser: string,
    UserName: string,
    Email: string,
    Gender: string,
    Active: boolean
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