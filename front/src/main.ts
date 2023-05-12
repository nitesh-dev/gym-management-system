
import { createApp } from 'vue'
import './style.css';
import './bootstrap.css'
import App from './App.vue';
import SignInVue from "./pages/SignIn.vue";
import SignUpVue from "./pages/SignUp.vue";
import HomeVue from "./pages/Home.vue"
import NotFoundVue from "./pages/NotFound.vue"
import Admin from "./pages/Admin.vue"
import Manager from "./pages/Manager.vue"
import Trainer from "./pages/Trainer.vue"
import Member from "./pages/Member.vue"
import Staff from "./pages/Staff.vue"
import Membership from "./pages/Membership.vue"

import { createRouter, createWebHistory } from 'vue-router'
import Api from './api';

// const res = await Api.signIn("admin@gmail.com", "admid12345")
// console.log(res)
// console.log(await Api.getAllBranch())
const router = createRouter({
  history: createWebHistory(),
  routes: []
})

router.addRoute({
  path: "/", name: "root", component: HomeVue, meta: {
    title: "Home"
  }
})

router.addRoute({
  path: "/sign-in", component: SignInVue, meta: {
    title: "Sign In"
  }
})

router.addRoute({
  path: "/sign-up", component: SignUpVue, meta: {
    title: "Sign Up"
  }
})


router.addRoute({
  path: "/admin", component: Admin, meta: {
    title: "Admin"
  }
})

router.addRoute({
  path: "/manager", component: Manager, meta: {
    title: "Manager"
  }
})

router.addRoute({
  path: "/trainer", component: Trainer, meta: {
    title: "Trainer"
  }
})

router.addRoute({
  path: "/admin/manager/trainer", component: Trainer, meta: {
    title: "Trainer"
  }
})

router.addRoute({
  path: "/admin/manager/member", component: Member, meta: {
    title: "Member"
  }
})

router.addRoute({
  path: "/admin/manager", component: Manager, meta: {
    title: "Manager"
  }
})

router.addRoute({
  path: "/staff", component: Staff, meta: {
    title: "Staff"
  }
})

router.addRoute({
  path: "/member", component: Member, meta: {
    title: "Member"
  }
})

router.addRoute({
  path: "/member/membership", component: Membership, meta: {
    title: "Membership"
  }
})


router.addRoute({
  path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundVue, meta: {
    title: "404 - Not Found"
  }
})

createApp(App).use(router).mount("#app")


router.beforeEach((to, _from, next) => {

  const title = to.meta.title as string
  if (title) {
    document.title = title
  }
  next()
})



