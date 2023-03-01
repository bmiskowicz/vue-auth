<template>
  <div class="form-signin m-auto">
    {{this.message}}
    <div v-if="this.auth">
      <form>
        <div v-if="this.isAdmin">
          Issue name:  <input v-model="datas.issueName" type="text" class="form" id="floatingInput">
        </div>

        <div v-if="!this.isAdmin">
        <h4 class="fw-normal">Issue: {{datas.issueName}}</h4>
        </div>

        Issue workspace: <a v-bind:href="'/workspace/'+ this.datas.workspaceId">{{this.workspaceName}}</a><br>
        <div  v-if="this.changeAuth" class="form-floating">
          Issue state: {{datas.state}}   -
          <select v-model=state id="stage" name="stage">
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
        <div v-if="!this.changeAuth">
          Issue state: {{datas.state}}<br>
        </div>

        Issue creation: {{datas.creationDate}}<br>
        <div v-if="this.isAdmin">
          Issue deadline: {{datas.deadline}}
          <div class="form-floating">
            <input v-model=deadline type="datetime-local" class="form" id="deadlineInput">
          </div>
        </div>
        <div v-if="!this.isAdmin">
          Issue deadline: {{datas.deadline}}<br>
        </div>

        <br>
        Issues members:
        <div v-for="(item) in this.issueMembers" :key="item.id">
          <h6><a v-bind:href="'/profile/'+ item.profileId">{{item.login.username}}</a></h6>
          <div v-if="this.isAdmin">
            <div @click="drop(item.profileId)"><button type="button">Drop from issue</button></div>
            <br>
          </div>
        </div>
        <br>
        <div  v-if="this.isAdmin">
          Add to issue:
          <select  v-model=selected>
            <option v-for="option in this.members" :key="option.profileId" :value="option.profileId">{{ option.login.username }}</option>
          </select>
          <br><br>
          <div @click="added()"><button type="button">Add to issue</button></div>
        </div>
        <br>
        <br>

        <div v-if="this.changeAuth">
          <button class="w-100 btn btn-lg btn-primary" type="button" @click="updated()">Update</button>
        </div>
        <br>
        <div v-if="this.isAdmin">
          <button class="w-100 btn btn-lg btn-secondary" type="submit" @click="deleted">Delete</button>
        </div>
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
  name: "IssueView",
  data() {
    return {
      datas: [],
      members: [],
      issueMembers: [],
      message: 'You are not a member of this issue',
      user: sessionStorage.getItem('user_id'),
      isAdmin: false,
      auth: false,
      changeAuth: false,
      name: '',
      description: '',
      workspaceName: '',
      deadline: '',
      state: '',
      selected: '',
    }
  },
  created() {
    this.$store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
    sessionStorage.getItem('user_name') ?
        axios.get(/issues/ + window.location.pathname.slice(7))
            .then(response => {
              response.data ? this.datas = response.data
                  : this.message = "Issue with such ID does not exist";
              this.datas.creationDate = moment(this.datas.creationDate).format('YYYY-MM-DD HH:mm:ss')
              this.datas.deadline = moment(this.datas.deadline).format('YYYY-MM-DD HH:mm:ss')
              let i
              for (i in toRaw(this.datas.profileIssuesSet)) {
                axios.get('/profileissues/' + this.datas.profileIssuesSet[i].piId)
                    .then(response3 => {
                      this.issueMembers.push(response3.data.profile)
                      if (response3.data.profile.login.loginId == sessionStorage.getItem('user_id')) this.changeAuth = true;
                    })
              }
              axios.get('/members/workspace/' + this.datas.workspaceId)
                  .then(response2 => {
                    let i
                    for (i in toRaw(response2.data)) {
                      if (!this.issueMembers.some(function (data) {
                        return data.profileId === response2.data[i].profile.profileId
                      })) this.members.push(response2.data[i].profile)

                      if (toRaw(response2.data)[i].profile.login.loginId == sessionStorage.getItem('user_id')) {
                        this.message = '';
                        this.auth = true;
                        if (toRaw(response2.data)[i].role === "ADMIN") {
                          this.isAdmin = true;
                          this.changeAuth = true;
                        }
                      }
                    }
                  })
              axios.get('/workspace/' + this.datas.workspaceId)
                  .then(response4 => {
                    this.workspaceName = toRaw(response4.data.workspaceName)
                  })
            })
        : this.message = "You are not logged in. Log in to access issues";

  },
  methods: {
    updated() {
      if(this.state === '') this.state = this.datas.state
      if(this.deadline === '')  this.deadline = this.datas.deadline
      let endDateStr = moment(this.deadline).format('YYYY-MM-DD HH:mm:ss')
      let dateNow = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      if(endDateStr > dateNow) {
        axios.put('/issues/'+ this.datas.issueId + '/update', null, {
          params: {
            "issueId": this.datas.issueId,
            "issueName": this.issueName,
            "deadlined": moment(this.deadline).format("YYYY-MM-DDTHH:mm"),
            "state": this.state,
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
    deleted() {
      axios.delete('/issues/' + this.datas.issueId + '/delete', null,)
          .then(
              response => response.status,
          )
          .catch(err => console.warn(err));
      router.push('/profile/issue')
    },
    drop(profileId) {
      axios.delete('/profileissues/delete', {
        params: {
          "profileId": profileId,
          "issueId": window.location.pathname.slice(7)
        }})
          .then(
              response => response.status,
          )
          .catch(err => console.warn(err));
      window.location.reload();
    },
    added() {
      if (this.selected !== undefined) {
        axios.post('/profileissues/post', null, {
          params: {
            "profileId": this.selected,
            "issueId": window.location.pathname.slice(7)
          }
        })
            .then(
                response => response.status,
            )
            .catch(err => console.log(err));
        window.location.reload()
      }
    },
  }
}
</script>

<!--TODO: match backend permissions to frontend permissions-->
<!--TODO: profile icons-->
<!--TODO: front-end style-->