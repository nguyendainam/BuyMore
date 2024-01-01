import mssql from 'mssql'
import { connectDB } from '../../connectDB/index.js'
import moment from 'moment'
import { generateRandomString, randomInterger } from '../../component/random.js'





const createNewOrder = (data, _id) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(_id)

            if (!data || !_id) {
                console.log('Missing data')
                resolve({
                    err: -1,
                    errMessage: "missing data required"
                })
            } else {
                const pool = await connectDB()
                const IdOder = generateRandomString(10)
                // const Order_By = _id
                const ListCart = data.ListIdCart
                const Address = data.address
                const total = data.total
                const status = 'Paid'
                const createdAT = moment(new Date()).format('YYYY-MM-DD HH:mm')

                const resultOrder = await pool.request()
                    .input('Id_Order', mssql.VarChar, IdOder)
                    .input('Order_By', mssql.VarChar, _id)
                    .input('Status', mssql.VarChar, status)
                    .input('createdAT', mssql.DateTime, createdAT)
                    .input('TotalPrice', mssql.Int, total)
                    .input('CurrentCart', mssql.VarChar, ListCart)
                    .input('AddressOrder', mssql.NVarChar, Address)
                    .query(`INSERT INTO Orders (Id_Order, Order_By,Status,CreatedAT ,TotalPrice ,CurrentCart ,AddressOrder)
                             SELECT @Id_Order, @Order_By ,@Status , @createdAT ,@TotalPrice , @CurrentCart , @AddressOrder`)

                console.log(resultOrder)
                if (resultOrder.rowsAffected[0] === 1) {
                    const listCart = ListCart.split(",")
                    for (const item of listCart) {
                        await pool.request().query(`UPDATE Cart SET OrderID = '${IdOder}' , StatusCart  = 'Bougth'  WHERE CartID = '${item}'`);
                    }
                    resolve({
                        err: 0,
                        errMessage: 'Order product Successfull'
                    })
                } else {
                    resolve({
                        err: 1,
                        errMessage: 'Order product Failed'
                    })
                }
            }

            // if (!data || !_id) {
            //     resolve({
            //         err: -1,
            //         errMessage: 'Missing data required'
            //     })
            // } else {
            //     const pool = await connectDB()
            //     const IdOder = generateRandomString(10)
            //     const Order_By = _id
            //     const createdAT = moment(new Date()).format('YYYY-MM-DD HH:mm')
            //     const status = 'Processing'
            //     const IdCart = data.IdCart

            //     const resultOrder = await pool.request()
            //         .input('Id_Order', mssql.VarChar, IdOder)
            //         .input('Order_By', mssql.VarChar, Order_By)
            //         .input('Status', mssql.VarChar, status)
            //         .input('createdAT', mssql.DateTime, createdAT)
            //         .query(`INSERT INTO Orders (Id_Order, Order_By,Status,CreatedAT)
            //                 SELECT @Id_Order, @Order_By ,@Status , @createdAT
            //         `)

            //     if (resultOrder.rowsAffected[0] === 1) {
            //         const updateCart = await pool.request().query(`UPDATE Cart SET OrderID = '${IdOder}' WHERE  CartID = '${IdCart}'`)
            //         if (updateCart.rowsAffected[0] === 1) {
            //             resolve({
            //                 err: 0,
            //                 errMessage: 'Order product Successfull'
            //             })
            //         } else {
            //             resolve({
            //                 err: 1,
            //                 errMessage: 'Order product failed'
            //             })
            //         }
            //     } else {
            //         resolve({
            //             err: 1,
            //             errMessage: 'Create new Order Failed'
            //         })
            //     }

            // }
        } catch (e) {
            console.log(e)
            reject(e)
        }

    })
}


export default {
    createNewOrder
}