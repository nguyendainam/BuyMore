import mssql from 'mssql'
import { connectDB } from "../../connectDB/index.js";

const productIds = [
    "1703126715623@735dcc7f-dba6-4ad8-9d3e-00f1eb6789ab",
    "1703127850435@75b107c9-3ef2-41a8-8dca-6eb4f4fb8c23",
    "1703390301996@dfa0a254-4811-4954-8f6c-95591c7e2b78",
    "1703390301996@dfa0a254-4811-4954-8f6c-95591c7e2b78",
    "1703390443481@18e2ba56-e345-4ae3-b492-7e9b2e754c25",
    "1703390570326@36ceb314-76f8-48ad-80a4-eb7c56b54fde",
    "1703390681655@ae8bb8a3-2864-487c-8242-81b3a6c369f0",
    "1703390808899@42eae738-0176-446e-9e51-9332b0a8be0f",
    "1703391377149@956755da-48db-4a8a-9fb6-936d95b95117",
    "1703391589318@23ccbb76-94bb-4a26-a359-69607a640c5b",
    "1703391684759@1cc407e4-6e32-40b4-81ab-4a0d04c894cd",
    "1703391918752@ec6f927b-e088-4138-83c0-6ac18cee2fdb",
    "1703392296004@a1e50d4f-4dc7-47ae-86af-bee2de900030",
    "1703392414918@53a2b515-1a46-4705-8c1d-41ebc2004171",
    "1703392598565@e52f9ee5-cc97-4add-8a01-b30c632c5524",
    "1703392762078@95647683-2da9-4d75-887b-54db44393aaf",
    "1703392902146@7b8b31c8-0e15-4ddf-9483-661d1da87565",
    "1703393264871@8edc08cf-5f93-4d8f-95bc-30d282fe786f",
    "1703393348441@943b4783-01ae-4d5b-bead-63868c487601",
    "1703393519478@2941cac3-a9d0-4fed-b355-697b95e9c47b",
    "1703393574431@3a163e07-781d-4d83-890e-b83480be1f9f",
    "1703399148795@0fb76890-25c6-4b09-b42c-16ddcc1edac3",
]; // Thêm các giá trị còn lại tương ứng
const typeProductsList = ["46Y9C1701872636414", "7VGep1701872370160", "DLLOl1701872343965", "HS7x81701872460473", "kHHEl1701872664938", "NIM4A1701872439140", "ohWrj1701872732060", "oi69S1701872585474", "qaqQT1701872501270", "QJSJc1701872697150", "ru84Z1701872609464", "U6qo11701872403027", "vByBl1701872192272", "wmMfa1701872241732", "Ysc5C1701872281623",
];

const brands = ["268808198", "372310249", "422552958", "440440234", "508187082", "887925229",
];

const custommer = [
    { USERID: "d00c8643-4fed-4084-8067-8acs13189asss", gender: "M", age: 18 },
    { USERID: "2eedb035-061b-427f-a554-06b69307b633 ", gender: "M", age: 22 },
    { USERID: "cf7d98d1-e5e7-4d21-a20e-7aef15aebfd2 ", gender: "M", age: 22 },
    { USERID: "d00c8643-4fed-4084-8067-8ac52c189a7d ", gender: "F", age: 23 },
    { USERID: "d00c8643-4fed-4084-8067-8ac52c189a7ds", gender: "F", age: 16 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189a1dl", gender: "M", age: 40 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189a2dd", gender: "M", age: 35 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189a2ds", gender: "F", age: 33 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189a2dv", gender: "M", age: 30 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189a2dx", gender: "F", age: 22 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189a7ds", gender: "M", age: 27 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189a8ds", gender: "F", age: 18 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189a9dl", gender: "M", age: 29 },
    { USERID: "d00c8643-4fed-4084-8067-8acs13189assa", gender: "M", age: 33 },
    { USERID: "w222222222222222222222222222222222222", gender: "M", age: 24 },
    { USERID: "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", gender: "F", age: 26 },
    { USERID: "1111111111111111111111111111111111111", gender: null, age: null },
];

const tag = [
    "119773687",
    "119773687",
    "140246212",
    "153950643",
    "161042374",
    "194462111",
    "200770552",
    "282899525",
    "288602162",
    "316945708",
    "392748864",
    "415998080",
    "444675156",
    "549084866",
    "570575458",
    "602743131",
    "617348726",
    "672873294",
    "738418230",
    "812965662",
    "815127020",
    "878337672",
    "941283330",
    "316945708",
    "392748864",
    "415998080",
    "444675156",
    "549084866",
    "570575458",
    "602743131",
    "617348726",
    "672873294",
    "738418230",
    "812965662",
    "815127020",
    "878337672",
    "941283330",
    "951897229",
]


export const trainningdataTest = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB();
            let custommerIndex = 0; // Khởi tạo custommerIndex ở đây
            let typeProducts = 0; // Khởi tạo custommerIndex ở đây

            await pool.request().query(`
                CREATE TABLE RandomData
                (   IdTracking INT,
                    UserId VARCHAR(50),
                    ProductId VARCHAR(100),
                    TypeProduct VARCHAR(50),
                    Brand VARCHAR(255),
                    CreatedAt DATETIME,
                    Views INT,
                    Rating INT,
                    Tags VARCHAR(255),
                    Age INT,
                    Gender VARCHAR(10)
                )
            `);

            const startOfYear = new Date('2023-01-01');
            const endOfYear = new Date('2023-12-31');

            for (let i = 0; i < 500; i++) {
                // const randomIndex = Math.floor(Math.random() * productIds.length);
                // const dynamicTypeProduct = `DynamicTypeProduct${i}`;
                const randomDate = new Date(startOfYear.getTime() + Math.random() * (endOfYear.getTime() - startOfYear.getTime()));
                await pool.request().input('UserId', mssql.VarChar, custommer[custommerIndex].USERID)
                    .input('ProductId', mssql.VarChar, productIds[Math.floor(Math.random() * productIds.length)])
                    .input('TypeProduct', mssql.VarChar, typeProductsList[Math.floor(Math.random() * typeProductsList.length)])
                    .input('Brand', mssql.VarChar, brands[Math.floor(Math.random() * brands.length)])
                    .input('CreatedAt', mssql.DateTime, randomDate)
                    .input('Views', mssql.Int, Math.floor(Math.random() * 100))
                    .input('Rating', mssql.Int, Math.floor(Math.random() * 5) + 1)
                    .input('Tags', mssql.VarChar, tag[Math.floor(Math.random() * tag.length)])
                    .input('Age', mssql.Int, custommer[custommerIndex].age)
                    .input('Gender', mssql.VarChar, custommer[custommerIndex].gender)
                    .query(`
                    INSERT INTO RandomData
                    SELECT
                        ABS(CHECKSUM(NEWID())) % 1000 + 1 AS IdTracking,
                        @UserId AS UserId,
                        @ProductId AS ProductId,
                        @TypeProduct AS TypeProduct,
                        @Brand AS Brand,
                        @CreatedAt AS CreatedAt,
                        @Views AS Views,
                        @Rating AS Rating,
                        @Tags AS Tags,
                        @Age AS Age,
                        @Gender AS Gender
                    FROM master.dbo.spt_values
                    ORDER BY (SELECT NULL)
                    OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;
                `);

                custommerIndex = (custommerIndex + 1) % custommer.length;
                typeProducts = (typeProducts + 1) % typeProducts.length
            }
            await pool.request().query(`
                INSERT INTO [TrackingUser]
                SELECT
                    [UserId], [ProductId], [TypeProduct], [Brand], [CreatedAt], [Views], [Rating], [Tags], [Age], [Gender]
                FROM RandomData
            `);

            await pool.request().query('DROP TABLE RandomData');
            console.log('Data inserted successfully.');
            resolve({
                err: 0,
                errMessage: 'Data inserted successfully'
            });
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
};
