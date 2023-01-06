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

const store = useStore();
const message = computed(() => store.state.message);


onMounted(async () => {
  await store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
  if(sessionStorage.getItem('user_name')===''){
    await store.dispatch('setMessage', 'You are not logged in');

  }
  else{
    await store.dispatch('setMessage', `Hi ${sessionStorage.getItem('user_name')}`);
    const {data} = await axios.get('/profile/' + sessionStorage.getItem('user_id'), { withCredentials: true });
    console.log(data)
  }
});


</script>