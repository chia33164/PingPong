<template>
  <div id="app">
    <!-- <header>
      <span>PingPong</span>
    </header> -->
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app',
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

/* main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
} */
</style>
