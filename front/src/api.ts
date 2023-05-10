namespace Api {
    const apiURL = 'http://localhost:3000'


    // 1
    export async function signIn(email: string, password: string) {
        let data = {
            email: email,
            password: password
        }

        let path = `signin`
        try {
            let res = await fetchData(path, data, postType)
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

    // 2
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
        let data = {
            accountId: accountId
        }

        let path = ""
        if (accountType == "admin") {
            path = "admin"
        } else if (accountType == "manager") {
            path = "manager"
        }

        try {
            let res = await fetchData(path, data, getType)
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

    // 4
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
            let res = await fetchData(path, data, postType)
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



    const postType = "POST"
    const getType = "GET"
    const deleteType = "DELETE"

    let timeout = 20000
    async function fetchData(path: string, data = {}, requestType: string) {

        const requestOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            method: requestType,
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

