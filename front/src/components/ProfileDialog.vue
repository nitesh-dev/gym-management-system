<script lang="ts">

export class ProfileData {

    isHidden = true
    isEditable = false
    profile: Profile = {
        account_id: "",
        name: "",
        email: "",
        password: "",
        address: "",
        contact: "",
        dob: 0,
        gender: 'male'
    }

    dob = ""
    contact = 0

    show() {
        this.isHidden = false
        this.isEditable = false
        this.profile.account_id = localStorage.getItem("accountId") as string
        this.dob = this.getDateString(this.profile.dob)
    }
    hide() {
        this.isHidden = true
    }

    onSuccessFul(text: string) {
        this.hide()
    }

    onFailed(text: string) {

    }

    onUpdateProfile() {

    }


    getDateString(millisecond: number) {
        const date = new Date(millisecond)
        // Format the date as a string in the format expected by the input element
        const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return dateString
    }
}

</script>


<script setup lang='ts'>
import { Profile } from '../RestApiDataType'
import Api from '../api'


let prop = defineProps<{
    profile: ProfileData
}>()



async function onSubmitForm() {

    let accountType = localStorage.getItem("accountType") as string
    prop.profile.onUpdateProfile()
    let res = await Api.updateProfile(accountType, prop.profile.profile)
    // prop.profile.hideProgress()

    if (res.isError) {
        prop.profile.onFailed(res.error)
    } else {
        prop.profile.onSuccessFul("Profile updated")
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

                        <input type="text" v-model="profile.profile.name" class="form-control" placeholder="Name"
                            required="true" :readonly="!profile.isEditable">

                        <input type="number" v-model="profile.contact" class="form-control" placeholder="Contact"
                            required="true" :readonly="!profile.isEditable">

                        <input type="email" v-model="profile.profile.email" class="form-control" placeholder="Email address"
                            required="true" readonly>

                        <input type="text" v-model="profile.profile.password" class="form-control" placeholder="Password"
                            required="true" :readonly="!profile.isEditable">

                        <input type="text" v-model="profile.profile.address" class="form-control" placeholder="Address"
                            required="true" :readonly="!profile.isEditable">

                        <select v-model="profile.profile.gender" class="form-select" required="true"
                        :disabled="!profile.isEditable">
                            <option value="male" :selected="profile.profile.gender == 'male'">Male</option>
                            <option value="female" :selected="profile.profile.gender == 'female'">Female</option>
                        </select>

                        <input type="date" id="dob" v-model="profile.dob" class="form-control" placeholder="DOB"
                            required="true" :readonly="!profile.isEditable">



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

form>input,
form>select {
    margin-top: 10px;
    padding: 12px;
}

#dob {
    margin-bottom: 20px;
}
</style>