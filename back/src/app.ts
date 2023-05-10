import db from "./database.js";
import express from "express";
import SqlUtils from "./sqlUtils.js";
import { Branch, isAnyInvalid } from "./utils.js";
import { randomUUID } from "crypto";

const router = express.Router()
router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    if (isAnyInvalid([email, password])) {
        return res.status(400).send("required password and email")
    } else {
        const result = await SqlUtils.signin(email, password)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
/**--------------Admin-------------------- */
router.get("/admin", async (req, res) => {
    const { account_id} = req.body
    if (isAnyInvalid([account_id])) {
        return res.status(400).send("requried account_id")
    } else {
        const result = await SqlUtils.getAdmin(account_id)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})

export default router


/**
 * 
 * 

router.get("/", (req, res) => {
    res.send("server is running")
})
router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    if (isAnyInvalid([email, password])) {
        return res.status(400).send("required password and email")
    } else {
        const result = await SqlUtils.signin(email, password)
        res.send(result)
    }
})
router.get("/info", async (req, res) => {
    const { id, type } = req.body
    if (isAnyInvalid([id, type])) {
        return res.status(400).send("required id and type")
    } else {
        const result = await SqlUtils.getWithId(type, id)
        res.send(result)
    }
})

// router.post("/admin", async (req, res) => {
//     const { name, email, address, contact ,branch_id,dob,password } = req.body
//     if (isAnyInvalid([name, email, address, contact])) {
//         return res.status(400).send("required all branch info")
//     } else {
//         const result = await SqlUtils.createAdmin({
//             account_id: randomUUID(), address: address,
//              contact: contact, email: email, name: name,
//             dob:dob,password:password

//         })
//         if(result.isError){

//         }else{
//             res.send(result)
//         }
//     }
// })
router.post("/branch", async (req, res) => {
    const { name, email, address, contact } = req.body
    if (isAnyInvalid([name, email, address, contact])) {
        return res.status(400).send("required all branch info")
    } else {
        const result = await SqlUtils.createBranch({
            branch_id: randomUUID(), address: address, contact: contact, email: email, name: name
        })
        res.send(result)
    }
})
router.post("/manager", async (req, res) => {
    const { name, email, address, contact ,branch_id,dob,password } = req.body
    if (isAnyInvalid([name, email, address, contact])) {
        return res.status(400).send("required all branch info")
    } else {
        const result = await SqlUtils.createManager({
            account_id: randomUUID(), address: address,
             contact: contact, email: email, name: name,
             branch_id:branch_id,dob:dob,password:password

        })
        res.send(result)
    }
})









 */