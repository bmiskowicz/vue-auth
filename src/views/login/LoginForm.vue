<template>
  <main class="form-signin w-100 m-auto">
    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input v-model="data.username" type="text" class="form-control" id="floatingInput" placeholder="Username">
        <label for="floatingInput">Username</label>
      </div>
      <div class="form-floating">
        <input v-model="data.password" type="password" class="form-control" id="floatingPassword" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="mb-3">
        <router-link to="/forgot">forgot password?</router-link>
      </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>

    </form>

    </main>-->
</template>


<script>
export default {
  name: "LoginForm",
}
</script>

<script setup>
import {reactive} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const data = reactive({
  id: '',
  username: '',
  password: ''
});

let responseData = reactive({
  accessToken: '',
  email: '',
  id: '',
  login: '',
  roles: ''
})

const router = useRouter();
const emit = defineEmits(['loginData', 'success']);

const submit = async () => {

  const response = await axios.post('/api/auth/signin', {"username":data.username, "password":data.password}, {withCredentials: true});
  responseData = response.data
  sessionStorage.setItem('token', responseData.accessToken)
  sessionStorage.setItem('user_id', response.data.id.toString())
  sessionStorage.setItem('user_name', data.username)
  axios.defaults.headers.common['Authorization'] = `Bearer ${responseData.accessToken}`;
  await emit('success');

}

</script>
