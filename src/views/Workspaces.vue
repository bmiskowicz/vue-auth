<template>
  <div class="form-signin w-100 m-auto">
    {{this.message}}
    <div  v-if="this.auth">
      <form  v-if="isAdmin">
        <h1 class="h3 mb-3 fw-normal">Workspace {{datas.workspaceName}}</h1>

        Workspace name:
        <div class="form-floating">
          <input v-model="this.name" type="text" class="form-control" id="floatingInput" placeholder=''>
          <label for="floatingInput">{{datas.workspaceName}}</label>
        </div>
        <br>

        Workspace description:
        <div class="form-floating">
          <input v-model="this.description" type="text" class="form-control" id="floatingInput" placeholder=''>
          <label for="floatingInput">{{datas.workspaceDescription}}</label>
        </div>

        <br>
        Workspace Members Set:
        <div v-for="(item) in this.members" :key="item.id">
          <a v-bind:href="'/profile/'+ item.profile.profileId">{{item.profile.login.username}}</a>, role: {{item.role}}
          <div v-if="item.role==='USER'" @click="changeRole(item)"><button type="button">Set as admin</button></div>
          <div v-if="item.role==='ADMIN'" @click="changeRole(item)"><button type="button">Set as user</button></div>
          <div  @click="drop"><button type="button">Drop from project</button></div>
          <br>
        </div>

        <br>
        <button class="w-100 btn btn-lg btn-primary" type="button" @click="updated">Update</button>
        <br><br>
          <button class="w-100 btn btn-lg btn-primary" type="submit" @click="deleted">Delete</button>
      </form>

      <div v-if="!isAdmin">
        Workspace name: {{datas.workspaceName}}<br><br>
        Workspace description: {{datas.workspaceDescription}}<br><br>
        Workspace Members Set:
        <div v-for="(item) in this.members" :key="item.id">
          <a v-bind:href="'/profile/'+ item.profile.profileId">{{item.profile.login.username}}</a>, role: {{item.role}}
        </div>
      </div>

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
      members: [],
      message: 'You are not a member of this workspace',
      user: sessionStorage.getItem('user_id'),
      isAdmin: false,
      auth: false,
      name: '',
      description: '',
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
      if (this.name !== '') this.datas.workspaceName = this.name;
      if (this.description !== '') this.datas.workspaceDescription = this.description;
      axios.put('/workspace/' + this.datas.workspaceId + '/update', null, {
        params: {
          "workspaceName": this.datas.workspaceName,
          "workspaceDescription": this.datas.workspaceDescription
        }
      })
          .then(
              response => response.status,
          )
          .catch(err => console.log(err));
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
    },
    changeRole(data) {
      data.role = data.role==='ADMIN'?data.role="USER":data.role="ADMIN";
      axios.put('/members/' + data.workspaceMembersId + '/update',  null, {
        params: {
          "role": data.role,
        },
        headers:{
          "Authorization": sessionStorage.getItem('token')
        }
      })
          .then(
              response => response.status,
          )
          .catch(err => console.log(err));
    },
    drop() {
      console.log("DROP!")
      // axios.delete('/workspace/' + this.datas.workspaceId + '/delete', null,)
      //     .then(
      //         response => response.status,
      //     )
      //     .catch(err => console.warn(err));
      // this.$router.go()
      // router.push('/workspace')
      // window.location.reload();
    }
  }
}
</script>