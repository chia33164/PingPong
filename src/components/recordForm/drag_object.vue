<template>
  <div class="container">
    <div class="table_container">
      <div>
        <Block id="group1"></Block>
        <Block id="group2"></Block>
        <Block id="group3"></Block>
      </div>
      <div class="BottomRed">
        <Block id="group4"></Block>
        <Block id="group5"></Block>
        <Block id="group6"></Block>
      </div>
      <div class="TopRed">
        <Block id="group7"></Block>
        <Block id="group8"></Block>
        <Block id="group9"></Block>
      </div>
      <div>
        <Block id="group10"></Block>
        <Block id="group11"></Block>
        <Block id="group12"></Block>
      </div>
    </div>
    <br>
    <div>
      <input type="radio" id="top" value="top" v-model="station">
      <label for="top">top</label>
      <input type="radio" id="bottom" value="bottom" v-model="station">
      <label for="bottom">bottom</label>
    </div>
  </div>
</template>

<script>
import Block from './perBlock.vue'

export default {
  data: function () {
    return {
      table_position: '',
      block_part: '0',
      station: '',
      x: 0,
      y: 0,
      getpoint: false,
      serve_point: false
    }
  },
  components: {
    Block
  },
  methods: {
    initialTouch: function () {
      let getPoint = document.getElementById('getPoint')
      let lostPoint = document.getElementById('lostPoint')
      let servePoint = document.getElementById('servePoint')
      servePoint.style.left = 920 + 'px'
      servePoint.style.top = 235 + 'px'
      getPoint.style.left = 920 + 'px'
      getPoint.style.top = 278 + 'px'
      lostPoint.style.left = 920 + 'px'
      lostPoint.style.top = 320 + 'px'
      this.serve_point = false
      this.getpoint = false
      this.station = ''
      let i = 1
      for (i = 1; i <= 12; i++) {
        document.getElementById(`group${i}`).style.background = 'green'
      }
    },
    judgeBlockpart: function (x, y, draggable) {
      if (this.x >= x && this.x <= x + 50) {
        draggable.style.left = (x + 25) + 'px'
        if (this.y >= y && this.y <= y + 50) {
          this.block_part = 'part1'
          draggable.style.top = (y + 25) + 'px'
        } else if (this.y > y + 50 && this.y <= y + 100) {
          this.block_part = 'part2'
          draggable.style.top = (y + 75) + 'px'
        } else if (this.y > y + 100 && this.y <= y + 150) {
          this.block_part = 'part3'
          draggable.style.top = (y + 125) + 'px'
        }
      } else if (this.x >= x + 50 && this.x <= x + 100) {
        draggable.style.left = (x + 75) + 'px'
        if (this.y >= y && this.y <= y + 50) {
          this.block_part = 'part4'
          draggable.style.top = (y + 25) + 'px'
        } else if (this.y > y + 50 && this.y <= y + 100) {
          this.block_part = 'part5'
          draggable.style.top = (y + 75) + 'px'
        } else if (this.y > y + 100 && this.y <= y + 150) {
          this.block_part = 'part6'
          draggable.style.top = (y + 125) + 'px'
        }
      } else if (this.x >= x + 100 && this.x <= x + 150) {
        draggable.style.left = (x + 125) + 'px'
        if (this.y >= y && this.y <= y + 50) {
          this.block_part = 'part7'
          draggable.style.top = (y + 25) + 'px'
        } else if (this.y > y + 50 && this.y <= y + 100) {
          this.block_part = 'part8'
          draggable.style.top = (y + 75) + 'px'
        } else if (this.y > y + 100 && this.y <= y + 150) {
          this.block_part = 'part9'
          draggable.style.top = (y + 125) + 'px'
        }
      }
    },
    changeColor: function () {
      let top = document.getElementById('top')
      let bottom = document.getElementById('bottom')
      top.addEventListener('click', (event) => {
        let i = 1
        for (; i <= 6; i++) {
          document.getElementById(`group${i}`).style.backgroundColor = 'blue'
        }
        for (i = 7; i <= 12; i++) {
          document.getElementById(`group${i}`).style.backgroundColor = 'green'
        }
      })
      bottom.addEventListener('click', (event) => {
        let i = 1
        for (; i <= 6; i++) {
          document.getElementById(`group${i}`).style.backgroundColor = 'green'
        }
        for (i = 7; i <= 12; i++) {
          document.getElementById(`group${i}`).style.backgroundColor = 'blue'
        }
      })
    },
    initTouch: function () {
      let getPoint = document.getElementById('getPoint')
      let lostPoint = document.getElementById('lostPoint')
      let servePoint = document.getElementById('servePoint')
      // when touchmove
      getPoint.addEventListener('touchmove', (event) => {
        let touch = event.targetTouches[0]
        // place element where the finger is
        getPoint.style.left = touch.pageX - 25 + 'px'
        getPoint.style.top = touch.pageY - 25 + 'px'
        this.x = touch.pageX - 25
        this.y = touch.pageY - 25
        event.preventDefault()
      }, false)

      lostPoint.addEventListener('touchmove', (event) => {
        let touch = event.targetTouches[0]
        // place element where the finger is
        lostPoint.style.left = touch.pageX - 25 + 'px'
        lostPoint.style.top = touch.pageY - 25 + 'px'
        this.x = touch.pageX - 25
        this.y = touch.pageY - 25
        event.preventDefault()
      }, false)

      servePoint.addEventListener('touchmove', (event) => {
        let touch = event.targetTouches[0]
        // place element where the finger is
        servePoint.style.left = touch.pageX - 25 + 'px'
        servePoint.style.top = touch.pageY - 25 + 'px'
        this.x = touch.pageX - 25
        this.y = touch.pageY - 25
        event.preventDefault()
      }, false)

      // when touchend
      getPoint.addEventListener('touchend', (event) => {
        if (this.x >= 430 && this.x <= 580) {
          if (this.y >= 0 && this.y <= 150) {
            // group1
            this.table_position = '1'
            this.judgeBlockpart(430, 0, getPoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group4
            this.table_position = '4'
            this.judgeBlockpart(430, 150, getPoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group7
            this.table_position = '6'
            this.judgeBlockpart(430, 300, getPoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group10
            this.table_position = '3'
            this.judgeBlockpart(430, 450, getPoint)
          }
        } else if (this.x >= 580 && this.x <= 730) {
          if (this.y >= 0 && this.y <= 150) {
            // group2
            this.table_position = '2'
            this.judgeBlockpart(580, 0, getPoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group5
            this.table_position = '5'
            this.judgeBlockpart(580, 150, getPoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group8
            this.table_position = '5'
            this.judgeBlockpart(580, 300, getPoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group11
            this.table_position = '2'
            this.judgeBlockpart(580, 450, getPoint)
          }
        } else if (this.x >= 730 && this.x <= 880) {
          if (this.y >= 0 && this.y <= 150) {
            // group3
            this.table_position = '3'
            this.judgeBlockpart(730, 0, getPoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group6
            this.table_position = '6'
            this.judgeBlockpart(730, 150, getPoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group9
            this.table_position = '4'
            this.judgeBlockpart(730, 300, getPoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group12
            this.table_position = '1'
            this.judgeBlockpart(730, 450, getPoint)
          }
        } else {
          // go back init position
          this.table_position = ''
          getPoint.style.left = 920 + 'px'
          getPoint.style.top = 278 + 'px'
        }
        this.serve_point = false
        this.getpoint = true
        event.preventDefault()
      }, false)

      lostPoint.addEventListener('touchend', (event) => {
        if (this.x >= 430 && this.x <= 580) {
          if (this.y >= 0 && this.y <= 150) {
            // group1
            this.table_position = '1'
            this.judgeBlockpart(430, 0, lostPoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group4
            this.table_position = '4'
            this.judgeBlockpart(430, 150, lostPoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group7
            this.table_position = '6'
            this.judgeBlockpart(430, 300, lostPoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group10
            this.table_position = '3'
            this.judgeBlockpart(430, 450, lostPoint)
          }
        } else if (this.x >= 580 && this.x <= 730) {
          if (this.y >= 0 && this.y <= 150) {
            // group2
            this.table_position = '2'
            this.judgeBlockpart(580, 0, lostPoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group5
            this.table_position = '5'
            this.judgeBlockpart(580, 150, lostPoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group8
            this.table_position = '5'
            this.judgeBlockpart(580, 300, lostPoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group11
            this.table_position = '2'
            this.judgeBlockpart(580, 450, lostPoint)
          }
        } else if (this.x >= 730 && this.x <= 880) {
          if (this.y >= 0 && this.y <= 150) {
            // group3
            this.table_position = '3'
            this.judgeBlockpart(730, 0, lostPoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group6
            this.table_position = '6'
            this.judgeBlockpart(730, 150, lostPoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group9
            this.table_position = '4'
            this.judgeBlockpart(730, 300, lostPoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group12
            this.table_position = '1'
            this.judgeBlockpart(730, 450, lostPoint)
          }
        } else {
          // go back init position
          this.table_position = ''
          lostPoint.style.left = 920 + 'px'
          lostPoint.style.top = 320 + 'px'
        }
        this.serve_point = false
        this.getpoint = false
        event.preventDefault()
      }, false)

      servePoint.addEventListener('touchend', (event) => {
        if (this.x >= 430 && this.x <= 580) {
          if (this.y >= 0 && this.y <= 150) {
            // group1
            this.table_position = '1'
            this.judgeBlockpart(430, 0, servePoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group4
            this.table_position = '4'
            this.judgeBlockpart(430, 150, servePoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group7
            this.table_position = '6'
            this.judgeBlockpart(430, 300, servePoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group10
            this.table_position = '3'
            this.judgeBlockpart(430, 450, servePoint)
          }
        } else if (this.x >= 580 && this.x <= 730) {
          if (this.y >= 0 && this.y <= 150) {
            // group2
            this.table_position = '2'
            this.judgeBlockpart(580, 0, servePoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group5
            this.table_position = '5'
            this.judgeBlockpart(580, 150, servePoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group8
            this.table_position = '5'
            this.judgeBlockpart(580, 300, servePoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group11
            this.table_position = '2'
            this.judgeBlockpart(580, 450, servePoint)
          }
        } else if (this.x >= 730 && this.x <= 880) {
          if (this.y >= 0 && this.y <= 150) {
            // group3
            this.table_position = '3'
            this.judgeBlockpart(730, 0, servePoint)
          } else if (this.y >= 150 && this.y <= 300) {
            // group6
            this.table_position = '6'
            this.judgeBlockpart(730, 150, servePoint)
          } else if (this.y >= 300 && this.y <= 450) {
            // group9
            this.table_position = '4'
            this.judgeBlockpart(730, 300, servePoint)
          } else if (this.y >= 450 && this.y <= 600) {
            // group12
            this.table_position = '1'
            this.judgeBlockpart(730, 450, servePoint)
          }
        } else {
          // go back init position
          this.table_position = ''
          servePoint.style.left = 920 + 'px'
          servePoint.style.top = 235 + 'px'
        }
        this.serve_point = true
        this.getpoint = true
        event.preventDefault()
      }, false)
    }
  },
  mounted () {
    this.initTouch()
    this.changeColor()
  }
}
</script>

<style>
.dragBlock {
  width: 60px;
  height: 40px;
  border: 1px solid black;
}
#group1, #group2, #group3, #group4, #group5, #group6, #group7, #group8, #group9, #group10, #group11, #group12 {
  background-color: green;
  border: 1px solid black;
  width: 150px;
  height: 150px;
}
.table_container {
  display: flex;
  flex-direction: column;
}
.table_container > div {
  display: flex;
  flex-direction: row;
}
#getPoint {
  position:absolute;
  left: 920px;
  top: 278px;
}
#lostPoint {
  position:absolute;
  left: 920px;
  top: 320px;
}
#servePoint {
  position:absolute;
  left: 920px;
  top: 235px;
}
#group4, #group5, #group6 {
  border-bottom-color: red;
}
#group7, #group8, #group9 {
  border-top-color: red;
}
</style>
