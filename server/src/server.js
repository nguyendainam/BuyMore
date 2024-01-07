import express from 'express'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import ClientRouter from './Router/clientRoute.js'
import ProductRouter from './Router/productRoute.js'
import fileupload from 'express-fileupload'
import _ from 'lodash'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()

app.use('/server/Images', express.static(path.join(__dirname, '..', 'Images')))


app.use(cors())
app.use(cookieParser())
app.use(fileupload({ createParentPath: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

let port = process.env.PORT || 9999

app.use(ClientRouter)
app.use(ProductRouter)

app.listen(port, () => {
  console.log('Server running on port: ' + port)
})
