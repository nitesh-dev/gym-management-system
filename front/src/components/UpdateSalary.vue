<script lang="ts">
export class DialogUpdateSalary {

    isHidden = true
    salaryData: any = null
    accountType: string = ""
    salary: number | undefined

    show(accountType: string, data: any) {
        this.isHidden = false
        this.accountType = accountType
        this.salaryData = data
        this.salary = undefined
    }

    hide() {
        this.isHidden = true
    }

    onSuccessFul(text: string) { 
        this.hide()
    }

    onFailed(message: string) {

    }

    onUpdateSalary() {
        this.salaryData.salary = this.salary
    }

}

</script>


<script setup lang='ts'>
import Api from '../api'

let prop = defineProps<{
    dialog: DialogUpdateSalary
}>()



async function onSubmitForm() {
    prop.dialog.onUpdateSalary()
    let res = null

    console.log(prop.dialog.salaryData)
    if(prop.dialog.accountType == "trainer"){
        res = await Api.updateTrainer(prop.dialog.salaryData)
    }else if(prop.dialog.accountType == "staff"){
        res = await Api.updateStaff(prop.dialog.salaryData)
    }else if(prop.dialog.accountType == "manager"){
        res = await Api.updateManager(prop.dialog.salaryData)
    }
    
    if(res == null){
        prop.dialog.onFailed("Unable to update")
        return
    }

    if (res.isError) {
        prop.dialog.onFailed(res.error)
    } else {
        prop.dialog.onSuccessFul("Salary updated")
    }
}




</script>
<template>
    <div id="message-model" v-if="!dialog.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="cus-container text-center">
                    <form class="form-dialog" @submit.prevent="onSubmitForm">

                        <h1 class="h3 mb-3 font-weight-normal">Update salary</h1>

                        <input type="number" v-model="prop.dialog.salary" class="form-control" placeholder="Salary" required="true">

                        <div class="row buttons-container">
                            <div class="col">
                                <button class="btn btn-lg btn-secondary btn-block" @click="dialog.hide()">Close</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-lg btn-primary btn-block" type="submit">Update Salary</button>
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