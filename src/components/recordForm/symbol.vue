<template>
  <div class="symbol_container">
    <h3>代表符號</h3>
    <p id="box1" @click="clicked">發球方</p>
    <p id="box2" @click="clicked">正手擊球</p>
    <p id="box3" @click="clicked">反手擊球</p>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      serve: '0',
      forehand: '0',
      backhand: '0'
    }
  },
  methods: {
    clicked: function (e) {
      let id = e.target.id
      let color = document.getElementById(id).style.color
      if (color !== 'red') {
        document.getElementById(id).style.color = 'red'
        if (id === 'box1') {
          this.serve = '1'
        } else if (id === 'box2') {
          this.forehand = '1'
        } else if (id === 'box3') {
          this.backhand = '1'
        }
      } else {
        document.getElementById(id).style.color = ''
        if (id === 'box1') {
          this.serve = '0'
        } else if (id === 'box2') {
          this.forehand = '0'
        } else if (id === 'box3') {
          this.backhand = '0'
        }
      }
    },
    removeAllchose: function () {
      for (let i = 1; i < 4; i++) {
        document.getElementById(`box${i}`).style.color = ''
      }
      this.serve = '0'
      this.forehand = '0'
      this.backhand = '0'
    }

  }
}
</script>

<style>
.symbol_container {
  display: flex;
  flex-direction: column;
  text-align: left;
}
#box1, #box2, #box3 {
  height: 10px;
  width: 100px;
}
</style>
