import { Branch, Manager } from "./RestApiDataType"

namespace Api {
    const apiURL = 'http://localhost:3000'


    // ------------------------------ Common -----------------------------------

    export async function signIn(email: string, password: string) {
        let data = {
            email: email,
            password: password
        }

        let path = `signin`
        try {
            let res = await fetchDataPost(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, accountId: json.account_id, accountType: json.type }
            } else {
                let message = await res.text()
                return { isSuccess: false, error: message }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }

    // export async function signUp(name: string, number: string, email: string, password: string, gender: string, age: number, accountType: string) {

    //     let data = {
    //         name: name,
    //         number: number,
    //         email: email,
    //         password: password,
    //         accountType: accountType,
    //         gender: gender,
    //         age: age
    //     }
    //     let path = `sign-up`
    //     try {
    //         let res = await fetchData(path, data)
    //         if (res.status == 201) {
    //             let json = await res.json()
    //             return { isSuccess: true, accountId: json.accountId, accountType: json.accountType }
    //         } else {
    //             let message = await res.json()
    //             return { isSuccess: false, error: message.error }
    //         }
    //     } catch (error: any) {
    //         return { isSuccess: false, error: error.message };
    //     }

    // }


    // 3
    export async function getAccountDetail(accountId: string, accountType: string) {
        let query = `account_id=${accountId}`

        let path = ""
        if (accountType == "admin") {
            path = "admin/id"
        } else if (accountType == "manager") {
            path = "manager/id"
        }

        try {
            let res = await fetchDataGet(path, query)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, data: json }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }

    export async function updateAccount(accountType: string, accountId: number, name: string, number: string, password: string) {
        let data = {
            accountId: accountId,
            accountType: accountType,
            name: name,
            number: number,
            password: password
        }
        let path = `update-account-detail`
        try {
            let res = await fetchDataPost(path, data)
            if (res.status == 200) {
                return { isSuccess: true }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }





    // -------------------------------- Admin -----------------------------------------
    
    export async function createManager(manager: Manager) {
        let data = manager
        let path = `manager`
        try {
            let res = await fetchDataPost(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, accountId: json.account_id, accountType: json.type }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }


    export async function loadUnallocatedBranches(){
        let data = ""
        let path = `branch/unused`
        try {
            let res = await fetchDataGet(path, data)
            if (res.status == 200) {
                let result = await res.json() as Array<Branch>
                return { isSuccess: true, result: result}
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }































    let timeout = 20000

    async function fetchDataGet(path: string, query: string) {

        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
        };

        console.log(`${apiURL}/${path}?${query}`)

        const fetchPromise = fetch(`${apiURL}/${path}?${query}`, requestOptions);

        // Create a timeout promise that rejects after the specified timeout
        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => {
                reject(new Error("Request timed out"));
            }, timeout);
        });

        // Use Promise.race to resolve or reject the first promise that completes
        return Promise.race([fetchPromise, timeoutPromise]);
    }

    async function fetchDataPost(path: string, data = {}) {

        const requestOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            redirect: "follow",
            body: JSON.stringify(data),
        };

        const fetchPromise = fetch(`${apiURL}/${path}`, requestOptions);

        // Create a timeout promise that rejects after the specified timeout
        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => {
                reject(new Error("Request timed out"));
            }, timeout);
        });

        // Use Promise.race to resolve or reject the first promise that completes
        return Promise.race([fetchPromise, timeoutPromise]);
    }

}
export default Api

