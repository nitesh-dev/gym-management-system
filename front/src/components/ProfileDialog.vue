<script lang="ts">
export class ProfileData {

    isHidden = true
    isEditable = false
    name = ""
    number = 0
    email = ""
    password = ""

    show() {
        this.isHidden = false
        this.isEditable = false
        this.loadAccountData()
    }
    hide() {
        this.isHidden = true
    }

    onUpdateSuccessFul() { }

    hideProgress() {

    }

    showProgress() {

    }

    showMessage(text: string) { }

    async loadAccountData() {
        let accountType = localStorage.getItem("accountType") as string
        let accountId: number = +(localStorage.getItem("accountId") as string)
        const res = await Api.getAccountDetail(accountId, accountType)

        if (res.isSuccess) {
            this.hideProgress()
            this.name = res.data.name
            this.number = res.data.number
            this.email = res.data.email
            this.password = res.data.password
        } else {
            this.hide()
            this.showMessage(res.error)
        }
    }
}

</script>


<script setup lang='ts'>
import Api from '../api'

let prop = defineProps<{
    profile: ProfileData
}>()



async function onSubmitForm() {

    let accountType = localStorage.getItem("accountType") as string
    let accountId: number = +(localStorage.getItem("accountId") as string)
    prop.profile.showProgress()
    let result = await Api.updateAccount(accountType, accountId, prop.profile.name, prop.profile.number.toString(), prop.profile.password)
    prop.profile.hideProgress()
    prop.profile.hide()
    if (result.isSuccess == false) {
        prop.profile.showMessage(result.error)
    } else {
        prop.profile.showMessage("Successfully updated")
        prop.profile.onUpdateSuccessFul()
    }
}

function goUpdateMode() {
    prop.profile.isEditable = true
}




</script>
<template>
    <div id="message-model" v-if="!profile.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="cus-container text-center">
                    <form class="form-profile" @submit.prevent="onSubmitForm">

                        <h1 class="h3 mb-3 font-weight-normal">Profile</h1>
                        <input type="text" v-model="profile.name" class="form-control" placeholder="Name" required="true"
                            :readonly="!profile.isEditable">
                        <input type="number" v-model="profile.number" class="form-control" placeholder="Number"
                            required="true" :readonly="!profile.isEditable">
                        <input type="email" v-model="profile.email" class="form-control" placeholder="Email address"
                            required="true" readonly>
                        <input type="text" v-model="profile.password" id="inputPassword" class="form-control"
                            placeholder="Password" required="true" :readonly="!profile.isEditable">

                        <div class="row">
                            <div class="col">
                                <button class="btn btn-lg btn-secondary btn-block" @click="profile.hide()">Close</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-lg btn-primary btn-block" v-if="profile.isEditable"
                                    type="submit">Update
                                    Profile</button>
                                <button class="btn btn-lg btn-primary btn-block" @click="goUpdateMode" v-else>Edit
                                    Profile</button>

                            </div>
                        </div>


                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
#message-model {
    display: block;
    background-color: rgba(0, 0, 0, 0.116);
}

.form-profile {
    max-width: 400px;
    width: 100%;
}

.cus-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 30px;
    padding-bottom: 30px;

}

button {
    width: 100%;
}

input[type=checkbox] {
    margin-top: 30px;
}

form>input {
    margin-top: 10px;
    padding: 12px;
}

#inputPassword {
    margin-bottom: 20px;
}
</style>