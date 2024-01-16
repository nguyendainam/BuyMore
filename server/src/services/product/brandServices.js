import { randomInterger } from '../../component/random.js'
import {
  RemoveImage,
  SaveImage,
  saveImageToFolder
} from '../../component/saveImage.js'
import { connectDB } from '../../connectDB/index.js'
import mssql from 'mssql'
const key = 'brand'

const CreateOrUpdateBrand = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.action) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        if (data.action.toLowerCase() === 'create') {
          let IdBrand = randomInterger().toString()
          let NameBrand = data.NameBrand
          let DescVI = data.DescVI
          let DescEN = data.DescEN
          let saveImage = ''
          if (data.ImageBrand) {
            let ImageBrand = JSON.parse(data.ImageBrand)
            let nameImg = ImageBrand[0].name
            let base64 = ImageBrand[0].thumbUrl.split(';base64,').pop()
            saveImage = await saveImageToFolder(base64, nameImg, 'brand')
          }
          let pool = await connectDB()
          let result = await pool
            .request()
            .input('IdBrand', mssql.VarChar, IdBrand)
            .input('NameBrand', mssql.VarChar, NameBrand)
            .input('DescVI', mssql.NText, DescVI)
            .input('DescEN', mssql.Text, DescEN)
            .input('ImageBrand', mssql.VarChar, saveImage).query(`INSERT INTO 
                        Brands (IdBrand, NameBrand, ImageBrand, DescVI, DescEN)
                        SELECT @IdBrand, @NameBrand, @ImageBrand, @DescVI , @DescEN
                        WHERE NOT EXISTS (
                            SELECT 1 
                            FROM Brands as B
                            WHERE B.NameBrand = @NameBrand
                        )`)
          console.log(result)
          if (result.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              errMessage: 'Create  brand successfull'
            })
          } else if (result.rowsAffected[0] === 0) {
            resolve({
              err: 2,
              errMessage: 'Brand đã tồn tại'
            })
            await RemoveImage(saveImage)
          } else {
            resolve({
              err: 1,
              errMessage: 'Create new Brands failed'
            })
          }
        } else if (data.action.toLowerCase() === 'update') {
          if (!data.IdBrand) {
            resolve({
              err: -1,
              errMessage: 'Missing data required'
            })
          } else {

            const idBrand = data.IdBrand
            const NameBrand = data.NameBrand
            const DescVI = data.DescVI
            const DescEN = data.DescEN

            const pool = await connectDB()
            if (data.imageProduct) {
              const base64 = JSON.parse(data.imageProduct).split(';base64,').pop()
              const filename = data.filename
              const saveImage = await saveImageToFolder(base64, filename, 'brand')
              console.log(saveImage)

              if (saveImage) {
                const result = await pool.request()
                  .input('Id', mssql.VarChar, idBrand)
                  .input('NameBrand', mssql.NVarChar, NameBrand)
                  .input('ImageBrand', mssql.VarChar, saveImage)
                  .input('DescVI', mssql.NText, DescVI)
                  .input('DescEN', mssql.Text, DescEN)
                  .query(`
                  UPDATE Brands 
                  SET
                   NameBrand = @NameBrand,  ImageBrand = @ImageBrand , DescVI = @DescVI , DescEN = @DescEN
                  WHERE IdBrand = @Id
                  `)

                if (result.rowsAffected[0] === 1) {
                  resolve({
                    err: 0,
                    errMessage: 'Update Success'
                  })
                }
              }
            } else {
              const result = await pool.request()
                .input('Id', mssql.VarChar, idBrand)
                .input('NameBrand', mssql.NVarChar, NameBrand)
                .input('DescVI', mssql.NText, DescVI)
                .input('DescEN', mssql.Text, DescEN)
                .query(`
                  UPDATE Brands 
                  SET
                   NameBrand = @NameBrand,  DescVI = @DescVI , DescEN = @DescEN
                  WHERE IdBrand = @Id
                  `)
              console.log(result)
              if (result) {
                resolve({
                  err: 0,
                  errMessage: 'Update Success'
                })
              }

            }


          }

        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

const getAllBrands = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await connectDB()
      let result = await pool.query(` SELECT * FROM Brands`)
      if (result.rowsAffected[0] > 0) {
        resolve({
          err: 0,
          errMessage: 'Get Brands Successfully',
          item: result.recordset
        })
      } else {
        resolve({
          err: 1,
          errMessage: 'Data empty',
          item: result.recordset
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

const getAllAboutBrands = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!key) {
        resolve({
          err: -1,
          errMessage: "Missing data required"
        })
      } else {
        const pool = await connectDB()
        const result = await pool.request().query(`
          SELECT B.* ,
          (
            SELECT P.NameVI , P.NameEN ,P.Discount_Id ,P.Id , D.Discount_Percent,I.Image,
            (
              SELECT
              PI.*  
              FROM Product_Inventory AS PI
              WHERE PI.Id_Product = P.Id
              FOR JSON PATH
            ) AS ProductInventory
            FROM Product as P
            JOIN Discount as D ON D.Id = P.Discount_Id
            JOIN Image_Product as I ON I.Id_Product = P.Id
            WHERE P.Brand_Id = B.IdBrand
            FOR JSON PATH
          )  AS Product

          FROM Brands as B
          WHERE B.IdBrand = '${key}'
        `)


        resolve(result.recordset)

      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}


export default {
  CreateOrUpdateBrand,
  getAllBrands,
  getAllAboutBrands
}
