<script lang="ts">
export class DialogStaffData {

    isHidden = true
    show() {
        this.isHidden = false

    }

    hide() {
        this.isHidden = true
    }

    onSuccessFul(text: string) {
        this.hide()
    }

    onFailed(message: string) {

    }

    onCreateStaff() {

    }

}

</script>


<script setup lang='ts'>
import { ref } from 'vue'
import Api from '../api'
import { Staff } from '../RestApiDataType'

let prop = defineProps<{
    dialog: DialogStaffData,
    branchId: string
}>()



async function onSubmitForm() {

    let millisecond = new Date(dob.value).getTime()
    staff.value.dob = millisecond
    staff.value.contact = contact.value.toString()
    staff.value.branch_id = prop.branchId
    staff.value.salary = salary.value as number
    prop.dialog.onCreateStaff()
    
    let res = await Api.createStaff(staff.value)

    if (res.isError) {
        prop.dialog.onFailed(res.error)
    } else {
        prop.dialog.onSuccessFul("Staff created")
    }
}

const staff = ref<Staff>({
    account_id: "",
    branch_id: prop.branchId,
    name: "", email: "",
    password: "", address: "",
    contact: "", dob: 0,
    work: 'security',
    gender: 'male',
    salary: 0
})

// cleaner

let dob = ref("")
let contact = ref("")
let salary = ref<number>()


</script>
<template>
    <div id="message-model" v-if="!dialog.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="cus-container text-center">
                    <form class="form-dialog" @submit.prevent="onSubmitForm">

                        <h1 class="h3 mb-3 font-weight-normal">Create Staff</h1>

                        <input type="text" v-model="staff.name" class="form-control" placeholder="Name" required="true">

                        <input type="email" v-model="staff.email" class="form-control" placeholder="Email" required="true">

                        <input type="password" v-model="staff.password" class="form-control" placeholder="Password" required="true">

                        <input type="text" v-model="staff.address" class="form-control" placeholder="Address" required="true">

                        <input type="number" v-model="contact" class="form-control" placeholder="Contact" required="true">

                        <input type="number" v-model="salary" class="form-control" placeholder="Salary" required="true">

                        <div class="form-group row">
                            <label class="col-sm-4 col-form-label">DOB</label>
                            <div class="col-sm-8">
                                <input type="date" v-model="dob" class="form-control" placeholder="DOB" required="true">
                            </div>
                        </div>

                        <select v-model="staff.gender" class="form-select" required="true">
                            <option  value="male">Male</option>
                            <option  value="female" >Female</option>
                        </select>

                        <select v-model="staff.work" class="form-select" required="true">
                            <option  value="security" >Security</option>
                            <option  value="cleaner" >Cleaner</option>
                        </select>


                        <div class="row buttons-container">
                            <div class="col">
                                <button class="btn btn-lg btn-secondary btn-block" @click="dialog.hide()">Close</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-lg btn-primary btn-block" type="submit">Create</button>
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

.form-dialog {
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

form label{
    align-self: center;
    text-align: left;
}

form input,
form select {
    padding: 12px;
}


form>input, form>select, .form-group{
    margin-top: 10px;
}

#dob {
    margin-bottom: 20px;
}

.buttons-container {
    margin-top: 24px;
}
</style>