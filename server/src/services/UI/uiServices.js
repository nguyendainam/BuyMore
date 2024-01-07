import { RemoveImage, saveImageToFolder } from "../../component/saveImage.js";
import { connectDB } from "../../connectDB/index.js";
import mssql from "mssql";

const createCarouserServices = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.ListImage) {
        return {
          err: -1,
          errMessage: "Missing data require",
        };
      } else {
        if (data.ListImage) {
          const arrImage = JSON.parse(data.ListImage);
          const pool = await connectDB();
          const isShow = 1;

          arrImage.map(async (img) => {
            const nameImage = img.name;
            const base64ImagePr = img.thumbUrl.split(";base64,").pop();
            const saveImage = await saveImageToFolder(
              base64ImagePr,
              nameImage,
              "ImageCarousel"
            );

            if (saveImage) {
              const result = await pool
                .request()
                .input("Type", mssql.VarChar, data.typeImage)
                .input("Image", mssql.VarChar, saveImage)
                .input("IsShow", mssql.Bit, isShow).query(`
                  INSERT INTO CarouselImage (Image, Type, IsShow)
                  VALUES (@Image, @Type, @IsShow)
                `);

              if (result.rowsAffected[0] === 0 || !result) {
                RemoveImage(saveImage);
              }

              resolve({
                err: 0,
                errMessage: 'Create successfull'
              })
            } else {
              return {
                err: -1,
                errMessage: "Create image failed",
              };
            }
          })

        } else {
          // Close the database connection
          return {
            err: 1,
            errMessage: 'Create Image fail'
          };
        }
      }
    }

    catch (e) {
      // Log the error for debugging
      console.error("Error in createCarouserServices:", e);
      return {
        err: -1,
        errMessage: "An error occurred",
      };
    }
  })
};

const getCarouselImageService = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      let keyList = key
      if (!key) {
        keyList = 'All'
      }
      let pool = await connectDB()
      if (key.toLowerCase() === 'all') {
        let result = await pool.query(`SELECT * FROM  CarouselImage `)
        if (result.rowsAffected[0] > 0) {
          resolve({
            err: 0,
            errMessage: 'Get Data successfull',
            items: result.recordset
          })
        } else {
          resolve({
            err: 1,
            items: result.recordset
          })
        }
      } else {
        let result = await pool.query(`SELECT * FROM  CarouselImage WHERE  TypeImage = ${key} `)
        if (result.rowsAffected[0] > 0) {
          resolve({
            err: 0,
            errMessage: 'Get Data successfull',
            items: result.recordset
          })
        } else {
          resolve({
            err: 1,
            items: result.recordset
          })
        }
      }

    } catch (e) {
      reject(e);
    }
  });
};


const uploadImageServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        const imageBase64 = data.image.split(";base64,").pop()
        const nameImage = data.nameImage
        const type = data.type
        const idProduct = data.idProduct

        console.log(idProduct)
        console.log(type)
        const pool = await connectDB()
        const saveImage = await saveImageToFolder(
          imageBase64,
          nameImage,
          "product"
        );
        console.log(saveImage)
        if (saveImage) {
          const result = await pool.request()
            .input('TypeImage', mssql.VarChar, type)
            .input('Image', mssql.VarChar, saveImage)
            .input('Product_Inventory', mssql.VarChar, idProduct)
            .query(`INSERT INTO Image_Product (TypeImage,Image,Product_Inventory)
                  SELECT @TypeImage ,@Image ,@Product_Inventory
            `)
          if (result.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              filename: saveImage
            })
          } else {
            resolve({
              err: 1,
              errMessage: 'Create data failed'
            })
          }
        }
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }



  })
}



const removeImageServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        const pool = await connectDB()
        if (data.type === 'Inventory_Product') {
          const image = data.image
          const id = data.idProduct
          // const filenameImage = image.split('/')[2]

          // console.log(filenameImage)
          const result = await pool.request().query(`DELETE FROM Image_Product WHERE  Image = '${image}' AND Product_Inventory = '${id}' `)
          if (result.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              errMessage: 'Delete Image success'
            })
            await RemoveImage(image)
          }

        }
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

export default {
  createCarouserServices,
  getCarouselImageService,
  uploadImageServices,
  removeImageServices
};
