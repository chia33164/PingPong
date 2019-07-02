<template>
  <div class="root">
    <h1>{{ msg }}</h1>
    <!-- <button @click='showHistory = true'> show </button>
    <History v-if='showHistory' @close='showHistory = false'></History> -->
    <div>{{ count }}</div>
  </div>
</template>

<script>
import History from './recordForm/showHistory'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'PingPong'
      // showHistory: false
    }
  },
  components: {
    History
  },
  computed: {
    count () {
      // this.$store.dispatch('getPlayerBalls', 'chia').then(res => {
      // })
      // return this.$store.state.players
      this.$store.dispatch('getParsedData').then()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.root {
  text-align: center;
}

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
