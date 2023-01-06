<template>
  <LoginForm @login-data="setLoginData" @success="success" v-if="loginData.id === 0"/>
</template>

<script lang="ts">
export default {
  name: "LoginView"
}
</script>

<script setup lang="ts">
import {useRouter} from "vue-router";
import LoginForm from "@/views/login/LoginForm.vue";
import {reactive} from "vue";
import {useStore} from "vuex";

const router = useRouter();
const store = useStore();
const loginData = reactive({
  id: 0,
  login: '',
});

const setLoginData = (responseData: {   accessToken: string, email: string, id: number, login: string, roles: string }) => {
  loginData.id = responseData.id;
  loginData.login = responseData.login;
}

const success = async () => {
  await store.dispatch('setAuth', sessionStorage.getItem('user_id')!=='');
  await store.dispatch('setId', loginData.id);
  await router.push('/');
}

</script>