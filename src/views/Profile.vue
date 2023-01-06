<template>
  <div>
    <div v-for="(item) in this.datas" :key="item.id">
      {{item}}. {{item.data}}
    </div>
  </div>
</template>

<script>
import axios from 'axios'
let datas = {}


export default {
  name: "ProfileView",
  data () {
    return {
      datas: {},
    }
  },
  created() {
    this.$store.dispatch('setAuth', !!sessionStorage.getItem('user_name'));
    sessionStorage.getItem('user_name')?datas=axios.get('/profile').then(response => {this.datas = response.data}):datas='';
  },
  methods: {}
}

</script>