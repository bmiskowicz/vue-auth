<template>
  <div class="form-signin m-auto">
    {{this.message}}
    <div  v-if="this.auth">
      <form  v-if="isAdmin">
        <h3 class="h3 mb-3 fw-normal">Issue: {{datas.issueName}}</h3>
        Issue workspace: {{datas.workspaceName}}<br>
        Issue creation: {{datas.creationDate}}<br>
        Issue deadline: {{datas.deadline}}<br>
<!--        Issue name:-->
<!--        <div class="form-floating">-->
<!--          <input v-model="this.name" type="text" class="form-control" id="floatingInput" placeholder=''>-->
<!--          <label for="floatingInput">{{datas.issueName}}</label>-->
<!--        </div>-->
<!--        <br>-->

<!--        Issue description:-->
<!--        <div class="form-floating">-->
<!--          <input v-model="this.description" type="text" class="form-control" id="floatingInput" placeholder=''>-->
<!--          <label for="floatingInput">{{datas.issueDescription}}</label>-->
<!--        </div>-->

        <br>
        Issues members:
        <div v-for="(item) in this.issueMembers" :key="item.id">
          <a v-bind:href="'/profile/'+ item.profile.profileId">{{item.profile.login.username}}</a>
<!--          <div v-if="item.role==='USER'" @click="changeRole(item)"><button type="button">Set as admin</button></div>-->
<!--          <div v-if="item.role==='ADMIN'" @click="changeRole(item)"><button type="button">Set as user</button></div>-->
<!--          <div  @click="drop"><button type="button">Drop from project</button></div>-->
          <br>
        </div>

        <br>
        <button class="w-100 btn btn-lg btn-primary" type="button" @click="updated">Update</button>
        <br><br>
        <button class="w-100 btn btn-lg btn-primary" type="submit" @click="deleted">Delete</button>
      </form>

      <div v-if="!isAdmin">
        Issue name: {{datas.issueName}}<br><br>
        Issue creation date: {{datas.creationDate}}<br><br>
        Issue Members:
        <div v-for="(item) in this.issueMembers" :key="item.id">
          <a v-bind:href="'/profile/'+ item.profile.profileId">{{item.profile.login.username}}</a>
        </div>
      </div>

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
      name: '',
      description: '',
    }
  },
  created() {
    this.$store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
    sessionStorage.getItem('user_name') ?
        axios.get(/issues/ + window.location.pathname.slice(7))
            .then(response => {
              response.data ? this.datas = response.data
                  : this.message = "Issue with such ID does not exist";
              console.log(this.datas);
              this.datas.creationDate = moment(this.datas.creationDate).format('YYYY-MM-DD HH:mm:ss')
              this.datas.deadline = moment(this.datas.deadline).format('YYYY-MM-DD HH:mm:ss')
              let i
              for(i in toRaw(this.datas.profileIssuesSet)){
                  axios.get('/profileissues/' + this.datas.profileIssuesSet[i].piId)
                      .then(response3 => {
                        this.issueMembers.push(response3.data)
                        if(response3.data.profile.login.loginId == sessionStorage.getItem('user_id')) this.auth = true;
                      })
              }

              axios.get('/members/workspace/' + this.datas.workspaceId)
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
      // if (this.name !== '') this.datas.issueName = this.name;
      // if (this.description !== '') this.datas.issueDescription = this.description;
      // axios.put('/issues/' + this.datas.issueId + '/update', null, {
      //   params: {
      //     "issueName": this.datas.workspaceName,
      //     "issueDescription": this.datas.issueDescription
      //   }
      // })
      //     .then(
      //         response => response.status,
      //     )
      //     .catch(err => console.log(err));
    },
    deleted() {
      axios.delete('/issues/' + this.datas.issueId + '/delete', null,)
          .then(
              response => response.status,
          )
          .catch(err => console.warn(err));
      this.$router.go()
      router.push('/issue')
      window.location.reload();
    },
    changeRole(data) {
      // data.role = data.role==='ADMIN'?data.role="USER":data.role="ADMIN";
      // axios.put('/members/' + data.issueMembersId + '/update',  null, {
      //   params: {
      //     "role": data.role,
      //   },
      //   headers:{
      //     "Authorization": sessionStorage.getItem('token')
      //   }
      // })
      //     .then(
      //         response => response.status,
      //     )
      //     .catch(err => console.log(err));
    },
  }
}
</script>



<!--TODO: w issue zrobić klasycznie przeglądanie issue;
      jeśli jest się adminem nadrzędnego workspace albo pracuje się w tym issue to można zmieniać issue
      (pracownik stan, może sam z niego wyjść, admin nazwę i członków albo usuwać je-->
<!--TODO: w workspace dodać zaproszenia -->
<!--TODO: w workspace dodać zaproszenia dla kogoś -->