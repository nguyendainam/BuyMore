import axios from "../until/axios";


export const changePassword = (data: FormData) => {
    return axios.post('/api/user/reset-password', data)
}

export const loginUser = (data: FormData) => {
    return axios.post('/login', data)
}

export const registerUser = (data: FormData) => {
    return axios.post('/registerUser', data)
}

export const comfirmEmail = (key: string) => {
    return axios.get(`/comfirmEmail?key=${key}`)
}

// export const loginOut = (data: FormData) => {
//     return axios.post('/login', data)
// }

export const apiGetCurrent = () => {
    return axios.get('/currentUser')
}

export const resetNewAccessToken = () => {
    return axios.post('/refreshToken')
}

export const addToCart = (data: FormData) => {
    return axios.post('/addToCart', data)
}

export const getItemsInCart = () => {
    return axios.get('/getAllItemInCart')
}

export const updateItemInCart = (key: string) => {
    return axios.get(`/getUpdateItemCart?key=${key}`)
}


export const addNewAddress = (data: FormData) => {
    return axios.post('/api/createAddress', data)
}

export const getListAddress = () => {
    return axios.get('/api/getUserAddress')
}

export const getListOderUser = () => {
    return axios.get('/getOrderByUser')
}

export const createNewOrderByUser = (data: FormData) => {
    return axios.post('/order/createNewOrder', data)
}


export const getAllUser = () => {
    return axios.get('/system/getUsers')
}

export const getListManageOrder = () => {
    return axios.get('/system/getAllListOrder')
}

export const getOnchageOrder = (data: FormData) => {
    return axios.post(`/system/changeStatusItem`, data)
}

export const ratingProduct = (data: FormData) => {
    return axios.post(`/api/ratingProduct`, data)
}

export const handleGetProductReccommend = () => {
    return axios.get(`/api/reccommendProduct`)
}

export const handleGetProductReccommendAfterLogin = () => {
    return axios.get(`/system/createDataTrainingAfterLogin`)
}


export const handleTotalUserWelcome = () => {
    return axios.get(`system/getTotalUserActive`)
}


export const refreshAccessToken = () => {
    return axios.post('/refreshToken', {
        withCredentials: true
    })
}

export const getInformationUser = (idUser: string) => {
    return axios.get(`/system/getInforUserById?idUser=${idUser}`)
}

export const getProductByRatingUser = () => {
    return axios.get('system/getProductByRating')
}