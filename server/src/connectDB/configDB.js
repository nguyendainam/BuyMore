import * as dotenv from 'dotenv'
dotenv.config()

const {
HOST,
SQL_USER ,
SQL_PASSWORD  ,
SQL_DATABASE ,
DATABASE ,
SQL_SERVER ,
SQL_ENCRYPT
} = process.env

const config  = {
    database : {
        driver: SQL_SERVER,
        host : HOST ,
        server: SQL_DATABASE ,
        user: SQL_USER ,
        password: SQL_PASSWORD,
        database: DATABASE,
        options: {
            encrypt: false , 
            enableArithAbort: false
        },
        connectionTimeout: 300000,
        requestTimeout: 300000,
        pool: {
          idleTimeoutMillis: 30000,
          max: 100
        } ,
    }

    
}

export default config