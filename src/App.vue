<template>
  <div id="app">
    <header id="root_header">
      <span>PingPong - {{content}}</span>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer id="root_footer">
      <router-link tag="li" to="/">
        <span @click="changeMode" id="0" v-if="mode == 0" style="color:#35495E">首頁</span>
        <span @click="changeMode" id="0" v-else>首頁</span>
      </router-link>
      <router-link tag="li" to="/recordForm">
        <span @click="changeMode" id="1" v-if="mode == 1" style="color:#35495E">紀錄表</span>
        <span @click="changeMode" id="1" v-else>紀錄表</span>
      </router-link>
      <router-link tag="li" to="/databoard">
        <span @click="changeMode" id="2" v-if="mode == 2" style="color:#35495E">歷史紀錄</span>
        <span @click="changeMode" id="2" v-else>歷史紀錄</span>
      </router-link>
      <router-link tag="li" to="/animation">
        <span @click="changeMode" id="3" v-if="mode == 3" style="color:#35495E">歷史動畫</span>
        <span @click="changeMode" id="3" v-else>歷史動畫</span>
      </router-link>
    </footer>
  </div>
</template>

<script>
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'app',
  data () {
    return {
      mode: 0,
      content: '首頁'
    }
  },
  methods: {
    changeMode: function (event) {
      let ID = event.target.id
      let target = document.getElementById(ID)
      this.mode = Number(ID)
      this.content = target.innerText
    }
  },
  mounted () {
    // set horizontal screen
    let detectOrient = function () {
      let width = document.documentElement.clientWidth
      let height = document.documentElement.clientHeight
      let style = ''
      if (width < height) { // 豎屏
        style += 'width:' + height + 'px;'
        style += 'height:' + width + 'px;'
        style += '-webkit-transform: rotate(90deg); transform: rotate(90deg);' // 注意旋轉中點的處理
        style += '-webkit-transform-origin: ' + (width) / 2 + 'px ' + (width) / 2 + 'px;'
        style += 'transform-origin: ' + (width) / 2 + 'px ' + (width) / 2 + 'px;'
      }
      document.getElementById('app').style.cssText = style
    }
    window.onresize = detectOrient
    detectOrient()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 50px;
}

#root_header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  margin: 0;
  height: 50px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

#root_header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}

#root_footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  margin: 0;
  height: 50px;
  padding: 0 16px 0 24px;
  background-color: #ffffff;
  color: #969696;
  border-top: 1px  #969696  solid;
}

#root_footer span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}

</style>
