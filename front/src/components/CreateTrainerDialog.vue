<script lang="ts">
export class DialogTrainerData {

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

    onCreateTrainer() {

    }

}

</script>


<script setup lang='ts'>
import { ref } from 'vue'
import Api from '../api'
import { Branch, Trainer } from '../RestApiDataType'

let prop = defineProps<{
    dialog: DialogTrainerData,
    branchId: string
}>()



async function onSubmitForm() {

    let millisecond = new Date(dob.value).getTime()
    trainer.value.dob = millisecond
    trainer.value.contact = contact.value.toString()

    console.log(trainer.value)

    prop.dialog.onCreateTrainer()
    
    let res = await Api.createTrainer(trainer.value)

    if (res.isSuccess == true) {
        prop.dialog.onSuccessFul("Trainer created")

    } else {
        prop.dialog.onFailed(res.error)
    }
}

const trainer = ref<Trainer>({
    account_id: "",
    branch_id: prop.branchId,
    name: "", email: "",
    password: "", address: "",
    contact: "", dob: 0,
    specialization: 'Cardio'
})

let dob = ref("")
let contact = ref("")

// | 'Strength Training' | 'Yoga' | 'Pilates' | 'Crossfit'

let allSpecialization = ref(['Cardio', 'Strength Training' , 'Yoga' , 'Pilates' , 'Crossfit'])

</script>
<template>
    <div id="message-model" v-if="!dialog.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="cus-container text-center">
                    <form class="form-dialog" @submit.prevent="onSubmitForm">

                        <h1 class="h3 mb-3 font-weight-normal">Create Trainer</h1>

                        <input type="text" v-model="trainer.name" class="form-control" placeholder="Name" required="true">

                        <input type="email" v-model="trainer.email" class="form-control" placeholder="Email" required="true">

                        <input type="password" v-model="trainer.password" class="form-control" placeholder="Password" required="true">

                        <input type="text" v-model="trainer.address" class="form-control" placeholder="Address" required="true">

                        <input type="number" v-model="contact" class="form-control" placeholder="Contact" required="true">

                        <input type="date" v-model="dob" class="form-control" placeholder="DOB" required="true">

                        <select class="form-select" required="true">
                            <option @click="" :value="item" v-for="item in allSpecialization">{{ item }}</option>
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