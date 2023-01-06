import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '@/views/login/Login.vue';
import RegisterView from '@/views/Register.vue';
import HomeView from '@/views/Home.vue';
import ForgotView from '@/views/Forgot.vue';
import ResetView from '@/views/Reset.vue';
import ProfileView from '@/views/Profile.vue';
import ProfilesView from '@/views/Profiles.vue';



const routes: Array<RouteRecordRaw> = [
  {path: '/', component: HomeView},
  {path: '/login', component: LoginView},
  {path: '/register', component: RegisterView},
  {path: '/forgot', component: ForgotView},
  {path: '/reset/:token', component: ResetView},
  {path: '/profile', component: ProfileView},
  {path: '/profile/:id', component: ProfilesView},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
