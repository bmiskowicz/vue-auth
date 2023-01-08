<template>
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><router-link to="/" class="btn btn-outline-light me-2">Home</router-link></li>
          <li>
            <div class="text-end" v-if="auth">
              <router-link to="/profile" class="btn btn-outline-light me-2">Profiles</router-link>
              <router-link :to="'/profile/' + this.profileId" class="btn btn-outline-light me-2">Profile</router-link>
            </div>
          </li>
        </ul>

        <div class="text-end" v-if="auth">
          <router-link to="/" class="btn btn-outline-light me-2" @click="logout">Logout</router-link>
        </div>
        <div class="text-end" v-if="!auth">
          <router-link to="/login" class="btn btn-outline-light me-2">Login</router-link>
          <router-link to="/register" class="btn btn-outline-light me-2">Register</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  name: "NavBlack",
  data () {
    return {
      profileId: sessionStorage.getItem('user_id')
    }
  }
}
</script>

<script setup lang="ts">
import {computed} from "vue";
import axios from "axios";
import {useStore} from "vuex";

const store = useStore();
const auth = computed(() => store.state.auth);

const logout = async () => {
  await axios.post('api/auth/signout', {}, {withCredentials: true});
  sessionStorage.setItem('user_id', '')
  sessionStorage.setItem('user_name', '')
  axios.defaults.headers.common['Authorization'] = '';
  await store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
  await store.dispatch('setMessage', 'You are not logged in');
}

</script>