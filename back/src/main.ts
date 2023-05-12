import router from "./app.js";
import db from "./database.js";
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import SqlUtils from "./sqlUtils.js";
import { randomUUID } from "crypto";
import { Admin } from "./utils.js";
dotenv.config()
const PORT = process.env.EXPRESS_PORT
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
/*----------router-------------------*/
app.use(router)
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})
addAdminIfNotExist()
async function addAdminIfNotExist() {
    const all = await SqlUtils.getAllAdmin()
    if (!all.isError) {
        const admins = all.result as Admin[]
        console.log(admins)
        if (admins.length == 0) {
            //create account
            const res = await SqlUtils.createAdmin({
                account_id: randomUUID(),
                address: "delhi,india",
                dob: (new Date()).getMilliseconds(),
                name: "admin",
                email: "admin@gmail.com",
                contact: "80080808",
                gender: "male",
                password: "1234"
            })
            if (res.isError) {
                console.log("admin not created", res.result)
            } else {
                console.log("admin created")
            }
        }
    }
}