<template>
  <div v-if="this.message===''">

    <main class="form-signin w-100 m-auto" v-if="this.datas.login.loginId==this.user">
        <a v-bind:href="'/workspace'">
          Click HERE to access your workspaces
        </a>
      <br><br>
      <form @submit.prevent="submit">
        <h1 class="h3 mb-3 fw-normal">Change your profile</h1>
          Username
        <div class="form-floating">
          <input v-model="username" type="text" class="form-control" id="floatingInput" placeholder=''>
          <label for="floatingInput">{{ datas.login.username }}</label>
        </div>
         Email
        <div class="form-floating">
          <input v-model="email" type="email" class="form-control" id="floatingInput" placeholder=''>
          <label for="floatingInput">{{ datas.login.email }}</label>
        </div>
  <!--       Icon-->
  <!--      <div class="form-floating">-->
  <!--        <input v-model="data.username" type="image" class="form-control" id="floatingInput" placeholder="Icon">-->
  <!--        <label for="floatingInput">{{ datas.login.icon }}</label>-->
  <!--      </div>-->
        Password
        <div class="form-floating">
          <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder=''>
          <label for="floatingPassword"></label>
        </div>

        Creation date: {{datas.creationDate.toString().slice(0, 10)}}<br>
        Icon: {{datas.icon}}<br>

        <br>

        <button class="w-100 btn btn-lg btn-primary" type="submit" @click="updated">Change</button>
        <br><br>
        <button class="w-100 btn btn-lg btn-primary" type="submit" @click="deleted">Delete</button>
      </form>

    </main>
    <div class="form-signin w-100 m-auto" v-if="this.datas.profileId!=this.user">
      User: {{datas.login.username}}<br>
      Email: {{datas.login.email}}<br>
      Creation date: {{datas.creationDate.toString().slice(0, 10)}}<br>
      Icon: {{datas.icon}}<br>
    </div>
  </div>

  <div class="form-signin w-100 m-auto" v-if="this.message!==''">
    {{this.message}}
  </div>

</template>

<script>
import axios from 'axios'
import {toRaw} from "vue";
import router from "@/router";
export default {
  name: "ProfileView",
  data () {
    return {
      datas: { "profileId": 0, "login": { "loginId": 0, "username": "", "email": "", "password": "", "enabled": false, "roles": [ { "id": "<null>", "name": "" } ] }, "icon": null, "creationDate": "", "workspaceMembersSet": [], "profileIssuesSet": [] },
      message: '',
      user: sessionStorage.getItem('user_id'),
      username: '',
      email: '',
      password: '',
    }
  },
  created() {
    this.message = ''
    this.$store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
    sessionStorage.getItem('user_name')?
        axios.get(window.location.pathname)
        .then(response => {
          response.data?this.datas=response.data
              :this.message="Profile with such ID does not exist";
    })
        :this.message = "You are not logged in. Log in to access profiles";
  },
  methods: {
    updated () {
      let data1 = this.datas;
      if(this.username!=='')  data1.login.username = this.username;
      if(this.email!=='')  data1.login.email = this.email;
      if(this.password!=='')  data1.login.password = this.password;
      data1 = toRaw(data1)
      axios.patch('/profile/' + data1.profileId + '/update', null, { params: {
          "profileId": data1.profileId,
          "email": data1.login.email,
          "password": data1.login.password,
          "username": data1.login.username
        }})
          .then(
              response => response.status,
          )
          .catch(err => console.warn(err));

      sessionStorage.setItem('user_name', data1.login.username)
    },
    deleted (){
      axios.delete('/profile/' + this.datas.profileId + '/delete', null, )
          .then(
              response => response.status,
          )
          .catch(err => console.warn(err));
      axios.post('api/auth/signout', {}, {withCredentials: true});
      sessionStorage.setItem('user_id', '')
      sessionStorage.setItem('user_name', '')
      router.push('/')
    }
  }
}
</script>