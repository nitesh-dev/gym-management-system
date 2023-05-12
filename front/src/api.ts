import { Admin, Branch, Manager, Member, Profile, Staff, Trainer } from "./RestApiDataType"
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

        return post("profile", "", { type: type, profile: profile })

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






    /*----------------- Staff -----------*/

    export async function getStaff(id: string) {
        return get<Staff>("staff/id", `id=${id}`)
    }





    /*----------------- Trainer -----------*/

    export async function getTrainer(id: string) {
        return get<Trainer>("trainer/id", `id=${id}`)
    }


    /*----------------- Member -----------*/

    export async function getMember(id: string) {
        return get<Member>("member/id", `id=${id}`)
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
}
// namespace Api {
//     const apiURL = 'http://localhost:3000'


//     // ------------------------------ Common -----------------------------------

//     export async function signIn(email: string, password: string) {
//         let data = {
//             email: email,
//             password: password
//         }

//         let path = `signin`
//         try {
//             let res = await fetchDataPost(path, data)
//             if (res.status == 200) {
//                 let json = await res.json()
//                 return { isSuccess: true, accountId: json.account_id, accountType: json.type }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }

//     // export async function signUp(name: string, number: string, email: string, password: string, gender: string, age: number, accountType: string) {

//     //     let data = {
//     //         name: name,
//     //         number: number,
//     //         email: email,
//     //         password: password,
//     //         accountType: accountType,
//     //         gender: gender,
//     //         age: age
//     //     }
//     //     let path = `sign-up`
//     //     try {
//     //         let res = await fetchData(path, data)
//     //         if (res.status == 201) {
//     //             let json = await res.json()
//     //             return { isSuccess: true, accountId: json.accountId, accountType: json.accountType }
//     //         } else {
//     //             let message = await res.json()
//     //             return { isSuccess: false, error: message.error }
//     //         }
//     //     } catch (error: any) {
//     //         return { isSuccess: false, error: error.message };
//     //     }

//     // }


//     // 3
//     export async function getAccountDetail(accountId: string, accountType: string) {
//         let query = `account_id=${accountId}`

//         let path = ""
//         if (accountType == "admin") {
//             path = "admin/id"
//         } else if (accountType == "manager") {
//             path = "manager/id"
//         }

//         try {
//             let res = await fetchDataGet(path, query)
//             if (res.status == 200) {
//                 let json = await res.json()
//                 return { isSuccess: true, data: json }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }

//     export async function updateAccount(accountType: string, accountId: number, name: string, number: string, password: string) {
//         let data = {
//             accountId: accountId,
//             accountType: accountType,
//             name: name,
//             number: number,
//             password: password
//         }
//         let path = `update-account-detail`
//         try {
//             let res = await fetchDataPost(path, data)
//             if (res.status == 200) {
//                 return { isSuccess: true }
//             } else {
//                 let message = await res.json()
//                 return { isSuccess: false, error: message.error }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }


//     export async function deleteOperation(tableName: string, idToDelete: string) {
//         let query = `id=${idToDelete}`

//         let path = ""
//         if (tableName == "manager") {
//             path = "manager"
//         } else if (tableName == "branch") {
//             path = "branch"
//         }

//         if (path == "") {
//             return { isSuccess: false, error: "Unable to delete" }
//         }

//         try {
//             let res = await fetchDataDelete(path, query)
//             if (res.status == 200) {
//                 return { isSuccess: true, data: "Deleted successfully" }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }





//     // -------------------------------- Admin -----------------------------------------

//     export async function createManager(manager: Manager) {
//         let data = manager
//         let path = `manager`
//         try {
//             let res = await fetchDataPost(path, data)
//             if (res.status == 200) {
//                 return { isSuccess: true }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }


//     export async function loadUnallocatedBranches() {
//         let data = ""
//         let path = `branch/unused`
//         try {
//             let res = await fetchDataGet(path, data)
//             if (res.status == 200) {
//                 let result = await res.json() as Array<Branch>
//                 return { isSuccess: true, result: result }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }


//     export async function loadAllMangers() {
//         let data = ""
//         let path = `manager`
//         try {
//             let res = await fetchDataGet(path, data)
//             if (res.status == 200) {
//                 let result = await res.json() as Array<Manager>
//                 return { isSuccess: true, result: result }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }

//     export async function loadAllBranches() {
//         let data = ""
//         let path = `branch`
//         try {
//             let res = await fetchDataGet(path, data)
//             if (res.status == 200) {
//                 let result = await res.json() as Array<Branch>
//                 return { isSuccess: true, result: result }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }

//     export async function createBranch(branch: Branch) {
//         let data = branch
//         let path = `branch`
//         try {
//             let res = await fetchDataPost(path, data)
//             if (res.status == 200) {
//                 return { isSuccess: true }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }




//     // -------------------------------- Manager -----------------------------------

//     export async function loadBranchAllTrainer(branchId: string) {
//         let data = `branch_id=${branchId}`
//         let path = `trainer`
//         try {
//             let res = await fetchDataGet(path, data)
//             if (res.status == 200) {
//                 let result = await res.json() as Array<Trainer>
//                 return { isSuccess: true, result: result }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }


//     export async function createTrainer(trainer: Trainer) {
//         let path = `trainer`
//         try {
//             let res = await fetchDataPost(path)
//             if (res.status == 200) {
//                 return { isSuccess: true }
//             } else {
//                 let message = await res.text()
//                 return { isSuccess: false, error: message }
//             }
//         } catch (error: any) {
//             return { isSuccess: false, error: error.message };
//         }
//     }


//     export async function getManagerAccount(accountId: string) {
//         let path = `manager?account_id=${accountId}`
//         return fetchDataGet(path)
//     }





//     async function fetchDataGet<T>(path: string) {

//         const requestOptions: RequestInit = {
//             method: "GET",
//             redirect: "follow",
//         };

//         // console.log(`${apiURL}/${path}?${query}`)

//         try {
//             const res = await fetch(`${apiURL}/${path}`, requestOptions);
//             if (res.ok) {
//                 return createResult<T>(await res.json(), false)
//             } else {
//                 return createResult<string>(await res.text(), true)
//             }
//         } catch (error) {
//             return createResult(error, true)
//         }

//         // // Create a timeout promise that rejects after the specified timeout
//         // const timeoutPromise = new Promise<Response>((_, reject) => {
//         //     setTimeout(() => {
//         //         reject(new Error("Request timed out"));
//         //     }, timeout);
//         // });

//         // // Use Promise.race to resolve or reject the first promise that completes
//         // return Promise.race([fetchPromise, timeoutPromise]);
//     }

//     async function fetchDataDelete(path: string, query: string) {

//         const requestOptions: RequestInit = {
//             method: "DELETE",
//             redirect: "follow",
//         };

//         console.log(`${apiURL}/${path}?${query}`)

//         const fetchPromise = fetch(`${apiURL}/${path}?${query}`, requestOptions);

//         // Create a timeout promise that rejects after the specified timeout
//         const timeoutPromise = new Promise<Response>((_, reject) => {
//             setTimeout(() => {
//                 reject(new Error("Request timed out"));
//             }, timeout);
//         });

//         // Use Promise.race to resolve or reject the first promise that completes
//         return Promise.race([fetchPromise, timeoutPromise]);
//     }

//     async function fetchDataPost(path: string, data = {}) {

//         const requestOptions: RequestInit = {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             method: "POST",
//             redirect: "follow",
//             body: JSON.stringify(data),
//         };

//         const fetchPromise = fetch(`${apiURL}/${path}`, requestOptions);

//         // Create a timeout promise that rejects after the specified timeout
//         const timeoutPromise = new Promise<Response>((_, reject) => {
//             setTimeout(() => {
//                 reject(new Error("Request timed out"));
//             }, timeout);
//         });

//         // Use Promise.race to resolve or reject the first promise that completes
//         return Promise.race([fetchPromise, timeoutPromise]);
//     }

// }
export default Api

