<script setup lang='ts'>
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import Api from '../api'
import { ref } from 'vue';
import { Branch, Member } from '../RestApiDataType';


let memberDetail = ref<Member>({
  account_id: "",
  branch_id: "",
  name: "", email: "",
  password: "", address: "",
  contact: "", dob: 0,
  membership: 'free'
})

let dob = ref("")
let contact = ref("")

let message = ref(new Message())
let isProgressHidden = ref(true)


function saveCookies(accountId: string, accountType: string) {
  localStorage.setItem("accountType", accountType)
  localStorage.setItem("accountId", accountId)
}


// TODO incomplete
async function onSubmitForm() {

  let millisecond = new Date(dob.value).getTime()
  memberDetail.value.dob = millisecond
  memberDetail.value.contact = contact.value.toString()
  //staff.value.branch_id = prop.branchId
  isProgressHidden.value = false
  const res = await Api.signUp(memberDetail.value)
  isProgressHidden.value = true

  if (res.isError) {
    message.value.show(res.error)
  } else {

    const info = res.result as { account_id: string; type: string; }
    saveCookies(info.account_id, info.type)
    window.location.href = '/'
  }
}




let branchDetails = ref(Array<Branch>())
async function loadAllBranches() {
  isProgressHidden.value = false
  let res = await Api.getAllBranch()
  isProgressHidden.value = true

  if (res.isError) {
    message.value.show(res.error)
  } else {
    branchDetails.value = res.result as Array<Branch>
  }
}


function fetchData() {
  console.log("fetching...")
  loadAllBranches()

}

fetchData()


</script>
<template>
  <div class="cus-container text-center">
    <form class="form-signup" @submit.prevent="onSubmitForm">

      <h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>
      <input type="text" v-model="memberDetail.name" class="form-control" placeholder="Name" required="true">
      <input type="number" v-model="contact" class="form-control" placeholder="Contact" required="true">
      <input type="email" v-model="memberDetail.email" class="form-control" placeholder="Email address" required="true">
      <input type="password" v-model="memberDetail.password" class="form-control" placeholder="Password" required="true">
      <input type="text" v-model="memberDetail.address" class="form-control" placeholder="Address" required="true">
      <input type="date" v-model="dob" class="form-control" placeholder="DOB" required="true">

      <!-- <select class="form-select" v-model="gender" aria-label="Default select example" style="margin-bottom: 20px;"
        required>
        <option value="Male" selected>Male</option>
        <option value="Female">Female</option>
      </select> -->

      <select class="form-select" v-model="memberDetail.branch_id" style="margin-bottom: 20px;"
        required>
        <option :value="branch.branch_id" v-for="branch in branchDetails">{{ branch.name }}, {{ branch.address }}</option>
      </select>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
      <p>Already have a account? <a href="/sign-in">Sign In</a></p>
    </form>
  </div>
  <MessageDialog :message="message" />
  <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
.form-signup {
  max-width: 400px;
  width: 100%;
}

.cus-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

button {
  width: 100%;
  margin-top: 20px;
}

p {
  margin-top: 30px;
}

input[type=checkbox],
select {
  margin-top: 30px;
}

form>input,
form>select {
  margin-top: 10px;
  padding: 12px;
}

#inputPassword {
  margin-bottom: 20px;
}
</style>