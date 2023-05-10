namespace Api {
    const apiURL = 'http://localhost:3000'


    export async function signIn(email: string, password: string) {
        let data = {
            email: email,
            password: password
        }

        let path = `sign-in`
        try {
            let res = await fetchData(path, data)
            if (res.status == 200) {
                let json = await res.json()
                return { isSuccess: true, accountId: json.accountId, accountType: json.accountType }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }
    }

    export async function signUp(name: string, number: string, email: string, password: string, gender: string, age: number, accountType: string) {

        let data = {
            name: name,
            number: number,
            email: email,
            password: password,
            accountType: accountType,
            gender: gender,
            age: age
        }
        let path = `sign-up`
        try {
            let res = await fetchData(path, data)
            if (res.status == 201) {
                let json = await res.json()
                return { isSuccess: true, accountId: json.accountId, accountType: json.accountType }
            } else {
                let message = await res.json()
                return { isSuccess: false, error: message.error }
            }
        } catch (error: any) {
            return { isSuccess: false, error: error.message };
        }

    }


    export async function getAccountDetail(accountId: number, accountType: string) {
        let data = {
            accountId: accountId,
            accountType: accountType
        }

        let path = `account-detail`
        try {
            let res = await fetchData(path, data)
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


   

    let timeout = 20000
    async function fetchData(path: string, data = {}) {

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

