<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <router-link tag="li" to="/recordForm">
      <a>record</a>
    </router-link>
    <router-link tag="li" to="/databoard">
      <a>databoard</a>
    </router-link>
    <!-- <button @click='showHistory = true'> show </button>
    <History v-if='showHistory' @close='showHistory = false'></History> -->
    <!-- <div>{{ count }}</div> -->
  </div>
</template>

<script>
import History from './recordForm/showHistory'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to PingPong',
      showHistory: false
    }
  },
  components: {
    History
  }
  // computed: {
  //   count () {
  //     this.$store.dispatch('getPlayerBalls', 'chia').then(res => {
  //     })
  //     return this.$store.state.players
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}

</style>
