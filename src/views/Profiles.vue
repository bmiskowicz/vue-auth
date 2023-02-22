<template>
  <div class="form-signin w-100 m-auto">
    {{this.message}}
    <div v-for="(item, id) in this.datas" :key="item.id">
      <a v-bind:href="'/profile/'+ ids[id]">
        {{item[0]}}, {{item[1]}}
        <br>
        <br>
      </a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "ProfilesView",
  data () {
    return {
      datas: {},
      ids: {},
      message: ""

    }
  },
  created() {
    this.$store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
    sessionStorage.getItem('user_name')?
        axios.get('/profile').then(response => {
        var titles = [];
        var id = []
        for(var i = 0; i < response.data.length; i++){
          var users = []
          id.push(response.data[i].profileId);
          users.push(
              response.data[i].login.username,
              response.data[i].login.email,
              response.data[i].icon,
              response.data[i].creationDate,
              response.data[i].workspaceMembersSet
        );
        titles.push(users)
      }
      this.datas = titles
      this.ids = id
      this.message = ''
    }):this.message="You are not logged in. Log in to access profiles";
  },
  methods: {}
}
</script>