import mssql from 'mssql'
import config from "./configDB.js";

export async function connectDB () {
    try {
        let dataserver = config.database
        let pool =await new mssql.ConnectionPool(dataserver).connect()
        return await pool
    } catch (e) {
        console.log("ERR CONNECTION.....")
        console.log(e)
    }
}