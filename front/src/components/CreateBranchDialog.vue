<script lang="ts">
export class DialogBranchData {

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

    onCreateBranch() {

    }

}

</script>


<script setup lang='ts'>
import { ref } from 'vue'
import Api from '../api'
import { Branch } from '../RestApiDataType'

let prop = defineProps<{
    dialog: DialogBranchData
}>()



async function onSubmitForm() {

    prop.dialog.onCreateBranch()
    let data: Branch = {
        branch_id: "",
        name: name.value, email: email.value,
        address: address.value,
        contact: contact.value.toString()
    }

    let res = await Api.createBranch(data)

    if (res.isSuccess == true) {
        prop.dialog.onSuccessFul("Branch created")

    } else {
        prop.dialog.onFailed(res.error)
    }
}


let name = ref("")
let email = ref("")
let address = ref("")
let contact = ref("")



</script>
<template>
    <div id="message-model" v-if="!dialog.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="cus-container text-center">
                    <form class="form-dialog" @submit.prevent="onSubmitForm">

                        <h1 class="h3 mb-3 font-weight-normal">Create Branch</h1>

                        <input type="text" v-model="name" class="form-control" placeholder="Name" required="true">

                        <input type="email" v-model="email" class="form-control" placeholder="Email" required="true">

                        <input type="text" v-model="address" class="form-control" placeholder="Address" required="true">

                        <input type="number" v-model="contact" class="form-control" placeholder="Contact" required="true">



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