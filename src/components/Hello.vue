<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <router-link tag="li" to="/recordForm">
      <a>record</a>
    </router-link>
    <!-- <div>{{ count }}</div> -->
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to PingPong'
    }
  }
  // computed: {
  //   count () {
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
