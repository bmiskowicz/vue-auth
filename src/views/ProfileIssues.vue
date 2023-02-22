<template>
  <div class="form-signin w-100 m-auto">
    {{this.message}}
    <a style="font-weight: bolder">Your Issues:</a>
    <br>
    <div v-for="(item, id) in this.issues" :key="item.id">
      <a v-bind:href="'/issue/'+ this.issues[id].issueId">
        Issue: {{ this.issues[id].issueName }}
      </a>
      <br>
      Issue status: {{ this.issues[id].state }}
      <br>
      Deadline date: {{ this.issues[id].deadline.toString().slice(0, 10) }}
      <br>
      Workspace:  <a v-bind:href="'/workspace/'+ this.issues[id].workspaceId">
      {{ this.issues[id].workspaceId }}
      </a>
      <br>
      <br>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {toRaw} from "vue";

export default {
  name: "ProfileIssuesView",
  data() {
    return {
      datas: [],
      issues: [],
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
              for (element in toRaw(this.datas.profileIssuesSet)) {
                axios.get(/issues/ + toRaw(this.datas.profileIssuesSet[element]).piId)
                    .then(responses => {
                      this.issues.push(responses.data)
                    })
              }
            })
        : this.message = "You are not logged in. Log in to access profiles";

  },
  methods: {
  }
}
</script>