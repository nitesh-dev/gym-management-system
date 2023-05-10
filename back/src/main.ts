import router from "./app.js";
import db from "./database.js";
import express from 'express'
import dotenv from 'dotenv'
import testRouter from "./test.js";
import cors from 'cors'
import SqlUtils from "./sqlUtils.js";
import { randomUUID } from "crypto";
dotenv.config()
const PORT = process.env.EXPRESS_PORT
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
/*----------router-------------------*/
app.use(router)
app.use(testRouter)
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})