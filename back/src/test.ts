import { randomUUID } from "crypto";
import SqlUtils from "./sqlUtils.js";

import express from "express";
import { Admin } from "./utils.js";

const testRouter = express.Router()
/*--------------------insert----------------------*/

testRouter.get("/test/admin/insert", async (req, res) => {
    const result = await SqlUtils.createAdmin(
        {
            name: "abhishek", email: "abhishek@gmail.com", password: "1234",
            address: "bhagwanpur", contact: "9525140960", dob: 5454546455,
            account_id: randomUUID()
        }
    )
    res.send(result)
})
testRouter.get("/test/branch/insert", async (req, res) => {
    const result = await SqlUtils.createBranch(
        {
            name: "branch abhishek gym", email: "abhishek@gmail.com",
            address: "bhagwanpur", contact: "9525140960",
            branch_id: randomUUID()
        }
    )
    res.send(result)
})
testRouter.get("/test/trainer/insert", async (req, res) => {
    const result = await SqlUtils.createTrainer(
        {
            name: "trainer1", email: "trainer1@gmail.com", password: "1234",
            address: "bhagwanpur", contact: "9525140960", dob: 5454546455,
            account_id: randomUUID(), branch_id: "e3b1ebe5-a545-428c-b4df-34bce983fa61",
            specialization: 'Cardio'
        }
    )
    res.send(result)
})
testRouter.get("/test/manager/insert", async (req, res) => {
    const result = await SqlUtils.createManager(
        {
            name: "abhishek", email: "abhishek@gmail.com", password: "1234",
            address: "bhagwanpur", contact: "9525140960", dob: 5454546455,
            account_id: randomUUID(), branch_id: "e3b1ebe5-a545-428c-b4df-34bce983fa61"
        }
    )
    res.send(result)
})
testRouter.get("/test/staff/insert", async (req, res) => {
    const result = await SqlUtils.createStaff(
        {
            name: "abhishek cleaner", email: "abhishekcleaner@gmail.com", password: "1234",
            address: "bhagwanpur", contact: "9525140960", dob: 5454546455,
            account_id: randomUUID(), branch_id: "e3b1ebe5-a545-428c-b4df-34bce983fa61", work: 'cleaner'
        }
    )
    res.send(result)
})
testRouter.get("/test/member/insert", async (req, res) => {
    const result = await SqlUtils.createMember(
        {
            name: "abhishek member", email: "abhishekmember@gmail.com", password: "1234",
            address: "bhagwanpur", contact: "9525140960", dob: 5454546455,
            account_id: randomUUID(), branch_id: "e3b1ebe5-a545-428c-b4df-34bce983fa61", membership: 'free'
        }
    )
    res.send(result)
})

/*--------------------------get all------------------*/

testRouter.get("/test/getall", async (req, res) => {
    const { table_name } = req.query
    if (typeof table_name === 'string') {
        const result = await SqlUtils.getAll(table_name)
        res.send(result)
    } else {
        res.status(400).send("table_name required")
    }
})

/*------------------update------------------------------*/
testRouter.put("/test/admin/", async (req, res) => {
    const admin = (req.body || {}) as Admin
    const result = await SqlUtils.updateAdmin(
        admin
    )
    res.send(result)
})


/*------------------------------------------------*/
// testRouter.delete("/test/admin/", async (req, res) => {
//     const admin = (req.body || {}) as Admin
//     const result = await SqlUtils.deleteAdmin(admin)
//     res.send(result)
// })
/*------------------------------------------------*/
/*------------------------------------------------*/
const car = {
    car_id: 100
}
const bike = {
    bike_id: 100015
}
function print(value: any) {
    console.log(` value ${value.bike_id || value.car_id}`)
}
print(car)
print(bike)
console.log(car['car_id'])
export default testRouter 