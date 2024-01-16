import mssql from "mssql";
import { connectDB } from "../../connectDB/index.js";
import { v4 as uuidv4 } from "uuid";
import {
  checkPasswordUser,
  validateEmail,
  hashUserPassword,
} from "../../component/checkInformation.js";
import jwt from "../../component/jwt.js";
import {
  createPasswordChangeToken,
  generateRandomString,
  randomInterger,
} from "../../component/random.js";
import moment from "moment";
import sendEmail from "../../component/formemail.js";
import { RegisterUser, fomatForgetPassword } from "../../until/formHtml.js";
import crypto from "crypto";
import uniqidToken from "uniqid";

let RegisterUserService = (data) => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.Email | !data.Password) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        let checkEmail = validateEmail(data.Email);
        let checkValidatePass = checkPasswordUser(data.Password);
        if (!checkEmail | !checkValidatePass) {
          resolve({
            err: 1,
            errMessage: "Email or Password is not validate",
          });
        } else {
          let pool = await connectDB();
          let UserId = uuidv4();
          let UserName = data.UserName;
          let Email = data.Email;
          let Password = await hashUserPassword(data.Password);
          let RoleId = "User";
          let Gender = data.Gender;
          let IsActive = false;
          let CreatedAt = new Date();
          let UpdatedAt = new Date();
          let tokenRegister =
            uniqidToken() + "###" + new Date().toLocaleString();

          let saveUser = await pool
            .request()
            .input("UserId", mssql.VarChar, UserId)
            .input("UserName", mssql.NVarChar, UserName)
            .input("Password", mssql.VarChar, Password)
            .input("Email", mssql.VarChar, Email)
            .input("RoleId", mssql.VarChar, RoleId)
            .input("Gender", mssql.VarChar, Gender)
            .input("IsActive", mssql.Bit, IsActive)
            .input("CreatedAt", mssql.DateTime, CreatedAt)
            .input("UpdatedAt", mssql.DateTime, UpdatedAt)
            .input("RegisterToken", mssql.VarChar, tokenRegister).query(`
                        INSERT INTO Users (UserId, UserName, Password, Email, RoleId, Gender, IsActive, CreatedAt ,UpdatedAt ,RegisterToken)
                        SELECT 
                            @UserId, @UserName, @Password, @Email, @RoleId, @Gender, @IsActive, @CreatedAt,@UpdatedAt, @RegisterToken
                        WHERE NOT EXISTS (
                            SELECT 1 FROM Users WHERE Email = @Email
                        );
                        `);

          if (saveUser.rowsAffected && saveUser.rowsAffected[0] > 0) {
            resolve({
              err: 0,
              errMessage: "Create User Success",
            });

            const originalData = tokenRegister;
            const secretKey = process.env.JWT_SECRET;
            const cipher = crypto.createCipher("aes-256-cbc", secretKey);
            let encryptedData = cipher.update(originalData, "utf-8", "hex");
            encryptedData += cipher.final("hex");

            const html = RegisterUser(encryptedData);
            await sendEmail(Email, html);
          } else {
            resolve({
              err: 2,
              errMessage: "Create User Failed",
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

let getCurrentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data._id) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        let pool = await connectDB();
        let IdUser = data._id;
        let result = await pool
          .request()
          .query(`SELECT * FROM Users WHERE UserID = '${IdUser}'`);
        if (result.rowsAffected[0] > 0) {
          resolve({
            dataUser: result.recordset[0],
          });
        } else {
          resolve({
            err: 1,
            errMessage: "No users found",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const refreshNewAccessTokenService = (id, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await connectDB();
      let result = await pool.request().query(
        `
      SELECT S.* , U.RoleId 
      FROM UserSessions  as S
      JOIN Users AS U ON U.UserID  = S.UserID
      WHERE  
      S.UserID = '${id}' AND S.Token = '${token}' `
      );

      if (result.rowsAffected[0] === 1) {
        const roleUser = result.recordset[0].RoleId;
        const newAccessToken = await jwt.generateAccessToken(id, roleUser);
        if (newAccessToken)
          resolve({
            err: 0,
            errMessage: "Create new AccessToken Successfull",
            newAccessToken,
          });

        resolve({
          err: 1,
          errMessage: "Create new AccessToken Failed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const forgotPasswordServices = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getToken = createPasswordChangeToken();
      const pool = await connectDB();
      const validateExpries = moment(getToken.passwordResetExpires).format(
        "YYYY-MM-DD HH:mm:ss.SSS"
      );
      let result = await pool
        .request()
        .input("ResetToken", mssql.VarChar, getToken.passwordResetToken)
        .input("ResetTokenExpries", mssql.DateTime, validateExpries)
        .query(`UPDATE Users
                SET ResetToken = @ResetToken , ResetTokenExpries =  @ResetTokenExpries
                WHERE Email = '${email}'

        `);

      if (result.rowsAffected[0] === 1) {
        let datacontent = {
          language: "en",
          token: getToken.resetToken,
        };
        const html = fomatForgetPassword(datacontent);
        let data = await sendEmail(email, html);

        if (data.messageId) {
          resolve({
            err: 0,
            errMessage: "Request send successful",
          });
        } else {
          resolve({
            err: 2,
            errMessage: "Request send failed",
          });

          await pool.request().query(`UPDATE Users
                  SET ResetToken = NULL , ResetTokenExpries =  NNULL
                  WHERE Email = '${email}'
          `);
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const resetPasswordServices = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.password) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      }

      const hashToken = crypto
        .createHash("SHA256")
        .update(data.token)
        .digest("hex");
      const pool = await connectDB();
      const resultUser = await pool.query(
        `SELECT * FROM Users WHERE ResetToken = '${hashToken}'`
      );

      if (resultUser.rowsAffected[0] === 1) {
        const ResetTokenExpries = moment(
          resultUser.recordset[0].ResetTokenExpries
        ).format("YYYY-MM-DD HH:mm");
        const IdUser = resultUser.recordset[0].UserID;

        const newDate = moment(Date.now()).format("YYYY-MM-DD HH:mm");

        if (newDate > ResetTokenExpries) {
          resolve({
            err: 1,
            errMessage: "Time has expired, please resubmit a new request ",
          });
        } else {
          const hashpassword = await hashUserPassword(data.password);
          const resultUpdate = await pool
            .request()
            .input("Password", mssql.VarChar, hashpassword)
            .query(`UPDATE  Users 
                    SET Password = @Password , ResetToken = NULL, ResetTokenExpries = NULL
                    WHERE UserID = '${IdUser}'
            `);

          if (resultUpdate.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              errMessage: "Change pass successfull",
            });
          } else {
            resolve({
              err: 2,
              errMessage: "Change pass faild",
            });
          }
        }
      } else {
        resolve({
          err: -1,
          errMessage: "Not found User",
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await connectDB();
      let result = await pool.query(
        `SELECT * FROM Users WHERE RoleId = 'User' `
      );
      resolve({
        err: 0,
        items: result.recordset,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool.query(`
        BEGIN TRANSACTION;
        DELETE FROM UserSessions WHERE UserID = '${id}';
        DELETE FROM Users WHERE UserID = '${id}';
        COMMIT;
          `);
        if (result.rowsAffected[0] === 1 || result.rowsAffected[1] === 1) {
          resolve({
            err: 0,
            errMessage: "Delete Successfull",
          });
        } else {
          resolve({
            err: 1,
            errMessage: "Detelet failed",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (data, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || Object.keys(data).length === 0) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool.query(`
          UPDATE Users 
          SET UserName = '${data.UserName}',
              Gender   = '${data.gender}
          WHERE UserId = '${id}'`);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createNewCartServices = (data, _id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !_id) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const IdCart = randomInterger();
        const UserId = _id;
        const Quantity = data.quantity;
        const Price = data.price;
        const Discount = data.discount
        const ProductId = data.product_Inv;
        const CreatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm");
        const UpdatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm");
        const OrderId = data.OrderId;
        const Options = data.option;
        const StatusCart = "Wait";
        const pool = await connectDB();
        const result = await pool
          .request()
          .input("CartID", mssql.Int, IdCart)
          .input("UserId", mssql.VarChar, UserId)
          .input("Quantity", mssql.Int, Quantity)
          .input("Price", mssql.Int, Price)
          .input("Product", mssql.VarChar, ProductId)
          .input("CreatedAt", mssql.DateTime, CreatedAt)
          .input("UpdatedAt", mssql.DateTime, UpdatedAt)
          .input("OrderId", mssql.VarChar, OrderId)
          .input("StatusCart", mssql.VarChar, StatusCart)
          .input("Options", mssql.VarChar, Options)
          .input("Discount", mssql.VarChar, Discount)
          .query(`
          MERGE INTO Cart AS target
          USING (VALUES (@Product, @UserId ,@StatusCart , @Options )) AS source (ProductID, UserID, StatusCart ,Options )
          ON target.ProductID = source.ProductID AND target.UserID = source.UserID AND target.StatusCart = 'Wait' AND target.Options = source.Options
          WHEN MATCHED THEN
              UPDATE SET
                  Quantity = target.Quantity + @Quantity,
                  Price = @Price, -- Cập nhật giá tiền
                  UpdatedAt = @UpdatedAt,
                  Options = @Options
          WHEN NOT MATCHED THEN
              INSERT (CartID, UserID, ProductID, Quantity, Price, CreatedAt, UpdatedAt, OrderID , StatusCart , Options , Discount)
              VALUES (@CartID, @UserId, @Product, @Quantity, @Price, @CreatedAt, @UpdatedAt, @OrderId ,@StatusCart, @Options , @Discount);`);

        if (result.rowsAffected[0] === 1) {
          resolve({
            err: 0,
            errMessage: "Add product to cart Successfull",
          });
        } else {
          resolve({
            err: 1,
            errMessage: "Add Product to cart Failed",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getAllItemInCartServices = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool.request().input("UserID", mssql.VarChar, id)
          .query(`SELECT 
                        C.*, 
                        P.Type_Product ,
                        PI.Id_Product as Product,
                        PI.Quantity as Stock,
                        I.Image ,
                        P.NameVI, 
                        P.NameEN,
                        D.Discount_Percent

                FROM Cart AS C 
                JOIN Product_Inventory AS PI ON PI.Id = C.ProductID  
                JOIN Product AS P ON P.Id = PI.Id_Product
                JOIN Image_Product as I ON PI.Id_Product = I.Id_Product
                JOIN Discount as D ON D.Id =  P.Discount_Id
                WHERE C.UserID = @UserID AND C.StatusCart = 'Wait'
                ORDER BY 
                C.CreatedAt DESC
          
          `);

        if (result.rowsAffected[0] > 0) {
          resolve({
            err: 0,
            errMessage: "Get Item In cart successfull",
            items: result.recordset,
          });
        } else if (result.rowsAffected[0] === 0) {
          resolve({
            err: 0,
            errMessage: "Items empty",
            items: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const addAddressUser = (data, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !id) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const idAddress = generateRandomString(5);
        const userId = id;
        const line1 = data.specificAddress;
        const Ward = data.userWard;
        const District = data.userDistrict;
        const City = data.userCity;
        const UserName = data.userName;
        const PhoneNumber = data.phoneNumber;
        const Default = 0;
        const pool = await connectDB();
        const result = await pool
          .request()
          .input("Id_Address", mssql.VarChar, idAddress)
          .input("UserID", mssql.VarChar, userId)
          .input("Line1", mssql.NVarChar, line1)
          .input("City", mssql.NVarChar, City)
          .input("District", mssql.NVarChar, District)
          .input("Ward", mssql.NVarChar, Ward)
          .input("UserName", mssql.NVarChar, UserName)
          .input("PhoneNumber", mssql.VarChar, PhoneNumber)
          .input("IsDefault", mssql.Bit, Default).query(`
                  INSERT INTO AddressUser (Id_Address, UserID, Line1, Ward, District, City, UserName, PhoneNumber, IsDefault)
                  SELECT 
                    @Id_Address, @UserID, @Line1, @Ward, @District, @City, @UserName, @PhoneNumber, @IsDefault
                  WHERE NOT EXISTS (
                    SELECT 1
                    FROM AddressUser AS A
                    WHERE A.Id_Address <> @Id_Address
                      AND A.Line1 = @Line1
                      AND A.Ward = @Ward
                      AND A.District = @District
                      AND A.City = @City
                      AND A.UserName = @UserName
                      AND A.PhoneNumber = @PhoneNumber
                    )`);
        if (result.rowsAffected[0] === 1) {
          resolve({
            err: 0,
            errMessage: "Create Address successfull",
          });
        } else {
          resolve({
            err: 1,
            errMessage: "Create address false",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllAddressUser = (idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idUser) {
        resolve({
          err: 1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool
          .request()
          .input("UserID", mssql.VarChar, idUser)
          .query(`SELECT A.* FROM AddressUser AS A WHERE A.UserID = @UserID `);
        resolve({
          err: 0,
          errMessage: "Get list address User successfull",
          items: result.recordset,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getListOrderByUserServices = (UserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!UserId) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool
          .request()
          .input("Order_By", mssql.VarChar, UserId).query(`
          SELECT 
          O.*, 
          C.*,
          P.Id,
          P.NameVI, P.NameEN,B.NameBrand,I.Image as Image
          FROM Orders AS O                  
          JOIN Cart AS C ON C.OrderID = O.Id_Order
          JOIN Product_Inventory AS PI ON PI.Id = C.ProductID
          JOIN Product as P ON P.Id = PI.Id_Product
          JOIN Brands  as B ON B.IdBrand = P.Brand_Id
          LEFT JOIN (
              SELECT Product_Inventory, STRING_AGG(Image, ', ') AS Image
              FROM Image_Product
              GROUP BY Product_Inventory
          ) AS I ON I.Product_Inventory = C.ProductID

          WHERE O.Order_By = @Order_By;   
          `);

        /*
        JOIN Product AS P ON P.Id  = C.ProductID
          LEFT JOIN (
              SELECT Product_Inventory, STRING_AGG(Image, ', ') AS Image
              FROM Image_Product
              GROUP BY Product_Inventory
          ) AS I ON I.Product_Inventory = C.ProductID
        */

        console.log(result.recordset);

        resolve({
          err: 0,
          errMessage: "Get Data Successfull",
          items: result.recordset,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCartItem = (data, id) => {

  console.log("Item in cart .....", data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.key) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        const keyCart = data.key.split('-')[0]
        const quantity = data.key.split('-')[1]
        if (quantity && quantity !== 'null' && quantity !== null) {
          const pool = await connectDB()
          const checkQuantity = await pool.request().query(`
              SELECT PI.Quantity 
              FROM Product_Inventory AS PI
              JOIN Cart as C ON C.ProductID =  PI.Id
              WHERE C.CartID = '${keyCart}'
            `)
          const quantityProduct = checkQuantity.recordset[0].Quantity
          console.log(checkQuantity.recordset[0].Quantity)
          if (quantityProduct === 0) {
            resolve({
              err: -1,
              errMessage: 'Product empty'
            })
          }
          else if (quantityProduct > quantity) {
            await pool.request().query(
              `UPDATE  Cart SET  Quantity = '${quantity}' WHERE CartID = '${keyCart}' AND UserID = '${id}' `
            );
            resolve({
              err: 0,
            });
          } else if (quantity > quantityProduct) {
            await pool.request().query(
              `UPDATE  Cart SET  Quantity = '${quantityProduct}' WHERE CartID = '${keyCart}' AND UserID = '${id}' `
            );
            resolve({
              err: 2,
              errMessage: `Max Items is ${quantityProduct}`,
              max: quantityProduct
            })
          }

        }
      }
    } catch (e) {
      reject(e)
    }
  })


};

const GetListOrderAdmin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await connectDB();
      const result = await pool.request().query(`
      SELECT O.*, C.Quantity, U.UserName
      FROM [Eccommerce].[dbo].[Orders] AS O
      JOIN [Eccommerce].[dbo].[Users] AS U ON U.UserID = O.Order_By
      JOIN (
          SELECT OrderID, SUM(Quantity) AS Quantity
          FROM [Eccommerce].[dbo].[Cart]
          GROUP BY OrderID
      ) AS C ON O.Id_Order = C.OrderID
      WHERE O.Id_Order IN (SELECT DISTINCT OrderID FROM [Eccommerce].[dbo].[Cart]);
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

const changeStatusOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.status) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool
          .request()
          .input("Id_Order", mssql.VarChar, data.id)
          .input("StatusOrder", mssql.VarChar, data.status).query(`UPDATE 
                  Orders SET StatusOrder = @StatusOrder 
                  WHERE Id_Order = @Id_Order  `);

        if (result.rowsAffected[0] === 1) {
          resolve({
            err: 0,
            errMessage: "Update successfull",
          });
          if (data.status === "Accepted") {
            const transaction = await pool
              .request()
              .input("Id_Order", mssql.VarChar, data.id).query(` 
              UPDATE PI
              SET PI.Quantity = PI.Quantity - C.Quantity  
              FROM Product_Inventory AS PI

              JOIN Cart AS C ON PI.Id = C.ProductID
              JOIN Orders AS O ON O.Id_Order = C.OrderID
              WHERE O.Id_Order = @Id_Order AND PI.Quantity - C.Quantity >= 0
            `);
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const createRatingProduct = (data, id) => {
  console.log(data);

  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !id) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const idRating = generateRandomString(5);
        const IdProduct = data.id_Product;
        const IdUser = id;
        const StartRating = data.start;
        const Comment = data.content;
        const date = new Date();

        const resultSaveCmd = await pool
          .request()
          .input("Rating_Id", mssql.VarChar, idRating)
          .input("Id_Product", mssql.VarChar, IdProduct)
          .input("UserID", mssql.VarChar, IdUser)
          .input("StartRating", mssql.Int, StartRating)
          .input("Comment", mssql.NText, Comment)
          .input("CreatedAt", mssql.DateTime, date).query(`
            INSERT INTO Rating_Product (Rating_Id,Id_Product,UserID,StartRating,Comment,CreatedAt)
            SELECT @Rating_Id, @Id_Product ,@UserID, @StartRating,  @Comment,  @CreatedAt       
            WHERE NOT EXISTS (
              SELECT 1 FROM Rating_Product AS R WHERE R.UserID = @UserID AND R.Id_Product =  @Id_Product
            ) 
          `);
        if (resultSaveCmd.rowsAffected[0] === 1) {
          resolve({
            err: 0,
            errMessage: "Create Message success",
          });

          await pool.request().query(`
                                    UPDATE Product  SET 
                                    totalRating = totalRating + 1 
                                    WHERE Id = '${IdProduct}'`);
        } else {
          resolve({
            err: 1,
            errMessage: "COmment already exitst",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};



export const comfirmEmailRegister = (key) => {
  console.log("key....", key);

  return new Promise(async (resolve, reject) => {
    try {
      if (!key) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const decipher = crypto.createDecipher(
          "aes-256-cbc",
          process.env.JWT_SECRET
        );
        let decryptedData = decipher.update(key, "hex", "utf-8");
        decryptedData += decipher.final("utf-8");

        const timeOut = decryptedData.split("###")[1];
        const currentTime = new Date();
        const timeoutTime = new Date(timeOut);

        const timeDifference = (timeoutTime - currentTime) / (1000 * 60);
        const pool = await connectDB();

        if (Math.abs(timeDifference) < 15) {
          const result = await pool.request().query(`
            SELECT * FROM Users 
            WHERE RegisterToken = '${decryptedData}'`);
          if (result.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              errMessage: "Register successful",
            });
          } else {
            resolve({
              err: 1,
              errMessage: "Register failed",
            });
          }
        } else {
          const result1 = await pool.request().query(`
            DELETE FROM Users
            WHERE RegisterToken = '${decryptedData}'`);
          if (result1.rowsAffected[0] === 1) {
            resolve({
              err: 0,
              errMessage: "Token expired",
            });
          } else {
            resolve({
              err: -1,
              errMessage: "Delete failed",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getTotalUserActive = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await connectDB();
      const result = await pool.request().query(`
      SELECT COUNT(*) AS TotalActiveUsers  
      FROM  Users 
      WHERE IsActive = 1 AND RoleId = 'User';
      `);
      const totalUser = await pool.request().query(`
      SELECT COUNT(*) AS TotalUser
      FROM  Users 
      `);

      const totalPrice = await pool.request().query(`
      SELECT SUM(TotalPrice) AS TotalOrderPrice ,
      COUNT(*) AS TotalOrders
      FROM Orders;
      `);

      resolve({
        err: 0,
        activeUsers: result.recordset[0].TotalActiveUsers,
        totalUsers: totalUser.recordset[0].TotalUser,
        totalPrice: totalPrice.recordset[0].TotalOrderPrice,
        TotalOrders: totalPrice.recordset[0].TotalOrders,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getInforUserById = (idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idUser) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const getListOrder = await pool.request().query(`
        SELECT O.* ,
        (
          SELECT SUM(C.Quantity) AS TotalQuantity
          FROM Cart AS C
          WHERE C.OrderID = O.Id_Order
          FOR JSON PATH
      ) AS CartList
        FROM Orders  AS O
        WHERE  Order_By = '${idUser}'
        `);

        const getListAddress = await pool.request()
          .query(`SELECT  * FROM AddressUser
                  WHERE  UserID = '${idUser}'`);
        resolve({
          err: 0,
          errMessage: "Getdataa successfull",
          addressUser: getListAddress.recordset,
          orderUser: getListOrder.recordset,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getInforAboutOrderServices = (keyOrder) => {
  console.log(keyOrder)
  return new Promise(async (resolve, reject) => {
    try {
      if (!keyOrder) {
        resolve({
          err: -1,
          errMessage: "Missing data required",
        });
      } else {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT
            O.*,
            U.UserName,
            U.Email,
            A.PhoneNumber,
            (
                SELECT
                    C.ProductID,
                    C.Quantity,
                    C.Price,
                    C.StatusCart,
                    C.Options,
                    C.Discount,
                    D.Discount_Percent,
                    P.NameEN,
                    (
                        SELECT I.Image
                        FROM Image_Product AS I
                        WHERE I.Product_Inventory = C.ProductID
                        FOR JSON PATH
                    ) AS ListImage
                FROM
                    Cart AS C
                    JOIN Discount AS D ON D.Id = C.Discount
                    JOIN Product_Inventory AS PI ON PI.Id = C.ProductID
                    JOIN Product AS P ON P.Id = PI.Id_Product
                WHERE
                    C.OrderID = '${keyOrder}'
                FOR JSON PATH
            ) AS CartList
            FROM
            Orders AS O
            JOIN AddressUser AS A ON A.Id_Address = O.AddressId
            JOIN Users AS U ON U.UserID = O.Order_By
            WHERE
            O.Id_Order = '${keyOrder}'
        `);


        console.log(result.recordset)
        // console.log('SSS', result)
        resolve({
          items: result.recordset || [],
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const deleteItemInCart = (key, idUser) => {
  console.log("key,,,,", key)
  return new Promise(async (resolve, reject) => {
    try {
      if (!key || !idUser) {
        resolve({
          err: -1,
          errMessage: "Missing data required"
        })
      } else {
        const pool = await connectDB()
        const result = await pool.request().query(`
          Update Cart 
          SET StatusCart = 'Delete' 
          WHERE CartID = ${key} 
          AND UserID = '${idUser}'
          `)
        console.log("Delete item in cart", result)
        if (result.rowsAffected[0] === 1) {
          resolve({
            err: 0,
            errMessage: 'Delete items in cart Success'
          })
        } else {
          resolve({
            err: 1,
            errMessage: 'Delete items in cart failed'
          })
        }

      }
    } catch (e) {
      reject(e)
    }
  })
}

const updateProfileByUser = (data, idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !idUser) {
        resolve({
          err: -1,
          errMessage: 'Missing data required'
        })
      } else {
        const pool = await connectDB()
        const userName = data.userName
        const gender = data.gender
        const Id = idUser

        const result = await pool.request()
          .input('UserName', mssql.NVarChar, userName)
          .input('Gender', mssql.VarChar, gender)
          .input('UserID', mssql.VarChar, Id)
          .query(`
        UPDATE Users 
        SET UserName = @UserName , Gender = @Gender 
        WHERE UserID = @UserID
        `)

        if (result.rowsAffected[0] === 1) {
          resolve({
            err: 0,
            errMessage: 'Update information success'
          })
        } else {
          resolve({
            err: 1,
            errMessage: 'Update information failed'
          })
        }

      }
    } catch (e) {
      reject(e)
    }
  })
}

export default {
  RegisterUserService,
  getCurrentService,
  refreshNewAccessTokenService,
  forgotPasswordServices,
  resetPasswordServices,
  getAllUsers,
  deleteUser,
  updateUser,
  createNewCartServices,
  getAllItemInCartServices,
  addAddressUser,
  getAllAddressUser,
  getListOrderByUserServices,
  updateCartItem,
  GetListOrderAdmin,
  changeStatusOrder,
  createRatingProduct,
  comfirmEmailRegister,
  getTotalUserActive,
  getInforUserById,
  getInforAboutOrderServices,
  deleteItemInCart,
  updateProfileByUser
};


// SELECT
// O.*,
// U.UserName,
// U.Email,
// A.PhoneNumber,
// (
//     SELECT
//         C.ProductID,
//         C.Quantity,
//         C.Price,
//         C.StatusCart,
//         C.Options,
//         C.Discount,
//         D.Discount_Percent,
//         P.NameEN,
//         (
//             SELECT I.Image
//             FROM Image_Product AS I
//             WHERE I.Product_Inventory = C.ProductID
//             FOR JSON PATH
//         ) AS ListImage
//     FROM
//         Cart AS C
//         JOIN Discount AS D ON D.Id = C.Discount
//         JOIN Product_Inventory AS PI ON PI.Id = C.ProductID
//         JOIN Product AS P ON P.Id = PI.Id_Product
//     WHERE
//         C.OrderID = '${keyOrder}'
//     FOR JSON PATH
// ) AS CartList
// FROM
// Orders AS O
// JOIN AddressUser AS A ON A.Id_Address = O.AddressId
// JOIN Users AS U ON U.UserID = O.Order_By
// WHERE
// O.Id_Order = '${keyOrder}'