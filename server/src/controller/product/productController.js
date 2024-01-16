import productServices from "../../services/product/productServices.js"

const createProduct = async (req, res) => {
    try {
        let result = await productServices.createProduct(req.body)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const getAllProduct = async (req, res) => {
    try {
        let result = await productServices.getAllProductServices()
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const getAllProductDashboard = async (req, res) => {
    try {
        let result = await productServices.getAllProductServicesEdit()
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}


const getProductById = async (req, res) => {
    try {
        let result = await productServices.getProductByIdServices(req.query.idProduct)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(400).json(e)
    }
}

const getProductByTag = async (req, res) => {
    try {
        let result = await productServices.getAllProductServicesByTags(req.query.key)
        return res.status(200).json(result)

    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const getProductbyTypeProduct = async (req, res) => {
    try {
        let result = await productServices.getAllProductByType_Product(req.query.key)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const getProductbyTypeProductNew = async (req, res) => {
    try {
        let result = await productServices.getAllProductByType_ProductNew(req.query.key)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const handleOnSearch = async (req, res) => {
    try {
        let result = await productServices.handleOnSearchProduct(req.query.key)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const createDescriptionPR = async (req, res) => {
    try {
        const result = await productServices.createDescProduct(req.body)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(400).json(e)
    }
}

const getDescriptionPR = async (req, res) => {
    try {
        const result = await productServices.getDescProduct(req.query.key)
        return res.status(200).json(result)

    } catch (e) {
        return res.status(400).json(e)
    }
}

const getRatingProduct = async (req, res) => {
    try {
        const result = await productServices.getProductRatingServices(req.query.key)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(400).json(e)
    }
}

const getRatingAllProduct = async (req, res) => {
    try {
        const result = await productServices.getRankRatingProduct()
        return res.status(200).json(result)
    } catch (e) {
        return res.status(400).json(e)
    }
}

const createProductIvenEdit = async (req, res) => {
    try {
        const result = await productServices.createNewOptionInEdit(req.query.key)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const deleteProductIvenEdit = async (req, res) => {
    try {
        const result = await productServices.deleteOptionInEdit(req.query.key)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}


const updateProduct = async (req, res) => {
    try {
        const result = await productServices.editProduct(req.body)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(400).json(e)
    }
}

const getAllDescProductById = async (req, res) => {
    try {
        const result = await productServices.getAllDescProductById(req.query.key)
        return res.status(200).json(result)

    } catch (e) {
        return res.status(400).json(e)
    }
}

const getDescProductById = async (req, res) => {
    try {
        const result = await productServices.getDescProductById(req.query.key)
        return res.status(200).json(result)

    } catch (e) {
        return res.status(400).json(e)
    }
}

const getConfigProductById = async (req, res) => {
    try {
        const result = await productServices.getCongfigProductById(req.query.key)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(400).json(e)
    }
}

export default {
    createProduct,
    getAllProduct,
    getProductById,
    getProductByTag,
    getProductbyTypeProduct,
    getProductbyTypeProductNew,
    handleOnSearch,
    createDescriptionPR,
    getDescriptionPR,
    getRatingProduct,
    getRatingAllProduct,
    getAllProductDashboard,
    createProductIvenEdit,
    deleteProductIvenEdit,
    updateProduct,
    getDescProductById,
    getConfigProductById,
    getAllDescProductById
}