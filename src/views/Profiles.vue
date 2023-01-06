<template>
  <div>
      {{datas}}. {{datas.data}}
  </div>
</template>

<script>
import axios from 'axios'
let datas = {}


export default {
  name: "ProfilesView",
  data () {
    return {
      datas: {},
    }
  },
  created() {
    this.$store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
    sessionStorage.getItem('user_name')?datas=axios.get(window.location.pathname).then(response => {this.datas = response.data}):datas='';
  },
  methods: {}
}

</script>