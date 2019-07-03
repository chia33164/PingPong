<template>
  <div class="symbol_container">
    <h3>符號</h3>
    <p id="box2" @click="clicked">正手擊球</p>
    <p id="box3" @click="clicked">反手擊球</p>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
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
        if (id === 'box2') {
          this.forehand = '1'
        } else if (id === 'box3') {
          this.backhand = '1'
        }
      } else {
        document.getElementById(id).style.color = ''
        if (id === 'box2') {
          this.forehand = '0'
        } else if (id === 'box3') {
          this.backhand = '0'
        }
      }
    },
    removeAllchose: function () {
      for (let i = 2; i < 4; i++) {
        document.getElementById(`box${i}`).style.color = ''
      }
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
  margin-top: 10px;
}
#box1, #box2, #box3 {
  height: 10px;
  width: 100px;
}
</style>
