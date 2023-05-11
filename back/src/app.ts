import db from "./database.js";
import express from "express";
import SqlUtils from "./sqlUtils.js";
import { Admin, Branch, Manager, Member, Staff, Trainer, isAnyInvalid, isValidAdmin } from "./utils.js";
import { randomUUID } from "crypto";

const router = express.Router()

router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    if (isAnyInvalid([email, password])) {
        return res.status(400).send("required password and email")
    } else {
        const result = await SqlUtils.signIn(email, password)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
/**--------------Admin-------------------- */

router.get("/admin/id", async (req, res) => {
    const {  id } = req.query as any
    if (isAnyInvalid([id])) {
        return res.status(400).send("required account_id")
    } else {
        const result = await SqlUtils.getAdmin(id)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.put("/admin", async (req, res) => {
    const admin = req.body as Admin
    // if (isValidAdmin(admin)) {
    //     return res.status(400).send("required all admin info")
    // } else {

    // }
    const result = await SqlUtils.updateAdmin(admin)
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})

/*-----------------branch---------------*/

router.post("/branch", async (req, res) => {
    const { name, email, address, contact } = req.body
    if (isAnyInvalid([name, email, address, contact])) {
        return res.status(400).send("required all branch info")
    } else {
        const result = await SqlUtils.createBranch({
            branch_id: randomUUID(), address: address, contact: contact, email: email, name: name
        })
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/branch/id", async (req, res) => {
    const {  id } = req.query as any
    console.log(id)
    if (isAnyInvalid([id])) {
        return res.status(400).send("required branch_id")
    } else {
        const result = await SqlUtils.getBranch(id)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/branch", async (req, res) => {

    const result = await SqlUtils.getAllBranch()
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
router.get("/branch/unused", async (req, res) => {

    const result = await SqlUtils.getUnusedBranch()
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
router.put("/branch", async (req, res) => {
    const info = req.body as Branch
    const result = await SqlUtils.updateBranch(info)
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
router.delete("/branch", async (req, res) => {
    const { id} = req.query as any
    const result = await SqlUtils.deleteBranch(id)
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
/*-------------manager--------------*/

router.post("/manager", async (req, res) => {
    const { name, email, address, contact, dob, password, branch_id } = req.body
    if (isAnyInvalid([name, email, address, contact, dob, password, branch_id])) {
        return res.status(400).send("required all manager info")
    } else {
        const result = await SqlUtils.createManager({
            account_id: randomUUID(), dob: dob, password: password,
            branch_id: branch_id, address: address, contact: contact,
            email: email, name: name
        })
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/manager/id", async (req, res) => {
    const { account_id: id } = req.query as any
    console.log(id)
    if (isAnyInvalid([id])) {
        return res.status(400).send("required account_id")
    } else {
        const result = await SqlUtils.getManager(id)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/manager", async (req, res) => {

    const result = await SqlUtils.getAllManager()
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
router.put("/manager", async (req, res) => {
    const info = req.body as Manager
    const result = await SqlUtils.updateManager(info)
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
router.delete("/manager", async (req, res) => {
    const {id} = req.query as any
    const result = await SqlUtils.deleteManager(id)
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
/*-------------trainer--------------*/

router.post("/trainer", async (req, res) => {
    const { name, email, address, contact, dob, password, branch_id, specialization } = req.body
    if (isAnyInvalid([name, email, address, contact, dob, password, branch_id, specialization])) {
        return res.status(400).send("required all trainer info")
    } else {
        const result = await SqlUtils.createTrainer({
            account_id: randomUUID(), dob: dob, password: password,
            branch_id: branch_id, address: address, contact: contact,
            email: email, name: name, specialization: specialization
        })
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/trainer/id", async (req, res) => {
    const { account_id: id } = req.query as any
    console.log(id)
    if (isAnyInvalid([id])) {
        return res.status(400).send("required account_id")
    } else {
        const result = await SqlUtils.getTrainer(id)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/trainer", async (req, res) => {

    const { branch_id } = req.query as any
    let result
    if (branch_id) {
        result = await SqlUtils.getAllTrainerWithBranchId(branch_id)
    } else {
        result = await SqlUtils.getAllTrainer()
    }
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
router.put("/trainer", async (req, res) => {
    const info = req.body as Trainer
    const result = await SqlUtils.updateTrainer(info)
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
/*-------------staff--------------*/

router.post("/staff", async (req, res) => {
    const { name, email, address, contact, dob, password, branch_id, specialization: work } = req.body
    if (isAnyInvalid([name, email, address, contact, dob, password, branch_id, work])) {
        return res.status(400).send("required all staff info")
    } else {
        const result = await SqlUtils.createStaff({
            account_id: randomUUID(), dob: dob, password: password,
            branch_id: branch_id, address: address, contact: contact,
            email: email, name: name, work: work
        })
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/staff/id", async (req, res) => {
    const { account_id: id } = req.query as any
    console.log(id)
    if (isAnyInvalid([id])) {
        return res.status(400).send("required account_id")
    } else {
        const result = await SqlUtils.getStaff(id)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/staff", async (req, res) => {

    const { branch_id } = req.query as any
    let result
    if (branch_id) {
        result = await SqlUtils.getAllStaffWithBranchId(branch_id)
    } else {
        result = await SqlUtils.getAllStaff()
    }
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})

router.put("/staff", async (req, res) => {
    const info = req.body as Staff
    const result = await SqlUtils.updateStaff(info)
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
/*-------------member--------------*/

router.post("/member", async (req, res) => {
    const { name, email, address, contact, dob, password, branch_id, specialization: membership } = req.body
    if (isAnyInvalid([name, email, address, contact, dob, password, branch_id, membership])) {
        return res.status(400).send("required all member info")
    } else {
        const result = await SqlUtils.createMember({
            account_id: randomUUID(), dob: dob, password: password,
            branch_id: branch_id, address: address, contact: contact,
            email: email, name: name, membership: membership
        })
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/member/id", async (req, res) => {
    const { account_id: id } = req.query as any
    console.log(id)
    if (isAnyInvalid([id])) {
        return res.status(400).send("required account_id")
    } else {
        const result = await SqlUtils.getMember(id)
        if (result.isError) {
            return res.status(400).send(result.result)

        } else {
            res.send(result.result)
        }
    }
})
router.get("/member", async (req, res) => {
    const { branch_id } = req.query as any
    let result
    if (branch_id) {
        result = await SqlUtils.getAllMemberWithBranchId(branch_id)
    } else {
        result = await SqlUtils.getAllMember()
    }
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})
router.put("/member", async (req, res) => {
    const info = req.body as Member
    const result = await SqlUtils.updateMember(info)
    if (result.isError) {
        return res.status(400).send(result.result)

    } else {
        res.send(result.result)
    }
})

/*-------------membership--------------*/

// router.post("/membership", async (req, res) => {
//     const { name, email, address, contact, dob, password, branch_id, specialization: membership } = req.body
//     if (isAnyInvalid([name, email, address, contact, dob, password, branch_id, membership])) {
//         return res.status(400).send("required all member info")
//     } else {
//         const result = await SqlUtils.createMember({
//             account_id: randomUUID(), dob: dob, password: password,
//             branch_id: branch_id, address: address, contact: contact,
//             email: email, name: name, membership: membership
//         })
//         if (result.isError) {
//             return res.status(400).send(result.result)

//         } else {
//             res.send(result.result)
//         }
//     }
// })



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