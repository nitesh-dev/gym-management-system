import { randomUUID } from "crypto";
import db from "./database.js";
import { Admin, Branch, Manager, Member, Membership, Profile, Result, Staff, Trainer, createSqlResult, GYMDetail } from "./utils.js";
import { Session } from "inspector";

async function _query<T>(sql: string, values: any[] = []) {

    try {
        const [res] = await db.query(sql, values)
        return createSqlResult<T>(false, res as T)
    } catch (error: any) {
        console.error(error)
        //console.log("sql error", error)
        if (error.errno == 1451) {
            return createSqlResult(true, "first delete reference")
        } else {
            return createSqlResult(true, "sql error")
        }

    }
}
namespace SqlUtils {
    export async function signIn(
        email: string,
        password: string
    ) {
        if (!(await isEmailExist(email))) {
            return createSqlResult(true, "email not exist")
        }
        const sql = `
            SELECT account_id , 'admin' AS type FROM admin WHERE email = '${email}' AND password='${password}'
            UNION ALL
            SELECT account_id , 'manager' AS type FROM manager WHERE email = '${email}' AND password='${password}'
            UNION ALL
            SELECT account_id , 'staff' AS type FROM staff WHERE email = '${email}' AND password='${password}'
            UNION ALL
            SELECT account_id , 'member' AS type FROM member WHERE email = '${email}' AND password='${password}'
            UNION ALL
            SELECT account_id , 'trainer' AS type FROM trainer WHERE email = '${email}' AND password='${password}'
            LIMIT 1;
        `
        const result = await _query<{ account_id: string, type: string }[]>(sql)
        if (result.isError) {
            return createSqlResult(true, "sql server error")
        } else {
            const values = result.result
            if (values.length == 0) {
                return createSqlResult(true, "wrong password")
            } else {
                return createSqlResult(false, values[0])
            }
        }
    }
    export async function isEmailExist(
        email: string,
    ) {
        const sql = ` 
            SELECT account_id , 'admin' AS type FROM admin WHERE email = '${email}'  
            UNION ALL
            SELECT account_id , 'manager' AS type FROM manager WHERE email = '${email}'       
            UNION ALL
            SELECT branch_id , 'branch' AS type FROM branch WHERE email = '${email}'       
            UNION ALL
            SELECT account_id , 'staff' AS type FROM staff WHERE email = '${email}'                
            UNION ALL
            SELECT account_id , 'member' AS type FROM member WHERE email = '${email}' 
            UNION ALL
            SELECT account_id , 'trainer' AS type FROM trainer WHERE email = '${email}' 
            LIMIT 1;
        `
        const result = await _query<any[]>(sql)
        if (result.result.length > 0) return true
        return false
    }
    export async function updateProfile(type: string, profile: Profile) {
        const sql = `UPDATE ${type} SET email=? ,name = ?, password = ?, address = ?, contact = ?, dob = ?,gender = ? WHERE account_id = ? ;`
        const values = [profile.email, profile.name, profile.password, profile.address, profile.contact, profile.dob, profile.gender, profile.account_id]
        return _query(sql, values)
    }

    /**----------------admin------------------------ */
    export async function createAdmin(
        admin: Admin
    ) {
        if (await isEmailExist(admin.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO admin(account_id, name, email, password, address, contact, dob,gender) VALUES(?,?,?,?,?,?,?,?)'
        const values = [admin.account_id, admin.name, admin.email, admin.password, admin.address, admin.contact, admin.dob, admin.gender]
        return _query(sql, values)
    }
    export async function updateAdmin(info: Admin) {
        const sql = 'UPDATE admin SET email=? name = ?, password = ?, address = ?, contact = ?, dob = ?,gender=? WHERE account_id = ?';
        const values = [info.email, info.name, info.password, info.address, info.contact, info.dob, info.gender, info.account_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }
    export async function getAdmin(id: string) {
        const sql = `SELECT * FROM admin WHERE account_id='${id}';`
        const result = await _query<Admin[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "admin not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllAdmin() {
        const sql = `SELECT * FROM admin;`
        const result = await _query<Admin[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        return createSqlResult(false, arr)
    }


    async function getTotalMembers() {
        const sql = `
        SELECT COUNT(*) AS row_count, 'staff' AS name FROM staff
        UNION ALL
        SELECT COUNT(*) AS row_count, 'manager' AS name FROM manager
        UNION ALL
        SELECT COUNT(*) AS row_count, 'trainer' AS name FROM trainer
        UNION ALL
        SELECT COUNT(*) AS row_count, 'member' AS name FROM member
        UNION ALL
        SELECT COUNT(*) AS row_count, 'branch' AS name FROM branch
        `
        return await _query<any>(sql)
    }

    async function getTotalExp() {
        const sql = `
        SELECT CAST(SUM(salary) AS DECIMAL(10,2)) AS exp FROM (
            SELECT salary FROM staff
            UNION ALL
            SELECT salary FROM manager
            UNION ALL
            SELECT salary FROM trainer
          ) AS salaries;
        `
        return await _query<any>(sql)
    }

    async function getTotalRevenue() {
        const sql = `
        SELECT CAST(SUM(price) AS DECIMAL(10,2)) AS rev FROM membership
        `
        return await _query<any>(sql)
    }

    export async function getDetail() {

        let exp = await getTotalExp()
        if (exp.isError) return exp
        let rev = await getTotalRevenue()
        if (rev.isError) return rev
        let totalMembers = await getTotalMembers()
        if (totalMembers.isError) return totalMembers

        let gymDetail: GYMDetail = {
            exp: exp.result[0].exp,
            rev: rev.result[0].rev,
            staff: totalMembers.result[0].row_count,
            member: totalMembers.result[3].row_count,
            manager: totalMembers.result[1].row_count,
            trainer: totalMembers.result[2].row_count,
            branch: totalMembers.result[4].row_count
        }
        return createSqlResult(false, gymDetail)
    }



    /*-----------------------Branch-----------------------*/
    export async function createBranch(
        branch: Branch
    ) {
        if (await isEmailExist(branch.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO branch(branch_id, name, email, address, contact) VALUES(?,?,?,?,?)'
        const values = [branch.branch_id, branch.name, branch.email, branch.address, branch.contact]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function updateBranch(info: Branch) {
        const sql = 'UPDATE branch SET name = ?, email = ?, address = ?, contact = ?, WHERE branch_id = ?';
        const values = [info.name, info.email, info.address, info.contact, info.branch_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }
    export async function getBranch(id: string) {
        const sql = `SELECT * FROM branch WHERE branch_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "branch not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllBranch() {
        const sql = `SELECT * FROM branch ;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        else {
            return createSqlResult(false, arr)
        }
    }
    export async function getUnusedBranch() {
        const sql = `
        SELECT branch.branch_id, branch.name, branch.address, branch.email, branch.contact
        FROM branch
        LEFT JOIN manager ON branch.branch_id = manager.branch_id
        WHERE manager.account_id IS NULL;
        `
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        else {
            return createSqlResult(false, arr)
        }
    }
    export async function deleteBranch(id: string) {
        const sql = `DELETE FROM branch WHERE branch_id = ?;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }




    /**--------------------manager-----------------------*/
    export async function createManager(
        info: Manager
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO manager(account_id, name, email, password, address, contact, dob,branch_id,gender, salary) VALUES(?,?,?,?,?,?,?,?,?,?)'
        const values = [info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.gender, info.salary]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getManager(id: string) {
        const sql = `SELECT * FROM manager WHERE account_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "manager not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllManager() {
        const sql = `SELECT * FROM manager;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function updateManager(info: Manager) {
        const sql = 'UPDATE manager SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,gender=?,salary=? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.gender, info.salary, info.account_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }
    export async function deleteManager(id: string) {
        const sql = `DELETE FROM manager WHERE account_id = ? LIMIT 1;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }




    /**--------------------trainer-----------------------*/
    export async function createTrainer(
        info: Trainer
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO trainer(start_time,end_time,account_id, name, email, password, address, contact, dob,branch_id,specialization,gender, salary) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)'
        const values = [info.start_time, info.end_time, info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.specialization, info.gender, info.salary]
        const result = await _query(sql, values)
        return result
    }
    export async function getTrainer(id: string) {
        const sql = `SELECT * FROM trainer WHERE account_id='${id}';`
        const result = await _query<Trainer[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "trainer not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllTrainer() {
        const sql = `SELECT * FROM trainer;`
        const result = await _query<Trainer[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function getAllTrainerWithBranchId(branch_id: string) {
        const sql = `SELECT * FROM trainer WHERE branch_id='${branch_id}';`
        const result = await _query<Trainer[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        return createSqlResult(false, arr)
    }
    export async function updateTrainer(info: Trainer) {
        const sql = 'UPDATE trainer SET start_time=? ,end_time=?, name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,specialization = ?,gender=?, salary=? WHERE account_id = ?';
        const values = [info.start_time, info.end_time, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.specialization, info.gender, info.salary, info.account_id]
        const result = await _query(sql, values)
        return result
    }

    export async function deleteTrainer(id: string) {
        const sql = `DELETE FROM trainer WHERE account_id = ?;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {
            return createSqlResult(true, "unable to delete")
        }
    }
    export async function getAllMemberOfTrainer(branch_id: string, specialization: string) {
        const sql = `
        SELECT DISTINCT m.*
        FROM member m
        INNER JOIN membership ms ON m.account_id = ms.member_id 
        WHERE 
            m.branch_id = ? AND
            m.is_approved = 1 AND
            (
                ms.type = 'bronze' AND ? IN ('Cardio', 'Strength Training') OR
                ms.type = 'silver' AND ? IN ('Cardio', 'Strength Training', 'Yoga') OR
                ms.type = 'gold' AND ? IN ('Cardio', 'Strength Training', 'Yoga', 'Pilates', 'Crossfit')
            );

        `
        const values = [branch_id, specialization, specialization, specialization]
        const result = await _query<Member[]>(sql, values)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }


    /**--------------------staff-----------------------*/
    export async function createStaff(
        info: Staff
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO staff(account_id, name, email, password, address, contact, dob,branch_id,work,gender,salary) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
        const values = [info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.work, info.gender, info.salary]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getStaff(id: string) {
        const sql = `SELECT * FROM staff WHERE account_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "staff not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllStaff() {
        const sql = `SELECT * FROM staff;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function getAllStaffWithBranchId(branch_id: string) {
        const sql = `SELECT * FROM staff WHERE branch_id='${branch_id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        return createSqlResult(false, arr)
    }
    export async function updateStaff(info: Staff) {
        const sql = 'UPDATE staff SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,work = ? ,gender=?, salary=? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.work, info.gender, info.salary, info.account_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }


    export async function deleteStaff(id: string) {
        const sql = `DELETE FROM staff WHERE account_id = ?;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }


    /**--------------------member-----------------------*/
    export async function createMember(
        info: Member
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO member(account_id, name, email, password, address, contact, dob,branch_id,is_approved,gender) VALUES(?,?,?,?,?,?,?,?,?,?)'
        const values = [info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.is_approved, info.gender]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getMember(id: string) {
        const sql = `SELECT * FROM member WHERE account_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "member not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllMember() {
        const sql = `SELECT * FROM member;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }


    export async function getAllMemberInfoWithBranchId(branch_id: string) {
        const sql = `
        SELECT member.*, IFNULL(end_time > ?, 0) AS is_active, membership.type
        FROM member
        LEFT JOIN membership ON member.account_id = membership.member_id    
        WHERE member.branch_id= ?;`
        const result = await _query<any[]>(sql, [new Date().getTime(), branch_id,])
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }


    export async function getAllMemberWithBranchId(branch_id: string) {
        const sql = `SELECT * FROM member WHERE branch_id='${branch_id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function updateMember(info: Member) {
        const sql = 'UPDATE member SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,is_approved = ?,gender=? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.is_approved, info.gender, info.account_id]
        const result = await _query(sql, values)
        return result
    }

    export async function deleteMember(id: string) {
        const sql = `DELETE FROM member WHERE account_id = ?;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }

    /**----------------------session--------------------- */
    // async function isSessionExist(session: TrainingSession) {
    //     //check if trainer and member id exist or not
    //     const sql = `SELECT * FROM training_session WHERE trainer_id = '${session.trainer_id}' AND member_id = '${session.member_id}' LIMIT 1;`
    //     const result = await _query<any[]>(sql)
    //     if (result.result.length > 0) return true
    //     return false
    // }
    // async function createSession(info: TrainingSession) {
    //     if ((await isSessionExist(info))) {
    //         return createSqlResult(true, "session already exist")
    //     }
    //     const sql = `INSERT INTO training_session(session_id,trainer_id,member_id,start_time,end_time) VALUES(?,?,?,?,?)`
    //     const values = [info.session_id, info.trainer_id, info.member_id, info.start_time, info.end_time]
    //     const result = await _query(sql, values)
    //     if (result.isError) {
    //         return result
    //     } else {
    //         return createSqlResult(false, "created")
    //     }
    // }
    /**--------------------membership-----------------------*/
    export async function createMembership(
        info: Membership
    ) {
        const sql = 'INSERT INTO membership (membership_id,member_id,type,price,start_time,end_time) VALUES(?,?,?,?,?,?)'
        const values = [info.membership_id, info.member_id, info.type, info.price, info.start_time, info.end_time]
        const result = await _query(sql, values)
        return result
    }

    export async function checkMembershipActive(member_id: string) {
        let currentTime = new Date().getTime()
        const sql = `SELECT * FROM membership WHERE member_id=? AND start_time < ? AND end_time > ?`
        const values = [member_id, currentTime, currentTime]
        const result = await _query<any[]>(sql, values)
        console.log(result)
        if (result.isError) return result
        return createSqlResult(false, result.result.length > 0)
    }

    export async function getAllMembership() {
        const sql = `SELECT * FROM membership;`
        const result = await _query<Membership[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }

    export async function getAllMembershipWithMemberId(member_id: string) {
        const sql = `SELECT * FROM membership WHERE member_id='${member_id}';`
        const result = await _query<Membership[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }

    export async function getBranchRevenue(branch_id: string) {
        const sql = `SELECT SUM(membership.price) AS total_revenue FROM membership LEFT JOIN member ON member.account_id = membership.member_id WHERE member.branch_id='${branch_id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }

    export async function getBranchExpenditure(branch_id: string) {
        const sql = `SELECT SUM(salary) AS total_salary FROM (
            SELECT salary FROM staff WHERE branch_id = '${branch_id}'
            UNION ALL
            SELECT salary FROM manager WHERE branch_id = '${branch_id}'
            UNION ALL
            SELECT salary FROM trainer WHERE branch_id = '${branch_id}'
          ) AS salaries;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }



}

export default SqlUtils


/**
 * 
 * 

    export async function createTrainingSession(
        info: TrainingSession
    ) {
        const sql = 'INSERT INTO training_session(session_id,trainer_id,member_id,start_time,end_time) VALUES(?,?,?,?,?)'
        const values = [info.session_id, info.trainer_id, info.member_id, info.start_time, info.end_time]
        return _query(sql, values)
    }



    // export async function deleteRow<T>(info: T, table_name: string) {
    //     const value = info as any
    //     let id_name = value.branch_id ? "branch_id" : value.account_id ? "account_id" : "session_id"
    //     const sql = `DELETE FROM ${table_name} WHERE ${id_name} = ?`;
    //     return _query(sql, [value[id_name]])
    // }
    // export async function deleteAdmin(info: Admin) {
    //     const sql = `DELETE FROM admin WHERE account_id = ?`;
    //     return _query(sql, [info.account_id])
    // }










 */