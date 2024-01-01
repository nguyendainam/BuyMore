
import { generateRandomString } from "../../component/random.js"
import { connectDB } from '../../connectDB/index.js'
import mssql from 'mssql'

const createOrupdate = (data) => {


    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.action) {
                resolve({
                    err: -1,
                    errMessage: 'Missing data required'
                })
            } else {
                const Percent = data.Percent
                const NameVI = data.NameVI
                const NameEN = data.NameEN
                const Quantity = data.Quantity
                const DateStart = data.DateStart
                const DateEnd = data.DateEnd
                const pool = await connectDB()
                if (data.action.toLowerCase() === 'create') {
                    const Id = generateRandomString(10)
                    const result = await pool.request()
                        .input('Id', mssql.VarChar, Id)
                        .input('Percent', mssql.Int, Percent)
                        .input('NameVI', mssql.NVarChar, NameVI)
                        .input('NameEN', mssql.VarChar, NameEN)
                        .input('Quantity', mssql.Int, Quantity)
                        .input('DateStart', mssql.DateTime, DateStart)
                        .input('DateEnd', mssql.DateTime, DateEnd)
                        .query(`INSERT INTO Discount (Id, Discount_Percent, NameVI, NameEN, Quantity, DateStart, DateEnd)
                        SELECT @Id, @Percent, @NameVI, @NameEN, @Quantity, @DateStart, @DateEnd
                        WHERE NOT EXISTS (
                            SELECT 1 FROM Discount as D 
                            WHERE D.Id <> @Id 
                            AND D.Discount_Percent = @Percent
                            AND D.NameVI = @NameVI
                            AND D.NameEN = @NameEN
                            AND D.Quantity = @Quantity
                            AND D.DateStart = @DateStart
                            AND D.DateEnd = @DateEnd
                        )`)
                    if (result.rowsAffected[0] === 1) {
                        resolve({
                            err: 0,
                            errMessage: 'Create successfull'
                        })
                    } else {
                        resolve({
                            err: 1,
                            errMessage: 'Create Failed'
                        })
                    }
                } else if (data.action.toLowerCase() === 'update') {
                    const Id = data.Id
                    const result = await pool.request()
                        .input('Id', mssql.VarChar, Id)
                        .input('Percent', mssql.Int, Percent)
                        .input('NameVI', mssql.NVarChar, NameVI)
                        .input('NameEN', mssql.VarChar, NameEN)
                        .input('Quantity', mssql.Int, Quantity)
                        .input('DateStart', mssql.DateTime, DateStart)
                        .input('DateEnd', mssql.DateTime, DateEnd)
                        .query(`UPDATE Discount 
                                SET  Discount_Percent =@Percent,
                                NameVI = @NameVI, 
                                NameEN =@NameEN, Quantity = @Quantity, 
                                DateStart = @DateStart, DateEnd = @DateEnd
                                WHERE Id = @Id`)

                    if (result.rowsAffected[0] === 1) {
                        resolve({
                            err: 0,
                            errMessage: 'update successfull'
                        })
                    } else {
                        resolve({
                            err: 1,
                            errMessage: 'update Failed'
                        })
                    }
                }

            }

        } catch (e) {
            reject(e)
        }
    })
}


const getAllDiscountServices = (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB()
            const result = await pool.request().query(`SELECT * FROM Discount `)
            if (result) {
                resolve({
                    err: 0,
                    errMessage: 'Get data successfull',
                    items: result.recordset
                })
            } else {
                resolve({
                    err: 1,
                    errMessage: 'Get data failed'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


export default {
    createOrupdate,
    getAllDiscountServices
}