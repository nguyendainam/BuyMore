import axios from '../until/axios.ts'
/*
 *
 *
 *
 *
 */
// CATEGORY
export const CorUCategories = async (data: FormData) => {
  return await axios.post('/system/CandUCategory', data)
}
export const getAllCategory = async () => {
  return await axios.get('/system/getAllCategory')
}

export const CorUListCategory = async (data: FormData) => {
  return await axios.post('/system/CandUListCategory', data)
}

export const getAllListCategory = async () => {
  return await axios.get('/system/getAllListCategory')
}

export const getListCatHomePage = async () => {
  return await axios.get('/system/getCategoryHomeClient')
}

export const CorUItemCategory = async (data: FormData) => {
  return await axios.post('/system/CandUItemsCategory', data)
}

export const getItemCatById = async (key?: string) => {
  return await axios.get(`/system/getAllItemCategorybyId?key=${key}`)
}

export const createOrUpdatePrType = async (data: FormData) => {
  return await axios.post('/system/creOrUpdProductType', data)
}

export const getAllProductType = async () => {
  return await axios.get('/system/getAllProductType')
}

// PRODUCT
export const CreateProduct = async (data: FormData) => {
  return await axios.post(`/system/createProduct`, data)
}


export const getAllProduct = async () => {
  return await axios.get(`/system/getAllProduct`)
}

export const getProductById = async (id: string) => {
  return await axios.get(`/system/getProductbyId?idProduct=${id}`)
}

export const getAllProductByType = async (key: string) => {
  return axios.get(`/system/getProductbyType?key=${key}`)
}


export const getAllProductByTags = async (key: string) => {
  return axios.get(`/system/getProductByTags?key=${key}`)
}

export const getAllProductByTypeByFirst = async (key: string) => {
  return axios.get(`/system/getProductbyTypeNew?key=${key}`)
}
//

export const handleSearchProduct = async (key: string) => {
  return axios.get(`/system/handleSearchProduct?key=${key}`)
}

export const handleCreateDescProduct = async (data: FormData) => {
  return axios.post('/system/createDescription', data)
}

export const handleGetDescProduct = async (key: string) => {
  return axios.get(`/system/getDescription?key=${key}`)
}

export const handleGetRatingProduct = async (key: string) => {
  return axios.get(`/system/getRatingProduct?key=${key}`)
}

export const getTopProductRating = async () => {
  return axios.get(`/system/getAllRatingProduct`)
}


// BRANDS

export const CreateorUpdateBrand = async (data: FormData) => {
  return await axios.post('/system/createOrupdateBrand', data)
}

export const GetAllBrands = async () => {
  return await axios.get('/system/getAllBrand')
}


export const getProductByBrand = async (key: string) => {
  return await axios.get(`/system/getAllInforBrands?key=${key}`)
}

//  DISCOUNT
export const getAllDiscount = async () => {
  return await axios.get('/system/getAllDiscount')
}

export const createOrUpdateDiscount = async (data: FormData) => {
  return await axios.post('/system/createOrUpdateDiscount', data)
}

// ui

export const createNewSlide = async (data: FormData) => {
  return await axios.post('/system/ui/createCarousel', data)
}

export const getImageCarousel = async (key: string) => {
  return await axios.get(`/system/ui/getImgCarousel?key=${key}`)
}


export const getAllProductToUpdate = async () => {
  return await axios.get(`/system/getAllProductDashboad`)
}


export const uploadImageSingleToServer = async (data: FormData) => {
  return await axios.post(`/system/uploadImage`, data)
}

export const deleteImage = async (data: FormData) => {
  return await axios.post('/system/deleteImage', data)
}

export const addOptionProductEdit = async (key: string) => {
  return await axios.get(`/system/createProductIvenEdit?key=${key}`)
}


export const deleteOptionProductEdit = async (key: string) => {
  return await axios.get(`/system/deleteProductIvenEdit?key=${key}`)
}

export const updateProduct = async (data: FormData) => {
  return await axios.post(`/system/updateProduct`, data)
}

export const getOrderDetails = async (key: string) => {
  return await axios.get(`/system/getInforAboutOrder?key=${key}`)
}

export const getDescProductById = async (key: string) => {
  return await axios.get(`/system/getDescProductById?key=${key}`)
}

export const getConfigProductById = async (key: string) => {
  return await axios.get(`/system/getConfigProductById?key=${key}`)
}



export const getAllDescProductById = async (key: string) => {
  return await axios.get(`/system/getAllDescProductById?key=${key}`)
}