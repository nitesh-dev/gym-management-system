<script lang="ts">
export class DialogManagerData {

    isHidden = true
    branchData = Array<Branch>()
    selectedBranchId = ""

    show() {
        this.isHidden = false
        this.branchData = Array<Branch>()
        this.selectedBranchId = ""
        this.loadBranchData()
    }

    hide() {
        this.isHidden = true
    }

    onSuccessFul(text: string) {
        this.hide()

    }

    onFailed(text: string) {

    }

    onCreateManager() {
        this.show()
    }

    async loadBranchData() {
        let res = await Api.getAllUnusedBranch()

        if (res.isError) {
            this.hide()
            this.onFailed(res.error)
        } else {
            this.branchData = res.result as Array<Branch>
            if(this.branchData.length > 0){
                this.selectedBranchId = this.branchData[0].branch_id
            }
        }
    }
}

</script>


<script setup lang='ts'>
import { ref } from 'vue'
import Api from '../api'
import { Branch, Manager } from '../RestApiDataType'

let prop = defineProps<{
    dialog: DialogManagerData
}>()





let name = ref("")
let email = ref("")
let password = ref("")
let address = ref("")
let contact = ref<number>(0)
let dob = ref("")



async function onSubmitForm() {

    prop.dialog.onCreateManager()
    let dateMill = new Date(dob.value).getTime()
    const data: Manager = {
        account_id: "",
        branch_id: prop.dialog.selectedBranchId,
        name: name.value, email: email.value,
        password: password.value, address: address.value,
        contact: contact.value.toString(), dob: dateMill
    }


    let res = await Api.createManager(data)

    if (res.isError) {
        prop.dialog.onFailed(res.error)
    } else {
        prop.dialog.onSuccessFul("Manager created successfully")
    }
}

const branchId=ref("")
function setSelectedBranch() {
    prop.dialog.selectedBranchId = branchId.value
}






</script>
<template>
    <div id="message-model" v-if="!dialog.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="cus-container text-center">
                    <form class="form-dialog" @submit.prevent="onSubmitForm">

                        <h1 class="h3 mb-3 font-weight-normal">Create Manager</h1>

                        <input type="text" v-model="name" class="form-control" placeholder="Name" required="true">

                        <input type="email" v-model="email" class="form-control" placeholder="Email" required="true">

                        <input type="password" v-model="password" class="form-control" placeholder="Password"
                            required="true">

                        <input type="text" v-model="address" class="form-control" placeholder="Address" required="true">

                        <input type="number" v-model="contact" class="form-control" placeholder="Contact" required="true">

                        <input type="date" v-model="dob" class="form-control" placeholder="DOB" required="true">

                        <select v-model="branchId" class="form-select" @change="setSelectedBranch()" required="true">
                            <option v-for="branch, index in dialog.branchData"
                                :value="branch.branch_id">{{ branch.address }}
                            </option>
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

form>input,
form>select {
    margin-top: 10px;
    padding: 12px;
}

#dob {
    margin-bottom: 20px;
}

.buttons-container {
    margin-top: 24px;
}
</style>