import OrderServices from "../../services/order/OrderServices.js"

const CreateNewOrder = async (req, res) => {
    try {
        const { _id } = req.user
        let result = await OrderServices.createNewOrder(req.body, _id)
        return res.status(200).json(result)

    } catch (e) {
        return res.status(400).json(e)
    }

}


export default {
    CreateNewOrder
}