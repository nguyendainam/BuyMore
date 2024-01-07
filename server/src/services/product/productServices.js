import { v4 as uuidv4 } from "uuid";
import {
  RemoveImage,
  SaveImage,
  saveImageToFolder,
} from "../../component/saveImage.js";
import { connectDB } from "../../connectDB/index.js";
import mssql from "mssql";
import { generateRandomString } from "../../component/random.js";
// import { reject } from "lodash";

const createProduct = async (product) => {
  // console.log(product)
  return new Promise(async (resolve, reject) => {
    try {
      if (!product.ImageProduct || !product.Product || !product.Inventory) {
        return {
          err: -1,
          errMessage: "Missing data required",
        };
      }
      const aboutProduct = JSON.parse(product.Product);

      // console.log(aboutProduct);
      const imageShow = JSON.parse(product.ImageProduct);
      const listInventory = JSON.parse(product.Inventory);
      const IdProduct = Date.now() + "@" + uuidv4();
      const nameVI = aboutProduct.nameVI;
      const nameEN = aboutProduct.nameEN;
      const category_Id = aboutProduct.category.join(",");
      const brand_Id = aboutProduct.brand;
      const discount_Id = aboutProduct.discount;
      const descVI = aboutProduct.descVI;
      const descEN = aboutProduct.descEN;
      const type_product = aboutProduct.type_product;
      const pool = await connectDB();
      const transaction = new mssql.Transaction(pool);
      await transaction.begin();
      try {
        const saveProduct = await pool
          .request()
          .input("Id", mssql.VarChar, IdProduct)
          .input("NameVI", mssql.NVarChar, nameVI)
          .input("NameEN", mssql.VarChar, nameEN)
          .input("Category_Id", mssql.VarChar, category_Id)
          .input("Brand_Id", mssql.VarChar, brand_Id)
          .input("Discount_Id", mssql.VarChar, discount_Id)
          .input("DescVI", mssql.NVarChar, descVI)
          .input("DescEN", mssql.VarChar, descEN)
          .input("Type_Product", mssql.VarChar, type_product).query(`
      INSERT INTO Product(Id, NameVI, NameEN, Discount_Id, Category_Id, Brand_Id , DescEN ,DescVI,Type_Product)
      SELECT @Id, @NameVI, @NameEN, @Discount_Id, @Category_Id, @Brand_Id, @DescEN, @DescVI,@Type_Product
      WHERE NOT EXISTS (
          SELECT 1 
          FROM Product as p 
          WHERE 
              (p.NameVI = @NameVI
              AND p.NameEN = @NameEN
              AND p.Brand_Id = @Brand_Id
              AND p.Category_Id = @Category_Id
              AND p.Type_Product = @Type_Product
              )
              AND p.Id <> @Id
      )`);

        if (saveProduct.rowsAffected[0] === 1) {
          const typeImage = "showProduct";

          if (imageShow) {
            const nameImagePr = nameEN.split(" ")[0] + ".png";
            const base64ImagePr = imageShow.split(";base64,").pop();
            const mainImageProduct = await saveImageToFolder(
              base64ImagePr,
              nameImagePr,
              "product"
            );

            if (mainImageProduct) {
              let resultSaveImg = await pool
                .request()
                .input("TypeImage", mssql.VarChar, typeImage)
                .input("Image", mssql.VarChar, mainImageProduct)
                .input("Id_Product", mssql.VarChar, IdProduct).query(`
                        INSERT INTO Image_Product (TypeImage, Image, Id_Product)
                        VALUES (@TypeImage, @Image, @Id_Product)
                      `);
              if (resultSaveImg.rowsAffected[0] === 0) {
                RemoveImage(mainImageProduct);
              }
            }
          }

          await Promise.all(
            listInventory.map(async (item) => {
              const IdInventory = Date.now() + "I@" + uuidv4();

              const resultInventory = await pool
                .request()
                .input("Id", mssql.VarChar, IdInventory)
                .input("Id_Product", mssql.VarChar, IdProduct)
                .input(
                  "Size",
                  mssql.VarChar,
                  item.Size ? item.Size.join(",") : null
                )
                .input("Color", mssql.VarChar, item.Color)
                .input("Quantity", mssql.Int, item.quantity)
                .input("Price", mssql.Decimal, item.price)
                .input(
                  "screenSize",
                  mssql.VarChar,
                  item.screenSize ? item.screenSize.join(",") : null
                )
                .input(
                  "memory",
                  mssql.VarChar,
                  item.memory ? item.memory.join(",") : null
                )
                .input(
                  "scanFrequency",
                  mssql.VarChar,
                  item.scanFrequency ? item.scanFrequency.join(",") : null
                )
                .input(
                  "screenType",
                  mssql.VarChar,
                  item.screenType ? item.screenType.join(",") : null
                ).query(`
                          INSERT INTO Product_Inventory (Id, Id_Product, Size, Color, Quantity, Price,
                            screenSize, memory, scanFrequency, screenType)
                          SELECT 
                            @Id, @Id_Product, @Size, @Color, @Quantity, @Price,
                            @screenSize, @memory, @scanFrequency, @screenType
                          WHERE NOT EXISTS (
                            SELECT 1 
                            FROM Product_Inventory 
                            WHERE 
                              Id_Product = @Id_Product AND
                              Size = @Size AND
                              Color = @Color AND
                              Quantity = @Quantity AND
                              Price = @Price AND
                              screenSize = @screenSize AND
                              memory = @memory AND
                              scanFrequency = @scanFrequency AND
                              screenType = @screenType
                         );`);

              if (resultInventory.rowsAffected[0] === 1) {
                const typeImage = "Inventory_Product";

                await Promise.all(
                  item.Image.map(async (itemImg) => {
                    const nameImagePr = itemImg.name;
                    const base64ImagePr = itemImg.thumbUrl
                      .split(";base64,")
                      .pop();
                    const saveImagePr = await saveImageToFolder(
                      base64ImagePr,
                      nameImagePr,
                      "product"
                    );

                    if (saveImagePr) {
                      const resultsaveImage = await pool
                        .request()
                        .input("TypeImage", mssql.VarChar, typeImage)
                        .input("Image", mssql.VarChar, saveImagePr)
                        .input("Product_Inventory", mssql.VarChar, IdInventory)
                        .query(`
                          INSERT INTO Image_Product (TypeImage, Image, Product_Inventory)
                          VALUES (@TypeImage, @Image, @Product_Inventory)
                        `);

                      if (resultsaveImage.rowsAffected[0] === 0) {
                        RemoveImage(saveImagePr);
                      }
                    }
                  })
                );
              }
            })
          );
        } else {
          await transaction.rollback();
          resolve({
            err: -1,
            errMessage: "Product already exists",
          });
        }
        await transaction.commit();
        resolve({
          err: 0,
          errMessage: "create Product success",
        });
      } catch (error) {
        await transaction.rollback();
        console.error(error);
        return {
          err: -1,
          errMessage: "An error occurred",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        err: -1,
        errMessage: "An error occurred",
      };
    }
  });
};

const getAllProductServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await connectDB();
      let result = await pool.request().query(`
        SELECT
          P.Id AS ProductId,
          P.NameVI,
          P.NameEN,
          P.Brand_Id, P.Type_Product, P.Category_Id,
          B.NameBrand,
          P.DescVI ,
          P.DescEN,
          I.Image,
          D.Discount_Percent as Discount,
          (
            SELECT
            PI.Price 
            FROM Product_Inventory AS PI
            WHERE PI.Id_Product = P.Id
            FOR JSON PATH
          ) AS ProductInventory,
          (
            SELECT
              SUM(PI.Quantity) AS TotalQuantity
            FROM Product_Inventory AS PI
            WHERE PI.Id_Product = P.Id
          ) AS TotalQuantity
        FROM Product AS P
        JOIN Image_Product AS I ON I.Id_Product = P.Id
        JOIN Brands AS B ON B.IdBrand = P.Brand_Id
        JOIN Discount AS D ON D.Id = P.Discount_Id
        ORDER BY P.Id
        OFFSET 0 ROWS
        FETCH NEXT 50 ROWS ONLY;
        
        `);

      resolve({
        err: 0,
        items: result.recordset,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductServicesEdit = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await connectDB();
      let result = await pool.request().query(`SELECT
  P.Id AS ProductId,
  P.NameVI,
  P.NameEN,
  P.Brand_Id,
  P.Type_Product,
  P.Category_Id,
  P.Discount_Id,
  B.NameBrand,
  P.DescVI,
  P.DescEN,
  I.Image,
  D.Discount_Percent as Discount,
  (
    SELECT
      PI.*,
      ISNULL((
        SELECT II.Image
        FROM Image_Product AS II
        WHERE II.Product_Inventory = PI.Id
        FOR JSON PATH
      ), '[]') AS ImageInventory
    FROM Product_Inventory AS PI
    WHERE PI.Id_Product = P.Id
    FOR JSON PATH
  ) AS ProductInventory
FROM Product AS P
JOIN Image_Product AS I ON I.Id_Product = P.Id
JOIN Brands AS B ON B.IdBrand = P.Brand_Id
JOIN Discount AS D ON D.Id = P.Discount_Id;
`);

      resolve({
        err: 0,
        items: result.recordset,
      });
    } catch (e) {
      console.log(e)
      reject(e);
    }
  });
};

const getProductByIdServices = (IdProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!IdProduct) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool.query(`
        SELECT P.*, B.NameBrand,
        D.Discount_Percent as Discount,
                ( SELECT PI.*,
                    ( SELECT IMG.* 
                      FROM 
                          Image_Product AS IMG
                      WHERE 
                          PI.Id = IMG.Product_Inventory
                      FOR JSON PATH
                    )as ListImage
              
                  FROM 
                    Product_Inventory AS PI
                  WHERE 
                    PI.Id_Product = P.Id
                  FOR JSON PATH  
                ) as ListItems
            FROM 
            Product as P
            JOIN Brands as B ON B.IdBrand = P.Brand_Id 
            JOIN Discount AS D ON D.Id  = P.Discount_Id
            WHERE P.Id = '${IdProduct}'
    
          `);

        // JOIN Product_Inventory as PI ON PI.Id_Product = P.Id
        resolve({
          items: result.recordset,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductServicesByTags = (key) => {
  console.log("tags", key);

  return new Promise(async (resolve, reject) => {
    try {
      const pool = await connectDB();
      if (!key) {
        const result = await pool.request().query(`SELECT * FROM Product `);
        resolve({
          items: result.recordset,
        });
      } else {
        const keyValues = key.split(",");
        const result = await pool.request().query(`
        SELECT 
        P.* , 
        B.NameBrand ,
        D.Discount_Percent  AS Discount,
        I.Image,
        (
          SELECT
          PI.*  
          FROM Product_Inventory AS PI
          WHERE PI.Id_Product = P.Id
          FOR JSON PATH
        ) AS ProductInventory
        FROM Product  as P      
        JOIN Brands as B ON B.IdBrand = P.Brand_Id 
        JOIN Discount AS D ON D.Id = P.Discount_Id
        JOIN Image_Product as I ON I.Id_Product = P.Id
        WHERE ${keyValues
            .map((value) => `Category_Id LIKE '%${value}%'`)
            .join(" OR ")}
        ORDER BY 
        P.Created DESC;
       
        `);
        resolve({
          items: result.recordset,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductByType_Product = (key) => {
  console.log(key);
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await connectDB();
      if (!key) resolve({ err: -1, errMessage: "missing data require" });
      else if (key === "ALL") {
        const result = await pool.request().query(`
        SELECT 
        P.* , 
        B.NameBrand ,
        D.Discount_Percent  AS Discount,
        I.Image,
        (
          SELECT
          PI.*  
          FROM Product_Inventory AS PI
          WHERE PI.Id_Product = P.Id
          FOR JSON PATH
        ) AS ProductInventory
      
        FROM Product AS P
        JOIN Brands as B ON B.IdBrand = P.Brand_Id 
        JOIN Discount AS D ON D.Id = P.Discount_Id
        JOIN Image_Product as I ON I.Id_Product = P.Id
        ORDER BY 
        P.Created DESC;
        `);
        resolve({
          err: 0,
          items: result.recordset,
        });
      } else {
        const result = await pool.request().query(`
        SELECT 
        P.* , 
        B.NameBrand ,
        D.Discount_Percent  AS Discount,
        I.Image,
        (
          SELECT
          PI.*  
          FROM Product_Inventory AS PI
          WHERE PI.Id_Product = P.Id
          FOR JSON PATH
        ) AS ProductInventory
      
        FROM Product AS P
        JOIN Brands as B ON B.IdBrand = P.Brand_Id 
        JOIN Discount AS D ON D.Id = P.Discount_Id
        JOIN Image_Product as I ON I.Id_Product = P.Id
      
        WHERE  Type_Product = '${key}'
        ORDER BY 
        P.Created DESC;
        `);
        resolve({
          err: 0,
          items: result.recordset,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductByType_ProductNew = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!key) resolve({ err: -1, errMessage: "missing data require" });
      const pool = await connectDB();
      const result = await pool.request().query(`
                SELECT 
                TOP 5
                P.* , 
                B.NameBrand ,
                D.Discount_Percent  AS Discount,
                I.Image,
                (
                  SELECT
                  PI.*  
                  FROM Product_Inventory AS PI
                  WHERE PI.Id_Product = P.Id
                  FOR JSON PATH
                ) AS ProductInventory
              
                FROM Product AS P
                JOIN Brands as B ON B.IdBrand = P.Brand_Id 
                JOIN Discount AS D ON D.Id = P.Discount_Id
                JOIN Image_Product as I ON I.Id_Product = P.Id
              
                WHERE  Type_Product = '${key}'
                ORDER BY 
                P.Created DESC;
                `);
      resolve({
        err: 0,
        items: result.recordset,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//  USING PRODUCT BY TYPE

const handleOnSearchProduct = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!key) resolve({ items: [] });
      else {
        const pool = await connectDB();
        let result = await pool.request().query(`
        
        SELECT  P.NameVI , P.NameEN , 
        B.NameBrand ,
        D.Discount_Percent  AS Discount,
        I.Image,
        (
                  SELECT
                  PI.Price  
                  FROM Product_Inventory AS PI
                  WHERE PI.Id_Product = P.Id
                  FOR JSON PATH
                ) AS ProductInventory
        FROM  Product  as P
        JOIN Image_Product as I ON I.Id_Product = P.Id
        JOIN Brands as B ON B.IdBrand = P.Brand_Id 
        JOIN Discount AS D ON D.Id = P.Discount_Id
        WHERE P.NameVI LIKE '%${key}%' OR P.NameEN LIKE '%${key}%'
        ORDER BY 
        P.Created DESC;
        `);
        resolve({
          items: result.recordset,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createDescProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.IdProduct) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const idProduct = data.IdProduct;

        const descVI = JSON.parse(data.descVI);
        const descEN = JSON.parse(data.descEN);
        const basicInforVI = JSON.parse(data.basicInforVI);
        const basicInforEN = JSON.parse(data.basicInforEN);
        const pool = await connectDB();

        if (data.action === "create") {
          const id_Description = await generateRandomString(10);
          const result = await pool
            .request()
            .input("Id_Description", mssql.VarChar, id_Description)
            .input("Id_Product", mssql.VarChar, idProduct)
            .input("Config_VI", mssql.VarChar, basicInforVI)
            .input("Config_EN", mssql.VarChar, basicInforEN)
            .input("Des_Details_VI", mssql.NText, descVI)
            .input("Des_Details_EN", mssql.Text, descEN).query(`
            INSERT INTO DesProduct (Id_Description, Id_Product, Config_VI, Config_EN, Des_Details_VI, Des_Details_EN)
            SELECT @Id_Description, @Id_Product, @Config_VI, @Config_EN, @Des_Details_VI, @Des_Details_EN
            WHERE NOT EXISTS (
                SELECT 1 FROM DesProduct AS D WHERE D.Id_Product = @Id_Product
            );`);
          if (result.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              errMessage: "Create data successfull",
            });
          } else {
            resolve({
              err: 1,
              errMessage: "Create failed",
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getDescProduct = (idProduct) => {
  return new Promise(async (resovle, reject) => {
    try {
      if (!idProduct) {
        resovle({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const resultdata = await pool
          .request()
          .query(`SELECT * FROM DesProduct WHERE Id_Product = '${idProduct}' `);
        resovle({
          items: resultdata.recordset,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getProductRatingServices = (idProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idProduct) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool.request().query(`
          SELECT  R.* ,U.UserName
          FROM Rating_Product AS R
          JOIN Users AS U ON U.UserID = R.UserID
          WHERE R.Id_Product = '${idProduct}'
       
        `);
        resolve({
          err: 0,
          items: result.recordset,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getRankRatingProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await connectDB();
      const result = await pool.request().query(
        `
        SELECT TOP 5
    R.Id_Product, I.Image , P.NameVI , P.NameEN ,
    SUM(CASE WHEN R.StartRating = 1 THEN 1 ELSE 0 END) AS Rating_1,
    SUM(CASE WHEN R.StartRating = 2 THEN 1 ELSE 0 END) AS Rating_2,
    SUM(CASE WHEN R.StartRating = 3 THEN 1 ELSE 0 END) AS Rating_3,
    SUM(CASE WHEN R.StartRating = 4 THEN 1 ELSE 0 END) AS Rating_4,
    SUM(CASE WHEN R.StartRating = 5 THEN 1 ELSE 0 END) AS Rating_5,
    COUNT(*) AS TotalRatings,
    (SUM(CASE WHEN R.StartRating = 1 THEN 1 ELSE 0 END) * 1 +
     SUM(CASE WHEN R.StartRating = 2 THEN 1 ELSE 0 END) * 2 +
     SUM(CASE WHEN R.StartRating = 3 THEN 1 ELSE 0 END) * 3 +
     SUM(CASE WHEN R.StartRating = 4 THEN 1 ELSE 0 END) * 4 +
     SUM(CASE WHEN R.StartRating = 5 THEN 1 ELSE 0 END) * 5) /
     COUNT(*) AS AverageRating
FROM
    Rating_Product AS R
JOIN Image_Product as I ON I.Id_Product = R.Id_Product
JOIN Product as P ON P.Id = R.Id_Product
GROUP BY
    R.Id_Product,
     I.Image , P.NameVI , P.NameEN 
ORDER BY
    AverageRating DESC, TotalRatings DESC;

    `
      );

    } catch (e) {
      console.log(e);
      reject;
    }
  });
};

const createNewOptionInEdit = (idProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idProduct) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        const Id = idProduct
        const IdInventory = Date.now() + "I@" + uuidv4();
        const Quantity = 0
        const Price = 0

        const pool = await connectDB()
        const result = await pool.request()
          .input('Id_Product', mssql.VarChar, Id)
          .input('Id', mssql.VarChar, IdInventory)
          .input('Quantity', mssql.Int, Quantity)
          .input('Price', mssql.Int, Price)
          .query(`INSERT INTO  Product_Inventory (Id_Product , Id ,Quantity ,Price)
                  SELECT @Id_Product , @Id , @Quantity , @Price
          `)

        if (result.rowsAffected[0] === 1) {
          resolve({
            err: 0,
            IdInventory: IdInventory
          })
        } else {
          resolve({
            err: 1,
            errMessage: 'Create Inventory failed'
          })
        }

      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

const deleteOptionInEdit = (IdInventory) => {

  console.log(IdInventory)
  return new Promise(async (resolve, reject) => {
    try {
      if (!IdInventory) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        const Id = IdInventory
        const pool = await connectDB()
        const getImage = await pool.request().input('Id', mssql.VarChar, Id)
          .query(`SELECT Image FROM  Image_Product WHERE  Product_Inventory = @Id `)

        const deleteItem = await pool.request()
          .input('Id', mssql.VarChar, Id)
          .query(`
            DELETE FROM Image_Product WHERE Product_Inventory = @Id;
            DELETE FROM Product_Inventory WHERE Id = @Id
          `);

        // console.log(deleteItem)


        if (deleteItem.rowsAffected[1] > 0) {
          if (getImage.recordset.length > 0) {
            const listImage = getImage.recordset.map((item) => {
              const splitImage = item.Image
              return splitImage
            })
            listImage.map((item) => {
              RemoveImage(item)
            })
          }
          resolve({
            err: 0,
            errMessage: 'DeleteItems successful'
          })
        } else {
          resolve({
            err: 1,
            errMessage: 'Items is already in cart'
          })
        }
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

export const editProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        // const category_Id = aboutProduct.category.join(",");
        const dataProduct = await JSON.parse(data.dataProduct)

        console.log("dataProduct", dataProduct)

        const IdProduct = dataProduct.idProduct
        const nameVI = dataProduct.nameVI
        const nameEN = dataProduct.nameEN
        const brandId = dataProduct.brandId
        const type_Product = dataProduct.category
        const category_Id = dataProduct.listTag.join(",")
        const discount = dataProduct.discountId ? dataProduct.discountId : 0

        const pool = await connectDB()

        const saveInforProduct = await pool.request()
          .input('Id', mssql.VarChar, IdProduct)
          .input('NameVI', mssql.NVarChar, nameVI)
          .input('NameEN', mssql.VarChar, nameEN)
          .input('Brand_Id', mssql.VarChar, brandId)
          .input('Category_Id', mssql.VarChar, category_Id)
          .input('Type_Product', mssql.VarChar, type_Product)
          .input('Discount_Id', mssql.VarChar, discount)
          .query(`UPDATE Product
          SET 
              NameVI = @NameVI,
              NameEN = @NameEN,
              Brand_Id = @Brand_Id,
              Category_Id = @Category_Id,
              Type_Product = @Type_Product,
              Discount_Id = @Discount_Id
          WHERE
              Id = @Id
              AND NOT EXISTS (
                  SELECT 1
                  FROM Product as p
                  WHERE
                      p.NameVI = @NameVI
                      AND p.NameEN = @NameEN
                      AND p.Brand_Id = @Brand_Id
                      AND p.Category_Id = @Category_Id
                      AND p.Type_Product = @Type_Product
                      AND p.Id <> @Id
              );`)

        if (saveInforProduct.rowsAffected[0] === 1) {
          if (data.imageProduct) {
            const imageBase64 = JSON.parse(data.imageProduct).split(";base64,").pop()
            const nameImage = data.filename

            const saveImage = await saveImageToFolder(
              imageBase64,
              nameImage,
              "product"
            );
            await pool.request().input('Id', mssql.VarChar, IdProduct).query(` UPDATE Image_Product SET Image ='${saveImage}' WHERE Id_Product = @Id  `)
          }

          const dataOtion = dataProduct.listIventory

          if (dataOtion.length > 0) {
            dataOtion.map(async (item) => {
              const Id_Inventory = item.Id;
              const quantity = item.Quantity || 0;
              const price = item.Price || 0;
              const color = item.Color;
              const size = Array.isArray(item.Size) && item.Size.length > 0 ? item.Size.join(',') : null;
              const screenSize = Array.isArray(item.screenSize) && item.screenSize.length > 0 ? item.screenSize.join(',') : null;
              const memory = Array.isArray(item.memory) && item.memory.length > 0 ? item.memory.join(',') : null;
              const scanFrequency = Array.isArray(item.scanFrequency) && item.scanFrequency.length > 0 ? item.scanFrequency.join(',') : null;
              const screenType = Array.isArray(item.screenType) && item.screenType.length > 0 ? item.screenType.join(',') : null;

              await pool.request()
                .input('Id_Product', mssql.VarChar, IdProduct)
                .input('Id', mssql.VarChar, Id_Inventory)
                .input('Size', mssql.VarChar, size)
                .input('Color', mssql.VarChar, color)
                .input('Quantity', mssql.Int, quantity)
                .input('Price', mssql.Decimal, price)
                .input('screenSize', mssql.VarChar, screenSize)
                .input('memory', mssql.VarChar, memory)
                .input('scanFrequency', mssql.VarChar, scanFrequency)
                .input('screenType', mssql.VarChar, screenType)
                .query(`UPDATE Product_Inventory  
                        SET 
                          Size = @Size ,
                          Color = @Color ,
                          Quantity = @Quantity ,
                          Price = @Price ,
                          screenSize = @screenSize ,
                          memory = @memory ,
                          scanFrequency = @scanFrequency ,
                          screenType = @screenType
                        WHERE Id_Product = @Id_Product AND Id = @Id
                `)


              // console.log("Update...", updateInventory.rowsAffected)
            })


          }
          resolve({
            err: 0,
            errMessage: 'Update Items successfull'
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
  createProduct,
  getAllProductServices,
  getProductByIdServices,
  getAllProductServicesByTags,
  getAllProductByType_Product,
  getAllProductByType_ProductNew,
  handleOnSearchProduct,
  createDescProduct,
  getDescProduct,
  getProductRatingServices,
  getRankRatingProduct,
  getAllProductServicesEdit,
  createNewOptionInEdit,
  deleteOptionInEdit,
  editProduct
};
