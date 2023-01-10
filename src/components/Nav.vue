<template>
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a  v-bind:href="'/'" class="btn btn-outline-light me-2">Home</a></li>
          <li>
            <div class="text-end" v-if="auth">
              <a  v-bind:href="'/profile/'" class="btn btn-outline-light me-2">Profiles</a>
              <a  v-bind:href="'/profile/' + this.profileId" class="btn btn-outline-light me-2">Profile</a>
              <a  v-bind:href="'/workspace/'" class="btn btn-outline-light me-2">Workspaces</a>
            </div>
          </li>
        </ul>

        <div class="text-end" v-if="auth">
          <a a  v-bind:href="'/'" class="btn btn-outline-light me-2" @click="logout">Logout</a>
        </div>
        <div class="text-end" v-if="!auth">
          <a  v-bind:href="'/login'" class="btn btn-outline-light me-2">Login</a>
          <a v-bind:href="'/register'" class="btn btn-outline-light me-2">Register</a>

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