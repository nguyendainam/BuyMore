import mssql from 'mssql'
import { connectDB } from '../../connectDB/index.js'
import moment from 'moment'
import { generateRandomString, randomInterger } from '../../component/random.js'





const createNewOrder = (data, _id) => {
    return new Promise(async (resolve, reject) => {
        try {

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
                const idAddress = data.idAddress
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
                    .input('AddressId', mssql.VarChar, idAddress)
                    .query(`INSERT INTO Orders (Id_Order, Order_By,Status,CreatedAT ,TotalPrice ,CurrentCart ,AddressOrder ,AddressId)
                                 SELECT @Id_Order, @Order_By ,@Status , @createdAT ,@TotalPrice , @CurrentCart , @AddressOrder, @AddressId `)

                if (resultOrder.rowsAffected[0] === 1) {
                    const listCart = ListCart.split(",")
                    for (const item of listCart) {
                        await pool.request().query(`UPDATE Cart SET OrderID = '${IdOder}' , StatusCart  = 'Bougth'  WHERE CartID = '${item}'`);
                    }

                    for (const item of listCart) {
                        console.log("Item.... in listCart", item)

                        await pool.request().query(`
                            UPDATE PI 
                            SET PI.Quantity = PI.Quantity - C.Quantity
                            FROM Product_Inventory AS PI
                            INNER JOIN Cart AS C ON PI.Id = C.ProductID
                            WHERE C.CartID = '${item}' 
                            `)
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
        } catch (e) {
            console.log(e)
            reject(e)
        }

    })
}





export default {
    createNewOrder
}