<template>
  <div class="container mt-5 text-center">
    <h3>{{ message }}</h3>
  </div>
  <User></User>
</template>

<script lang="ts">
export default {
  name: "HomeView"
}
</script>

<script setup lang="ts">

import {computed, onMounted} from "vue";
import axios from "axios";
import {useStore} from "vuex";
import User from "@/router/index.ts";
import {useRouter} from "vue-router";

const store = useStore();
const message = computed(() => store.state.message);
const router = useRouter();


onMounted(async () => {
  await store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
  if(sessionStorage.getItem('user_name')===''){
    await store.dispatch('setMessage', 'You are not logged in');
    setTimeout(() => store.dispatch('setMessage', 'You are not logged in'), 2000);
    setTimeout(() => store.dispatch('setMessage', 'Redirecting to login page ...'), 4000);
    setTimeout(() => router.push('/login'), 6000);
  }
  else{
    await store.dispatch('setMessage', `Hi ${sessionStorage.getItem('user_name')}`);
    const {data} = await axios.get('/profile/' + sessionStorage.getItem('user_id'), { withCredentials: true });
  }
});


</script>