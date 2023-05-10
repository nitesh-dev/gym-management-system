import db from "./database.js";
import express from "express";
import SqlUtils from "./sqlUtils.js";
import { Branch } from "./utils.js";

const router = express.Router()

router.get("/", (req, res) => {
    res.send("server is running")
})
router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send("required password and email")
    } else {
        const result = await SqlUtils.signin(email, password)
        res.send(result)
    }
})
router.get("/info", async (req, res) => {
    const { id, type } = req.body
    if (!id || !type) {
        return res.status(400).send("required id and type")
    } else {
        const result = await SqlUtils.getWithId(type, id)
        res.send(result)
    }
})
/**-------------create--------------------- */
router.post("/branch", async (req, res) => {
    const branch = req.body as Branch
    if (false) {
        return res.status(400).send("required all branch info")
    } else {
        const result = await SqlUtils.createBranch(branch)
        res.send(result)
    }
})
router.post("/manager", async (req, res) => {
    const branch = req.body as Branch
    if (false) {
        return res.status(400).send("required all branch info")
    } else {
        const result = await SqlUtils.createBranch(branch)
        res.send(result)
    }
})
export default router 