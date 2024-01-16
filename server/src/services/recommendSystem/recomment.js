import * as tf from "@tensorflow/tfjs";
import { connectDB } from "../../connectDB/index.js";

import axios from "axios";

// const pythonAPTUrl = 'http://localhost:5000'

async function getProductbyId(arr) {
  try {
    const pool = await connectDB();
    const products = [];
    for (const productId of arr) {
      const formattedProductId = `${productId.substring(
        0,
        13
      )}@${productId.substring(13, 21)}-${productId.substring(
        21,
        25
      )}-${productId.substring(25, 29)}-${productId.substring(
        29,
        33
      )}-${productId.substring(33)}`;
      const request = await pool.request().query(`
                SELECT 
                P.Id, P.NameVI, P.NameEN , P.Category_Id , P.Brand_Id , Discount_Id ,
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
        WHERE P.Id LIKE '%${formattedProductId}%'
            `);
      products.push(...request.recordset);
    }
    // console.log(products)

    return products;
  } catch (e) {
    console.log(e);
  }
}

const getRecommendationForUser = (user_Id) => {
  // console.log("UserId" , user_Id)

  const user = user_Id || "default_user_id";
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_recommendations?user_id=${user}`
      );

      console.log(resolve);

      if (resolve) {
        const result = await getProductbyId(response.data);

        resolve({
          err: 0,
          errMessage: "get data successfull",
          items: result,
        });
      } else {
        resolve({
          err: 1,
          items: [],
        });
      }

      // This will log the data received from the server
    } catch (error) {
      // console.log(error);
      resolve({
        errMessage: "Cannot connect pythonRecommned",
        items: [],
      });
    }
  });
};

const getDataByRating = async (idUser) => {
  console.log("reponsive....");
  return new Promise(async (resolve, reject) => {
    try {
      if (!idUser) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
          items: [],
        });
      } else {
        const pool = await connectDB()
        const response = await axios.get(
          `http://127.0.0.1:5000/get_recommendations_product?user_id=${idUser}`
        );
        const products = [];
        if (response.data.recommendations.length > 0) {
          const getDataReccommend = response.data.recommendations;
          for (const productId of getDataReccommend) {
            const Id = productId.Id;

            const formattedProductId = `${Id.substring(0, 13)}@${Id.substring(
              13,
              21
            )}-${Id.substring(21, 25)}-${Id.substring(25, 29)}-${Id.substring(
              29,
              33
            )}-${Id.substring(33)}`;

            const request = await pool.request().query(`
                SELECT 
                P.Id, P.NameVI, P.NameEN , P.Category_Id , P.Brand_Id , Discount_Id ,
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
        WHERE P.Id LIKE '%${formattedProductId}%'
            `);
            products.push(...request.recordset);
          }

          console.log("Product....", products)
      resolve({
          items: products,
        });
        }
      resolve({
          items: products,
        });
       
      }
    } catch (e) {
      reject(e);
    }
  });
};

export default { getRecommendationForUser, getDataByRating };
