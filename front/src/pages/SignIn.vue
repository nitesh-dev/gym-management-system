<script setup lang='ts'>

import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import Api from '../api'
import { ref } from 'vue';


let email = ref<string>("")
let password = ref<string>("")

let message = ref(new Message())
let isProgressHidden = ref(true)

function saveCookies(accountType: string, accountId: number) {
  localStorage.setItem("accountType", accountType)
  localStorage.setItem("accountId", accountId.toString())
}


async function onSubmitForm() {

  isProgressHidden.value = false
  const res = await Api.signIn(email.value, password.value)

  isProgressHidden.value = true
  if (res.isSuccess) {
    saveCookies(res.accountType, res.accountId)
    window.location.href = '/'
  } else {
    message.value.show(res.error as string)
  }

}


</script>
<template>
  <div class="cus-container text-center">
    <form class="form-signin" @submit.prevent="onSubmitForm">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <input type="email" v-model="email" class="form-control" placeholder="Email address" required="true"
        autofocus="true">
      <input type="password" v-model="password" class="form-control" placeholder="Password" required="true">

      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p>Don't have an account? <a href="/sign-up">Sign Up</a></p>
    </form>
  </div>
  <MessageDialog :message="message" />
  <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
.form-signin {
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
  margin-top: 30px;
}

input[type=checkbox] {
  margin-top: 40px;
}

form>input {
  margin-top: 10px;
  padding: 12px;
}

form p {
  margin-top: 30px;
}
</style>