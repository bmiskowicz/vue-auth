<template>
  <div class="form-signin w-100 m-auto">
    {{this.message}}
    <div v-for="(item, id) in this.workspaces" :key="item.id">
      <a v-bind:href="'/workspace/'+ this.workspaces[id].workspaceId">
        Workspace: {{ this.workspaces[id].workspaceName }}
      </a>
      <br>
      Workspace description: <br> {{ this.workspaces[id].workspaceDescription }}
      <br>
      <br>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {toRaw} from "vue";
import router from "@/router";

export default {
  name: "WorkspaceView",
  data() {
    return {
      datas: [],
      workspaces: [],
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
    sessionStorage.getItem('user_name') ?
        axios.get(/workspace/ + sessionStorage.getItem('user_id'))
            .then(response => {
              response.data ? this.datas = response.data
                  : this.message = "Profile with such ID does not exist";
              let element
              for (element in this.datas.workspaceMembersSet) {
                axios.get(/workspace/ + toRaw(this.datas.workspaceMembersSet[element]).workspaceMembersId)
                    .then(responses => {
                      this.workspaces.push(responses.data)
                    })
              }
            })
        : this.message = "You are not logged in. Log in to access profiles";

  },
  methods: {
    updated() {
      let data1 = this.datas;
      if (this.username !== '') data1.login.username = this.username;
      if (this.email !== '') data1.login.email = this.email;
      if (this.password !== '') data1.login.password = this.password;
      data1 = toRaw(data1)
      axios.patch('/profile/' + data1.profileId + '/update', null, {
        params: {
          "profileId": data1.profileId,
          "email": data1.login.email,
          "password": data1.login.password,
          "username": data1.login.username
        }
      })
          .then(
              response => response.status,
          )
          .catch(err => console.warn(err));

      sessionStorage.setItem('user_name', data1.login.username)
    },
  },
  deleted() {
    axios.delete('/profile/' + this.datas.profileId + '/delete', null,)
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
</script>