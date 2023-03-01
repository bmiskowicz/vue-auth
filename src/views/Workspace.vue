<template>
  <div class="form-signin w-100 m-auto">
    {{this.message}}
    <div  v-if="this.auth">
      <form  v-if="isAdmin">
        <h4>Workspace name:</h4>
        <div class="form-floating">
          <input v-model="this.name" type="text" class="form-control" id="floatingInput" placeholder='{{datas.workspaceName}}'>
          <label for="floatingInput">{{datas.workspaceName}}</label>
        </div>
        <br>

        <h5>Workspace description:</h5>
        <div class="form-floating">
          <input v-model="this.description" type="text" class="form-control" id="floatingInput" placeholder='{{datas.workspaceDescription}}'>
          <label for="floatingInput">{{datas.workspaceDescription}}</label>
        </div>

        <br>
        <h5>Workspace Members:</h5>
        <div v-for="(item) in this.members" :key="item.id">
          <a v-bind:href="'/profile/'+ item.profile.profileId">{{item.profile.login.username}}</a>, role: {{item.role}}
          <div v-if="item.role==='USER'" @click="changeRole(item)"><button type="button">Set as admin</button></div>
          <div v-if="item.role==='ADMIN'" @click="changeRole(item)"><button type="button">Set as user</button></div>
          <div  @click="drop(item.profile.profileId)"><button type="button">Drop from project</button></div>
          <br>
        </div>

        <br>
        <button class="w-100 btn btn-lg btn-primary" type="button" @click="updated">Update</button>
        <br><br>
          <button class="w-100 btn btn-lg btn-secondary" type="submit" @click="deleted">Delete</button>
      </form>

      <div v-if="!isAdmin">
        <h4>Workspace name:</h4> {{datas.workspaceName}}<br><br>
        <h5>Workspace description:</h5> {{datas.workspaceDescription}}<br><br>
        <h5>Workspace members:</h5>
        <div v-for="(item) in this.members" :key="item.id">
          <a v-bind:href="'/profile/'+ item.profile.profileId">{{item.profile.login.username}}</a>, role: {{item.role}}
        </div>
      </div>

      <br>
      <h5>Issues: </h5>
      <div v-for="(item, id) in this.issues" :key="item.id">
        <a v-bind:href="'/issue/'+ this.issues[id].issueId">
          Issue: {{ this.issues[id].issueName }}
        </a>
        <br>
          IssueState: {{ this.issues[id].state }}
        <br>
        <br>
      </div>



      <br>
      <form  v-if="isAdmin">
        Issue name:
        <div class="form-floating">
          <input v-model="this.issueName" type="text" class="form-control" id="floatingInput" placeholder=''>
        </div>
        <br>

        Deadline:
        <div class="form-floating">
          <input v-model="this.issueDeadline" type="datetime-local" class="form-control" id="floatingInput" placeholder=''>
        </div>

        <br>
        <button class="w-100 btn btn-lg btn-primary" type="button" @click="createdIssue">Create issue</button>

        <br><br>

        <div v-for="(item, id) in this.invites" :key="item.id">
          <a v-bind:href="'/profile/'+ this.invites[id].profile.login.loginId">
            User: {{ this.invites[id].profile.login.username}}
          </a>
          <div @click="deleteInvitation(this.invites[id].workspaceInvitationId)"><button type="button">Delete invitation</button></div>
          <br>
        </div>

        <br><br>

        Send invitation:  <input v-model="this.username" type="text" class="form" id="floatingInput">
        <div @click="inviteUser()"><button type="button">Invite</button></div>
      </form>


      </div>
    </div>
</template>

<script>
import axios from 'axios'
import {toRaw} from "vue";
import router from "@/router";
import moment from "moment"

export default {
  name: "WorkspaceView",
  data() {
    return {
      datas: [],
      members: [],
      issues: [],
      invites: [],
      message: 'You are not a member of this workspace',
      user: sessionStorage.getItem('user_id'),
      isAdmin: false,
      auth: false,
      name: '',
      description: '',
      issueName: '',
      issueDeadline: '',
      username: ''
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
                    for (i in this.members) {
                      if (this.members[i].profile.login.loginId == sessionStorage.getItem('user_id')) {
                        this.message = '';
                        this.auth = true;
                        if (this.members[i].role === "ADMIN") this.isAdmin = true;
                      }
                    }
                  })
              axios.get('/issues/' + window.location.pathname.slice(11) + '/issues')
                  .then(response3 => {
                    this.issues = toRaw(response3.data)
                  })
              axios.get('/invite/workspace/' + window.location.pathname.slice(11))
                  .then(response4 => {
                    this.invites = toRaw(response4.data)
                  })
            })
        : this.message = "You are not logged in. Log in to access workspaces";

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
      data.role = data.role === 'ADMIN' ? data.role = "USER" : data.role = "ADMIN";
      axios.put('/members/' + data.workspaceMembersId + '/update', null, {
        params: {
          "role": data.role,
        },
        headers: {
          "Authorization": sessionStorage.getItem('token')
        }
      })
          .then(
              response => response.status,
              window.location.reload(),
          )
          .catch(err => console.log(err));
    },
    createdIssue() {
      let endDateStr = moment(this.issueDeadline).format('YYYY-MM-DD HH:mm:ss')
      let dateNow = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      if (endDateStr > dateNow) {
        axios.post('/issues/post', null, {
          params: {
            "issueName": this.issueName,
            "deadlined": this.issueDeadline,
            "workspaceId": window.location.pathname.slice(11),
          },
          headers: {
            "Authorization": sessionStorage.getItem('token')
          }
        })
            .then(
                response => response.status,
                window.location.reload(),
            )
            .catch(err => console.log(err));
      }
    },
    drop(profileId) {
      axios.delete('/members/delete', {
        params: {
          "profileId": profileId,
          "workspaceId": window.location.pathname.slice(11)
        },
        headers: {
          "Authorization": sessionStorage.getItem('token')
        }
      })
          .then(
              response => response.status,
          )
          .catch(err => console.warn(err));
      window.location.reload();
    },
    deleteInvitation(data) {
      axios.delete('/invite/delete/' + data, {
          headers: {
        "Authorization": sessionStorage.getItem('token')
      }
      })
          .then(
              response => response.status,
          )
          .catch(err => console.warn(err));
      window.location.reload();
    },
    inviteUser() {
      if (this.username !== '') {
        axios.post('/invite/', null, {
          params: {
            "username": this.username,
            "workspaceId": window.location.pathname.slice(11),
          },
          headers: {
            "Authorization": sessionStorage.getItem('token')
          }
        })
            .then(
                response => response.status,
                window.location.reload(),
            )
            .catch(err => console.log(err));
      }
    }
  },
}
</script>