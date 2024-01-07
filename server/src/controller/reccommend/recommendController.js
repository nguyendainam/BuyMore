import recomment from "../../services/recommendSystem/recomment.js"
import { trainningdataTest } from "../../services/recommendSystem/traingdata.js"


const createdataToSql = async (req, res) => {
    try {
        const result = await trainningdataTest()
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
    }
}



const getDataTraining =async(req, res) => {
    try {
        let result = await recomment.getRecommendationForUser()
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const createdataToSqlHaveAccount = async(req, res) => {
       try {
        const{_id} = req.user
        let result = await recomment.getRecommendationForUser(_id)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
}

const getProductByRating = async (req , res) => {
    try {   
        const {_id} = req.user
        const result = await recomment.getDataByRating(_id)
        return res.status(200).json(result)
        
    } catch (e) {
        console.log(e)
        return res.status(200).json(e)
    }

}


export default {
    createdataToSql,
    getDataTraining,
    createdataToSqlHaveAccount,
    getProductByRating
}