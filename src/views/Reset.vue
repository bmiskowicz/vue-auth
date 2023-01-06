<template>
  <main class="form-signin w-100 m-auto">
    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Please reset your password</h1>

      <div class="form-floating">
        <input v-model="data.password" type="password" class="form-control" placeholder="Password">
        <label>Password</label>
      </div>

      <div class="form-floating">
        <input v-model="data.password_confirm" type="password" class="form-control" placeholder="Password Confirm">
        <label>Password Confirm</label>
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
    </form>
  </main>
</template>

<script>
export default {
  name: "ResetView"
}
</script>

<script setup>

import {reactive} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

const data = reactive({
  password: '',
  password_confirm: ''
});

const route = useRoute();
const router = useRouter();

const submit = async () => {
  await axios.post(`reset/${route.params.token}`, data);
  await router.push('/login');
}
</script>