import path, { resolve } from 'path'
import { generateRandomString, randomInterger } from '../../component/random.js'
import { connectDB } from '../../connectDB/index.js'
import mssql from 'mssql'
import { RemoveImage, SaveImage, saveImageToFolder } from '../../component/saveImage.js'

const key = 'category'

//  Category
const createOrUpdateCategory = data => {
  console.log(data.action)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.action) {
        resolve({
          err: 1,
          errMessage: 'Missing data required'
        })
      } else {
        if (data.action === 'create') {
          let nameVI = data.nameVI
          let nameEN = data.nameEN
          let saveImage = ''
          if (data.Image) {
            const imageCategory = JSON.parse(data.Image)
            let nameImg = imageCategory[0].name
            let base64 = imageCategory[0].thumbUrl.split(';base64,').pop()
            saveImage = await saveImageToFolder(base64, nameImg, 'category')
          }

          let pool = await connectDB()
          let result = await pool
            .request()
            .input('nameVI', mssql.NVarChar, nameVI)
            .input('nameEN', mssql.VarChar, nameEN)
            .input('ImageCat', mssql.VarChar, saveImage).query(`
                        INSERT INTO Category ( nameVI, nameEN, ImageCat)
                        SELECT @nameVI, @nameEN, @ImageCat
                        WHERE NOT EXISTS (
                            SELECT 1
                            FROM Category
                            WHERE nameVI = @nameVI OR nameEN = @nameEN
                        )`)

          if (result.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              errMessage: 'Create item category successfull'
            })
          } else if (result.rowsAffected[0] === 0) {
            resolve({
              err: 2,
              errMessage: 'Items đã tồn tại'
            })
            await RemoveImage(saveImage)
          } else
            resolve({
              err: 1,
              errMessage: 'Create new items failed'
            })
        } else if (data.action.toLowerCase() === 'update') {
          if (!data.Id || !data.nameEN || !data.nameVI) {
            resolve({
              err: 1,
              errMessage: 'Missing data required to update'
            })
          } else {
            const IdCategory = data.Id
            const pool = await connectDB()
            let checkExist = await pool.request().query(`SELECT * FROM Category
                                    WHERE Id = '${IdCategory}'`)

            if (checkExist.rowsAffected[0] === 1) {
              let oldImage = checkExist.recordset[0].ImageCat
              let nameEN = data.nameEN
              let nameVI = data.nameVI
              let newImage = ''

              if (JSON.parse(data.Image).length > 0) {
                const imageCategory = JSON.parse(data.Image)
                let nameImg = imageCategory[0].name
                let base64 = imageCategory[0].thumbUrl.split(';base64,').pop()
                newImage = await saveImageToFolder(base64, nameImg, 'category')
              }

              let saveImage =
                JSON.parse(data.Image).length > 0 ? newImage : oldImage
              console.log('Ole Image', oldImage)
              console.log('new Image', newImage)
              let result = await pool
                .request()
                .input('nameVI', mssql.NVarChar, nameVI)
                .input('nameEN', mssql.VarChar, nameEN)
                .input('ImageCat', mssql.VarChar, saveImage).query(`
                                        UPDATE Category
                                        SET nameVI = @nameVI , nameEN =@nameEN, ImageCat = @ImageCat
                                        WHERE Id = '${IdCategory}'
                                        AND
                                        NOT EXISTS (
                                            SELECT 1 FROM  Category AS C WHERE (C.nameVI = @nameVI OR C.nameEN =@nameEN)
                                            AND C.Id <> '${IdCategory}'
                                       )`)
              if (result.rowsAffected[0] === 1) {
                resolve({
                  err: 0,
                  errMessage: 'Update Successfull'
                })
                if (newImage && oldImage) {
                  await RemoveImage(oldImage)
                }
              } else {
                resolve({
                  err: 2,
                  errMessage: 'Update failed'
                })
                if (newImage) {
                  await RemoveImage(newImage)
                }
              }
            } else {
              resolve({
                err: 2,
                errMessage: 'Not found Items'
              })
            }
          }
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}
const getAllCategoryServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await connectDB()
      let listItemCategories = await pool
        .request()
        .query('SELECT * FROM Category')
      if (listItemCategories.recordset.length > 0) {
        resolve({
          err: 0,
          errMessage: 'Getting all categories successfully',
          items: listItemCategories.recordset
        })
      } else {
        resolve({
          err: 1,
          errMessage: 'Empty list'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/*
 *
 *
 *
 **
 *
 **
 **
 **
 ****
 */
//   List ItemCategory

const createOrUpdateItesmToList = data => {
  // console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        if (data.action.toLowerCase() === 'create') {
          if (!data.nameVI || !data.nameEN) {
            resolve({
              err: 1,
              errMessage: 'Missing data to create category'
            })
          } else {
            let pool = await connectDB()
            let Id = randomInterger().toString()
            let result = await pool
              .request()
              .input('idListCat', mssql.VarChar, Id)
              .input('NameVI', mssql.NVarChar, data.nameVI)
              .input('NameEN', mssql.VarChar, data.nameEN)
              .input('IdCat', mssql.Int, data.IdCat).query(`
                    INSERT INTO ListCategory (idListCat, NameVI , NameEN, IdCat)
                    SELECT @idListCat, @NameVI, @NameEN , @IdCat
                    WHERE NOT EXISTS (
                        SELECT 1 FROM ListCategory AS C
                        WHERE (C.NameVI = @NameVI OR C.NameEN = @NameEN)
                        AND C.IdCat = @IdCat
                    ) `)
            if (result.rowsAffected[0] === 1) {
              resolve({
                err: 0,
                errMessage: 'Create Category Success'
              })
            } else {
              resolve({
                err: 1,
                errMessage: 'Create Category Failed'
              })
            }
          }
        } else if (data.action.toLowerCase() === 'update') {
          if (!data.nameVI || !data.nameEN || !data.IdCat || !data.Id) {
            resolve({
              err: -1,
              errMessage: 'Missing data required to update'
            })
          } else {
            const pool = await connectDB()

            console.log(data)
            const validateIdCat = parseInt(data.IdCat)
            const result = await pool
              .request()
              .input('NameVI', mssql.NVarChar, data.nameVI)
              .input('NameEN', mssql.VarChar, data.nameEN)
              .input('IdCat', mssql.Int, validateIdCat).query(`
          UPDATE ListCategory
          SET NameVI = @NameVI, NameEN = @NameEN, IdCat = @IdCat
          WHERE idListCat = '${data.Id}'
          AND NOT EXISTS (
            SELECT 1 FROM ListCategory AS L
            WHERE (L.NameVI = @NameVI  AND L.NameEN = @NameEN)
            AND L.IdCat = @IdCat
          )`)


            if (result.rowsAffected[0] === 1) {
              resolve({
                err: 0,
                errMessage: 'Update successfully'
              })
            } else {
              resolve({
                err: 2,
                errMessage: 'Update failed'
              })
            }
          }
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

const getAllListCategoryServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await connectDB()
      let listItemCategories = await pool.request().query(`SELECT 
                C.NameVI as NameVICategory ,
                C.NameEN as NameENCategory,
                ListCategory.* FROM ListCategory 
                JOIN Category as C ON C.Id = ListCategory.IdCat
        `)
      if (listItemCategories.recordset.length > 0) {
        resolve({
          err: 0,
          errMessage: 'Getting all categories successfully',
          items: listItemCategories.recordset
        })
      } else {
        resolve({
          err: 1,
          errMessage: 'Empty list'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

// const getListCatebyIdCat = id => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!id) {
//         resolve({
//           err: -1,
//           errMessage: 'Missing data required'
//         })
//       } else {
//         let pool = await connectDB()
//         let query = `SELECT * FROM  ListCategory WHERE IdCat = '${id}'`
//         let result = await pool.query(query)
//         resolve(result)
//       }
//     } catch (e) {
//       reject(e)
//     }
//   })
// }

// END LIST CATEGORY

// ITEM CATEGORY

const createOrUpdateItemCategory = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        if (data.action.toLowerCase() === 'create') {
          if (!data.nameVI || !data.Id_listCategory) {
            resolve({
              err: -1,
              errMessage: 'Missing data required to create category'
            })
          } else {
            let IdItems = randomInterger().toString()
            const pool = await connectDB()
            const result = await pool
              .request()
              .input('IdItemCat', mssql.Int, IdItems)
              .input('nameVI', mssql.NVarChar, data.nameVI)
              .input('nameEN', mssql.VarChar, data.nameEN)
              .input('IdListCat', mssql.Int, data.Id_listCategory)
              .query(
                `
                INSERT INTO ItemCategory (IdItemCat, nameVI, nameEN , IdListCat)
                SELECT @IdItemCat, @nameVI, @nameEN, @IdListCat
                WHERE NOT EXISTS (
                  SELECT  1 FROM ItemCategory AS I
                  WHERE (I.nameVI = @nameVI OR I.nameEN = @nameEN)
                  AND   I.IdListCat = @IdListCat
                  OR   I.IdItemCat = @IdItemCat
                )  
                `
              )

            if (result.rowsAffected[0] === 1) {
              resolve({
                err: 0,
                errMessage: 'Create Item Category Success'
              })
            } else {
              resolve({
                err: 1,
                errMessage: 'Create Item Category Failed'
              })
            }
          }
        } else if (data.action.toLowerCase() === 'update') {
          if (
            !data.IdItem ||
            !data.nameEN ||
            !data.nameVI ||
            !data.Id_listCategory
          ) {
            resolve({
              err: 1,
              errMessage: 'Missing data required to update'
            })
          } else {
            const pool = await connectDB()
            const result = await pool
              .request()
              .input('nameVI', mssql.NVarChar, data.nameVI)
              .input('nameEN', mssql.VarChar, data.nameEN)
              .input('IdListCat', mssql.Int, data.Id_listCategory)
              .query(
                `UPDATE ItemCategory 
                SET nameVI =  @nameVI, nameEN = @nameEN  ,IdListCat = @IdListCat
                WHERE IdItemCat = '${data.IdItem}'
                AND 
                NOT EXISTS (
                  SELECT  1 FROM ItemCategory AS I
                  WHERE (I.nameVI = @nameVI OR I.nameEN = @nameEN)
                  AND   I.IdListCat = @IdListCat
                  
                )  
                `
              )
            if (result.rowsAffected[0] === 1) {
              resolve({
                err: 0,
                errMessage: 'Update ItemCategory successfully '
              })
            } else {
              resolve({
                err: 1,
                errMessage: 'Update ItemCategory failed'
              })
            }
          }
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

const getItemCategoryById = keyId => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!keyId) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        let pool = await connectDB()
        let query = ''
        if (keyId.toLowerCase() === 'all') {
          query = `SELECT I.* , 
          L.nameVI as ListNameVI , 
          L.nameEN as ListNameEN ,
          C.nameVI as CatNameVI ,
          C.nameEN as CatNameEN,
          C.ImageCat as imageCat,
          C.Id   as IdCat
          FROM ItemCategory  AS I
                    JOIN ListCategory as L ON L.idListCat = I.IdListCat
                    JOIN CATEGORY AS C ON C.Id = L.IdCat
           `
        } else {
          query = `SELECT I.* , 
          L.nameVI as ListNameVI , 
          L.nameEN as ListNameEN ,
          C.nameVI as CatNameVI ,
          C.nameEN as CatNameEN,
          C.Id   as IdCat
          FROM ItemCategory  AS I
          JOIN ListCategory as L ON L.idListCat = I.IdListCat
          JOIN CATEGORY AS C ON C.Id = L.IdCat
          WHERE((I.idListCat = '${keyId}'))

           `
        }

        const result = await pool.request().query(query)
        if (result.rowsAffected[0] > 0) {
          resolve({
            err: 0,
            errMessage: 'Get Items category successfully',
            items: result.recordset
          })
        } else {
          resolve({
            err: 1,
            errMessage: 'Get Items category failed'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}


const createOrUpdateProductType = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.action) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        if (data.action.toLowerCase() === 'create') {
          const Id = generateRandomString(5)
          const NameVI = data.nameVI
          const NameEN = data.nameEN
          const IsShow = data.isShow ? data.isShow : 1

          let saveImage = ''
          if (data.Image) {
            let imgProductType = JSON.parse(data.Image)
            let name = imgProductType[0].name
            let base64 = imgProductType[0].thumbUrl.split(';base64,').pop()
            saveImage = await saveImageToFolder(base64, name, 'productType')
          }
          let pool = await connectDB()
          let result = await pool.request()
            .input('Id', mssql.VarChar, Id)
            .input('NameVI', mssql.NVarChar, NameVI)
            .input('NameEN', mssql.VarChar, NameEN)
            .input('Image', mssql.VarChar, saveImage)
            .input('IsShow', mssql.Bit, IsShow)
            .query(`INSERT INTO Product_Type (Id, NameVI, NameEN, Image, IsShow)
                  SELECT @Id, @NameVI , @NameEN , @Image , @IsShow
                  WHERE NOT EXISTS (
                    SELECT 1 
                    FROM Product_Type as P
                    WHERE (P.NameVI = @NameVI AND P.NameEN = @NameEN)
                    AND P.Id <> @Id
                  )`)
          if (result.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              errMessage: 'Create data success'
            })
          } else {
            resolve({
              err: 1,
              errMessage: 'Create failed'
            })
            await RemoveImage(saveImage)
          }
        } else if (data.action.toLowerCase() === 'update') {
          if (!data.Id) {
            resolve({
              err: -1,
              errMessage: 'Missing data required'
            })

          } else {
            const Id = data.Id
            const pool = await connectDB()
            let checkProduct_Type = await pool.query(`SELECT 1 FROM Product_Type WHERE Id = '${Id}' `)
            if (checkProduct_Type.recordset.length > 0) {
              let oldImage = checkProduct_Type.recordset[0].Image
              let saveImage = ''
              if (data.Image) {
                let imgProductType = JSON.parse(data.Image)
                let name = imgProductType[0].name
                let base64 = imgProductType[0].thumbUrl.split(';base64,').pop()
                saveImage = await saveImageToFolder(base64, name, 'productType')
              }
              const newImage = saveImage || oldImage
              const NameVI = data.nameVI
              const NameEN = data.nameEN
              const IsShow = data.isShow ? data.isShow : 1

              let result = await pool.request()
                .input('Id', mssql.VarChar, Id)
                .input('NameVI', mssql.NVarChar, NameVI)
                .input('NameEN', mssql.VarChar, NameEN)
                .input('Image', mssql.VarChar, newImage)
                .input('IsShow', mssql.Bit, IsShow)
                .query(`
                  UPDATE Product_Type  
                  SET   NameVI = @NameVI, NameEN = @NameEN , Image = @Image , IsShow =@IsShow
                  WHERE Id = @Id
                 AND NOT EXISTS
                  (
                    SELECT 1 
                    FROM Product_Type as P
                    WHERE (P.NameVI = @NameVI OR P.NameEN = @NameEN)
                    AND P.Id <> @Id )
                `)
              if (result.rowsAffected[0] > 0) {
                resolve({
                  err: 0,
                  errMessage: 'Update Success full'
                })
                if (newImage && oldImage) {
                  RemoveImage(oldImage)
                }
              } else {
                resolve({
                  err: 1,
                  errMessage: 'Update Failed'
                })
                RemoveImage(saveImage)
              }
            } else {
              resolve({
                err: 2,
                errMessage: 'Data Product Type Empty'
              })
            }
          }
        } else {
          resolve({
            err: -1,
            errMessage: 'Invalid action'
          })
        }
      }

    } catch (e) {
      reject(e)
    }
  })
}

const getAllProductType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await connectDB()
      let result = await pool.request().query(`SELECT * FROM Product_Type `)
      if (result) {
        resolve({
          err: 0,
          errMessage: 'Get data successful',
          items: result.recordset
        })
      } else {
        resolve({
          err: 1,
          errMessage: 'Get data faild'

        })
      }

    } catch (e) {
      reject(e)
    }
  })
}
// I.IdItemCat as IdCat, I.nameVI as titleLisVI, I.nameEN as titleListEN
// JOIN ItemCategory as I ON I.IdListCat =  L.idListCat
const getListCatHomePage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await connectDB()
      let result = await pool.query(`
            SELECT C.* 
            FROM Category as C ,
             L.idListCat, L.nameVI , L.nameEN,
             I.IdItemCat as IdItem, I.nameVI as viItem, I.nameEN as enItem
             JOIN ListCategory AS L ON L.IdCat = C.Id
             JOIN ItemCategory as I ON I.IdListCat =  L.idListCat
      `)


      if (result) {
        resolve({
          err: 0,
          items: result.recordsets
        })
      } else {
        resolve({
          err: 1
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}


export default {
  createOrUpdateCategory,
  createOrUpdateItesmToList,
  createOrUpdateItemCategory,
  getAllCategoryServices,
  getAllListCategoryServices,
  getItemCategoryById,
  createOrUpdateProductType,
  getAllProductType,
  getListCatHomePage
}
