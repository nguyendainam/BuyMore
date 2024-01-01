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
        }
      }
    } catch (e) {
      reject(e)
    }
    // try {
    //     if (!data || !data.action) {
    //         resolve({
    //             err: -1,
    //             errMessage: 'Missing data required'
    //         })
    //     } else {
    //         if (data.action.toLowerCase() === 'create') {
    //             if (!data.NameBrand) {
    //                 resolve({
    //                     err: -1,
    //                     errMessage: 'Missing data required create brand'
    //                 })
    //             } else {
    //                 const pool = await connectDB()
    //                 let IdBrand = randomInterger().toString()
    //                 let imagePath = ImageBrand ? await SaveImage(ImageBrand.ImageBrand, key) : null
    //                 let result = await pool.request()
    //                     .input('IdBrand', mssql.VarChar, IdBrand)
    //                     .input('NameBrand', mssql.NVarChar, data.NameBrand)
    //                     .input('ImageBrand', mssql.VarChar, imagePath)
    //                     .input('DescVI', mssql.NText, data.DescVI)
    //                     .input('DescEN', mssql.Text, data.DescEN)
    //                     .query(`
    //                         INSERT INTO Brands (IdBrand, NameBrand, ImageBrand, DescVI, DescEN)
    //                         SELECT @IdBrand,  @NameBrand , @ImageBrand ,@DescVI ,@DescEN
    //                         WHERE NOT EXISTS (
    //                             SELECT 1 FROM Brands as B
    //                             WHERE B.NameBrand = @NameBrand
    //                         )
    //                     `)

    //                 if (result.rowsAffected[0] === 1) {
    //                     resolve({
    //                         err: 0,
    //                         errMessage: 'Create new Brands Success'
    //                     })
    //                 } else {
    //                     resolve({
    //                         err: 1,
    //                         errMessage: 'create brands faild'
    //                     })

    //                     imagePath ? await RemoveImage(imagePath) : ''
    //                 }
    //             }

    //         } else if (data.action.toLowerCase() === 'update') {
    //             if (!data.Id || !data.NameBrand) {
    //                 resolve({
    //                     err: -1,
    //                     errMessage: 'Missing data required to update'
    //                 })
    //             } else {
    //                 let IdBrand = data.Id
    //                 const pool = await connectDB()
    //                 const checkExist = await pool.request().query(`SELECT * FROM Brands
    //                                 WHERE Id = '${IdBrand}' `)

    //                 if (checkExist.rowsAffected[0] === 1) {
    //                     let oldImage = checkExist.recordset[0].ImageBrand

    //                     let newImage = ImageBrand ? await SaveImage(ImageBrand.ImageBrand, key) : oldImage

    //                     let result = await pool.request()
    //                         .input('NameBrand', mssql.NVarChar, data.NameBrand)
    //                         .input('ImageBrand', mssql.VarChar, newImage)
    //                         .input('DescVI', mssql.NText, data.DescVI)
    //                         .input('DescEN', mssql.VarChar, data.DescEN)
    //                         .query(`UPDATE Brands
    //                                 SET NameBrand =@NameBrand ,
    //                                     ImageBrand=@ImageBrand,
    //                                     DescVI = @DescVI,
    //                                     DescEN = @DescEN
    //                                 WHERE Id = '${IdBrand}'
    //                                 AND
    //                                 NOT EXISTS (
    //                                     SELECT 1 FROM Brands as B
    //                                     WHERE B.NameBrand = @NameBrand
    //                                 )
    //                         `)
    //                     if (result.rowsAffected[0] === 1) {
    //                         resolve({
    //                             err: 0,
    //                             errMessage: 'Update Successfull'
    //                         })
    //                         if (ImageBrand && oldImage) {
    //                             RemoveImage(oldImage)
    //                         }
    //                     } else {
    //                         resolve({
    //                             err: 2,
    //                             errMessage: 'Update failed'
    //                         })
    //                         if (ImageBrand) {
    //                             RemoveImage(newImage)
    //                         }
    //                     }

    //                 }

    //             }

    //         }

    //     }

    // } catch (e) {
    //     reject(e)
    // }
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

export default {
  CreateOrUpdateBrand,
  getAllBrands
}
