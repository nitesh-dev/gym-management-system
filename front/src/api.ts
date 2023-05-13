import { Admin, Branch, GYMDetail, Manager, Member, MemberInfo, Membership, Profile, Staff, Trainer } from "./RestApiDataType"
interface Result<T> {
    type(account_id: string, type: any): unknown
    isError: boolean,
    result: T | null,
    error: string
}
function createResult<T>(result: T | null, isError: boolean = true, error: string = "") {
    return { isError: isError, result: result, error: error } as Result<T>
}
namespace Api {
    const apiURL = 'http://localhost:3000'

    export async function signIn(email: string, password: string) {
        return post<{ account_id: string, type: string }>("signin", "", { email: email, password: password })
    }

    export async function signUp(member: Member) {
        return post<{ account_id: string, type: string }>("member", "", member)
    }


    export async function updateProfile(type: string, profile: Profile) {

        return put("profile", "", { type: type, profile: profile })

    }














    /*-----------------------admin-----------------------*/
    export async function getAdmin(id: string) {
        return get<Admin>("admin/id", `id=${id}`)
    }


    export async function getAllManagers() {
        return get<Manager[]>("manager", ``)
    }

    export async function getAllBranch() {
        return get<Branch[]>("branch", ``)
    }

    export async function deleteManager(accountId: string) {
        return delete_("manager", `id=${accountId}`)
    }

    export async function deleteBranch(id: string) {
        return delete_("branch", `id=${id}`)
    }

    export async function getAllUnusedBranch() {
        return get<Branch[]>("branch/unused", ``)
    }

    export async function createManager(manager: Manager) {
        return post("manager", "", manager)
    }

    export async function createBranch(branch: Branch) {
        return post("branch", "", branch)
    }

    export async function getGymDetail(){
        return get<GYMDetail>("admin/gym-detail", '')
    }




    /*----------------- Manager -----------*/
    export async function getManager(id: string) {
        return get<Manager>("manager/id", `id=${id}`)
    }

    export async function getAllTrainer(branch_id: string) {
        return get<Trainer[]>("trainer", `branch_id=${branch_id}`)
    }

    export async function getAllStaff(branch_id: string) {
        return get<Staff[]>("staff", `branch_id=${branch_id}`)
    }

    export async function getAllMember(branch_id: string) {
        return get<Member[]>("member", `branch_id=${branch_id}`)
    }

    export async function createTrainer(trainer: Trainer) {
        return post("trainer", "", trainer)
    }

    export async function createStaff(staff: Staff) {
        return post("staff", "", staff)
    }

    export async function deleteTrainer(accountId: string) {
        return delete_("trainer", `id=${accountId}`)
    }

    export async function deleteStaff(accountId: string) {
        return delete_("staff", `id=${accountId}`)
    }

    export async function getBranch(id: string) {
        return get<Branch>("branch/id", `id=${id}`)
    }

    export async function deleteMember(accountId: string) {
        return delete_("member", `id=${accountId}`)
    }

    export async function getBranchRevenue(branchId: string) {
        return get<{total_rev: number, total_exp: number}>("branch/revenue", `branch_id=${branchId}`)
    }

    export async function updateManager(manager: Manager) {
        return put<Manager>("manager", "", manager)
    }

    export async function getMemberInfo(branchId: string){
        return get<MemberInfo[]>("branch/member-info", `branch_id=${branchId}`)
    }









    /*----------------- Staff -----------*/

    export async function getStaff(id: string) {
        return get<Staff>("staff/id", `id=${id}`)
    }

    export async function updateStaff(staff: Staff) {
        return put<Staff>("staff", "", staff)
    }





    /*----------------- Trainer -----------*/

    export async function getTrainer(id: string) {
        return get<Trainer>("trainer/id", `id=${id}`)
    }

    export async function getTrainerMembers(branch_id: string, specialization: string) {
        return get<Member[]>("trainer/member", `branch_id=${branch_id}&specialization=${specialization}`)
    }

    export async function updateTrainer(trainer: Trainer) {
        return put<Trainer>("trainer", "", trainer)
    }




    /*----------------- Member -----------*/

    export async function getMember(id: string) {
        return get<Member>("member/id", `id=${id}`)
    }

    export async function updateMember(member: Member) {
        return put<Member>("member", "", member)
    }



    /*----------------- Membership -----------*/

    export async function getMembership(id: string) {
        return get<Membership[]>("membership", `member_id=${id}`)
    }

    export async function registerMembership(membership: Membership) {
        return post("membership", "", membership)
    }










    async function get<T>(path: string, query: string) {
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
        };

        // console.log(`${apiURL}/${path}?${query}`)

        try {
            const res = await fetch(`${apiURL}/${path}?${query}`, requestOptions);
            if (res.ok) {
                return createResult<T>(await res.json(), false)
            } else {
                return createResult<T>(null, true, await res.text())
            }
        } catch (error) {
            return createResult<T>(null, true, "fetch error")
        }
    }
    async function delete_(path: string, query: string) {
        const requestOptions: RequestInit = {
            method: "DELETE",
            redirect: "follow",
        };

        // console.log(`${apiURL}/${path}?${query}`)

        try {
            const res = await fetch(`${apiURL}/${path}?${query}`, requestOptions);
            if (res.ok) {
                return createResult(await res.text(), false)
            } else {
                return createResult("", true, await res.text())
            }
        } catch (error) {
            console.log(error)
            return createResult(null, true, "fetch error")
        }
    }
    async function post<T>(path: string, query: string, body: any) {
        const requestOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            redirect: "follow",
            body: JSON.stringify(body),
        };

        // console.log(`${apiURL}/${path}?${query}`)

        try {
            const res = await fetch(`${apiURL}/${path}?${query}`, requestOptions);
            if (res.ok) {
                return createResult<T>(await res.json(), false)
            } else {
                return createResult(null, true, await res.text())
            }
        } catch (error) {
            return createResult<T>(null, true, "fetch error")
        }
    }
    async function put<T>(path: string, query: string, body: any) {
        const requestOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            redirect: "follow",
            body: JSON.stringify(body),
        };

        // console.log(`${apiURL}/${path}?${query}`)

        try {
            const res = await fetch(`${apiURL}/${path}?${query}`, requestOptions);
            if (res.ok) {
                return createResult<T>(await res.json(), false)
            } else {
                return createResult(null, true, await res.text())
            }
        } catch (error) {
            console.log(error)
            return createResult<T>(null, true, "fetch error")
        }
    }
}

export default Api

