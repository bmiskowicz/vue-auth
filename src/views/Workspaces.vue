<template>
  <div class="form-signin w-100 m-auto">
    {{this.message}}
    <form>
      <h1 class="h3 mb-3 fw-normal">Create new workspace</h1>

      <div class="form-floating">
        <input v-model="this.name" type="text" class="form-control" id="floatingInput" placeholder=''>
        <label for="floatingInput">{{"Workspace name:"}}</label>
      </div>
      <br>
      <div class="form-floating">
        <input v-model="this.description" type="text" class="form-control" id="floatingInput" placeholder=''>
        <label for="floatingInput">{{"Workspace description:"}}</label>
      </div>
      <br>
      <button class="w-100 btn btn-lg btn-primary" type="submit" @click="create">Create</button>
    </form>
    <br>

    <a style="font-weight: bolder">Your workspaces:</a>
    <br>
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

export default {
  name: "WorkspacesView",
  data() {
    return {
      datas: [],
      workspaces: [],
      message: '',
      user: sessionStorage.getItem('user_id'),
      name : '',
      description: '',
    }
  },
  created() {
    this.message = ''
    this.$store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
    sessionStorage.getItem('user_name') ?
        axios.get(/profile/ + sessionStorage.getItem('user_id'))
            .then(response => {
              response.data ? this.datas = response.data
                  : this.message = "Profile with such ID does not exist";
              let element
              for (element in this.datas.workspaceMembersSet) {
                axios.get(/members/ + toRaw(this.datas.workspaceMembersSet[element]).workspaceMembersId)
                    .then(responses => {
                      this.workspaces.push(responses.data.workspace)
                    })
              }
            })
        : this.message = "You are not logged in. Log in to access profiles";

  },
  methods: {
    create() {
      if (this.name !== '') {
        console.log(sessionStorage.getItem('token'))
        console.log("")
        axios.post('/workspace/post', null, {
          params: {
            "workspaceName": this.name,
            "workspaceDescription": this.description,
          },
          headers:{
            "Authorization": sessionStorage.getItem('token')
          }
        })
            .then(
                response => response.status,
            )
            .catch(err => console.warn(err));
      }
    }
  }
}
</script>