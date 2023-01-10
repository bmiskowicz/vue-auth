<template>
  <div class="form-signin w-100 m-auto">
    {{this.message}}
    <div  v-if="this.auth">
      Workspace name: {{datas.workspaceName}}<br><br>
      Workspace description: {{datas.workspaceDescription}}<br><br>
      Workspace Members Set:
      <div v-for="(item) in this.members" :key="item.id">
        <a v-bind:href="'/profile/'+ item.profile.profileId">{{item.profile.login.username}}</a>, role: {{item.role}}
      </div>

      <br><br>
      <div v-if="isAdmin">
        <button class="w-100 btn btn-lg btn-primary" type="submit" @click="deleted">Delete</button>
      </div>

    </div>

<!--    <div v-for="(item, id) in this.datas" :key="item.id">-->
<!--      <a v-bind:href="'/workspace/'+ this.workspaces[id].workspaceId">-->
<!--        Workspace: {{ this.workspaces[id].workspaceName }}-->
<!--      </a>-->
<!--      <br>-->
<!--      Workspace description: <br> {{ this.workspaces[id].workspaceDescription }}-->
<!--      <br>-->
<!--      <br>-->
<!--    </div>-->
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
      members: [],
      message: 'You are not a member of this workspace',
      user: sessionStorage.getItem('user_id'),
      isAdmin: false,
      auth: false,
    }
  },
  created() {
    this.$store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
    sessionStorage.getItem('user_name') ?
        axios.get(/workspace/ + window.location.pathname.slice(11))
            .then(response => {
              response.data ? this.datas = response.data
                  : this.message = "Workspace with such ID does not exist";
                  axios.get('/members/workspace/' + window.location.pathname.slice(11))
                      .then(response2 => {
                        this.members = toRaw(response2.data)
                        let i
                        for (i in this.members){
                          if(this.members[i].profile.login.loginId == sessionStorage.getItem('user_id')) {
                            this.message = '';
                            this.auth = true;
                            if(this.members[i].role === "ADMIN") this.isAdmin = true;
                          }
                        }
                      })
            })
        : this.message = "You are not logged in. Log in to access profiles";

  },
  methods: {
    updated() {
      // let data1 = this.datas;
      // if (this.username !== '') data1.login.username = this.username;
      // if (this.email !== '') data1.login.email = this.email;
      // if (this.password !== '') data1.login.password = this.password;
      // data1 = toRaw(data1)
      // axios.patch('/profile/' + data1.profileId + '/update', null, {
      //   params: {
      //     "profileId": data1.profileId,
      //     "email": data1.login.email,
      //     "password": data1.login.password,
      //     "username": data1.login.username
      //   }
      // })
      //     .then(
      //         response => response.status,
      //     )
      //     .catch(err => console.warn(err));
      //
      // sessionStorage.setItem('user_name', data1.login.username)
    },
  deleted() {
    axios.delete('/workspace/' + this.datas.workspaceId + '/delete', null,)
        .then(
            response => response.status,
        )
        .catch(err => console.warn(err));
    this.$router.go()
    router.push('/workspace')
    window.location.reload();
  }
  },
}
</script>