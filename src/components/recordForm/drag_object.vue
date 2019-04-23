<template>
  <div class="container">
    <svg class="table_container" width="450" height="600">
      <g>
        <Block ref="block1" id="group1" x='0' y='0'></Block>
        <Block ref="block2" id="group2" x='150' y='0'></Block>
        <Block ref="block3" id="group3" x='300' y='0'></Block>
      </g>
      <g>
        <Block ref="block4" id="group4" x='0' y='150'></Block>
        <Block ref="block5" id="group5" x='150' y='150'></Block>
        <Block ref="block6" id="group6" x='300' y='150'></Block>
      </g>
      <g>
        <Block ref="block7" id="group7" x='0' y='300'></Block>
        <Block ref="block8" id="group8" x='150' y='300'></Block>
        <Block ref="block9" id="group9" x='300' y='300'></Block>
      </g>
      <g>
        <Block ref="block10" id="group10" x='0' y='450'></Block>
        <Block ref="block11" id="group11" x='150' y='450'></Block>
        <Block ref="block12" id="group12" x='300' y='450'></Block>
      </g>
      <line id='test1' :x1="prev_x-430" :y1="prev_y" :x2="x-430" :y2="y" stroke='red' v-if="drawLine"/>
      <line id='test2' x1='0' y1='300' x2='450' y2='300' stroke='red'/>
    </svg>
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
      placement: '',
      prev_placement: '',
      block_part: '0',
      prev_block_part: '0',
      station: '',
      prev_x: 0,
      prev_y: 0,
      x: 0,
      y: 0,
      getpoint: false,
      serve_point: false,
      pressTimer: null,
      presslong: false,
      drawLine: false
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
    },
    judgeBlockpart: function (x, y, draggable) {
      if (this.x >= x && this.x <= x + 50) {
        draggable.style.left = (x + 25) + 'px'
        this.x = x + 25
        if (this.y >= y && this.y <= y + 50) {
          this.block_part = 'part1'
          draggable.style.top = (y + 25) + 'px'
          this.y = y + 25
        } else if (this.y > y + 50 && this.y <= y + 100) {
          this.block_part = 'part2'
          draggable.style.top = (y + 75) + 'px'
          this.y = y + 75
        } else if (this.y > y + 100 && this.y <= y + 150) {
          this.block_part = 'part3'
          draggable.style.top = (y + 125) + 'px'
          this.y = y + 125
        }
      } else if (this.x >= x + 50 && this.x <= x + 100) {
        draggable.style.left = (x + 75) + 'px'
        this.x = x + 75
        if (this.y >= y && this.y <= y + 50) {
          this.block_part = 'part4'
          draggable.style.top = (y + 25) + 'px'
          this.y = y + 25
        } else if (this.y > y + 50 && this.y <= y + 100) {
          this.block_part = 'part5'
          draggable.style.top = (y + 75) + 'px'
          this.y = y + 75
        } else if (this.y > y + 100 && this.y <= y + 150) {
          this.block_part = 'part6'
          draggable.style.top = (y + 125) + 'px'
          this.y = y + 125
        }
      } else if (this.x >= x + 100 && this.x <= x + 150) {
        draggable.style.left = (x + 125) + 'px'
        this.x = x + 125
        if (this.y >= y && this.y <= y + 50) {
          this.block_part = 'part7'
          draggable.style.top = (y + 25) + 'px'
          this.y = y + 25
        } else if (this.y > y + 50 && this.y <= y + 100) {
          this.block_part = 'part8'
          draggable.style.top = (y + 75) + 'px'
          this.y = y + 75
        } else if (this.y > y + 100 && this.y <= y + 150) {
          this.block_part = 'part9'
          draggable.style.top = (y + 125) + 'px'
          this.y = y + 125
        }
      }
    },
    changeColor: function () {
      let top = document.getElementById('top')
      let bottom = document.getElementById('bottom')
      this.$refs.block1.color = 'green'
      this.$refs.block2.color = 'green'
      this.$refs.block3.color = 'green'
      this.$refs.block4.color = 'green'
      this.$refs.block5.color = 'green'
      this.$refs.block6.color = 'green'
      this.$refs.block7.color = 'green'
      this.$refs.block8.color = 'green'
      this.$refs.block9.color = 'green'
      this.$refs.block10.color = 'green'
      this.$refs.block11.color = 'green'
      this.$refs.block12.color = 'green'
      top.addEventListener('click', (event) => {
        this.$refs.block1.color = 'blue'
        this.$refs.block2.color = 'blue'
        this.$refs.block3.color = 'blue'
        this.$refs.block4.color = 'blue'
        this.$refs.block5.color = 'blue'
        this.$refs.block6.color = 'blue'
        this.$refs.block7.color = 'green'
        this.$refs.block8.color = 'green'
        this.$refs.block9.color = 'green'
        this.$refs.block10.color = 'green'
        this.$refs.block11.color = 'green'
        this.$refs.block12.color = 'green'
      })
      bottom.addEventListener('click', (event) => {
        this.$refs.block1.color = 'green'
        this.$refs.block2.color = 'green'
        this.$refs.block3.color = 'green'
        this.$refs.block4.color = 'green'
        this.$refs.block5.color = 'green'
        this.$refs.block6.color = 'green'
        this.$refs.block7.color = 'blue'
        this.$refs.block8.color = 'blue'
        this.$refs.block9.color = 'blue'
        this.$refs.block10.color = 'blue'
        this.$refs.block11.color = 'blue'
        this.$refs.block12.color = 'blue'
      })
    },
    check_pressTime: function (event) {
      if (this.pressTimer === null) {
        this.pressTimer = setTimeout(() => {
          this.presslong = true
          // vibrate screen for presslong
          window.navigator.vibrate(200)
          // record prev x and prev y
          this.prev_x = this.x
          this.prev_y = this.y
          this.prev_placement = this.placement
          this.prev_block_part = this.block_part
          console.log('presslong')
        }, 1000)
      }
    },
    move_with_finger: function (event) {
      if (this.pressTimer !== null) {
        clearTimeout(this.pressTimer)
        this.pressTimer = null
      }
      let touch = event.targetTouches[0]
      let element = event.target
      // place element where the finger is
      element.style.left = touch.pageX - 25 + 'px'
      element.style.top = touch.pageY - 25 + 'px'
      this.x = touch.pageX - 25
      this.y = touch.pageY - 25
      event.preventDefault()
    },
    move_end_pos: function (event) {
      let element = event.target
      if (this.x >= 430 && this.x <= 580) {
        if (this.y >= 0 && this.y <= 150) {
          // group1
          this.placement = '1'
          this.judgeBlockpart(430, 0, element)
        } else if (this.y >= 150 && this.y <= 300) {
          // group4
          this.placement = '4'
          this.judgeBlockpart(430, 150, element)
        } else if (this.y >= 300 && this.y <= 450) {
          // group7
          this.placement = '6'
          this.judgeBlockpart(430, 300, element)
        } else if (this.y >= 450 && this.y <= 600) {
          // group10
          this.placement = '3'
          this.judgeBlockpart(430, 450, element)
        } else {
          // go back init position
          this.placement = ''
          if (element.id === 'lostPoint') {
            element.style.left = 920 + 'px'
            element.style.top = 320 + 'px'
          } else if (element.id === 'getPoint') {
            element.style.left = 920 + 'px'
            element.style.top = 278 + 'px'
          } else if (element.id === 'servePoint') {
            element.style.left = 920 + 'px'
            element.style.top = 235 + 'px'
          }
          // remove red line
          this.drawLine = false
          this.presslong = false
        }
      } else if (this.x >= 580 && this.x <= 730) {
        if (this.y >= 0 && this.y <= 150) {
          // group2
          this.placement = '2'
          this.judgeBlockpart(580, 0, element)
        } else if (this.y >= 150 && this.y <= 300) {
          // group5
          this.placement = '5'
          this.judgeBlockpart(580, 150, element)
        } else if (this.y >= 300 && this.y <= 450) {
          // group8
          this.placement = '5'
          this.judgeBlockpart(580, 300, element)
        } else if (this.y >= 450 && this.y <= 600) {
          // group11
          this.placement = '2'
          this.judgeBlockpart(580, 450, element)
        } else {
          // go back init position
          this.placement = ''
          if (element.id === 'lostPoint') {
            element.style.left = 920 + 'px'
            element.style.top = 320 + 'px'
          } else if (element.id === 'getPoint') {
            element.style.left = 920 + 'px'
            element.style.top = 278 + 'px'
          } else if (element.id === 'servePoint') {
            element.style.left = 920 + 'px'
            element.style.top = 235 + 'px'
          }
          // remove red line
          this.drawLine = false
          this.presslong = false
        }
      } else if (this.x >= 730 && this.x <= 880) {
        if (this.y >= 0 && this.y <= 150) {
          // group3
          this.placement = '3'
          this.judgeBlockpart(730, 0, element)
        } else if (this.y >= 150 && this.y <= 300) {
          // group6
          this.placement = '6'
          this.judgeBlockpart(730, 150, element)
        } else if (this.y >= 300 && this.y <= 450) {
          // group9
          this.placement = '4'
          this.judgeBlockpart(730, 300, element)
        } else if (this.y >= 450 && this.y <= 600) {
          // group12
          this.placement = '1'
          this.judgeBlockpart(730, 450, element)
        } else {
          // go back init position
          this.placement = ''
          if (element.id === 'lostPoint') {
            element.style.left = 920 + 'px'
            element.style.top = 320 + 'px'
          } else if (element.id === 'getPoint') {
            element.style.left = 920 + 'px'
            element.style.top = 278 + 'px'
          } else if (element.id === 'servePoint') {
            element.style.left = 920 + 'px'
            element.style.top = 235 + 'px'
          }
          // remove red line
          this.drawLine = false
          this.presslong = false
        }
      } else {
        // go back init position
        this.placement = ''
        if (element.id === 'lostPoint') {
          element.style.left = 920 + 'px'
          element.style.top = 320 + 'px'
        } else if (element.id === 'getPoint') {
          element.style.left = 920 + 'px'
          element.style.top = 278 + 'px'
        } else if (element.id === 'servePoint') {
          element.style.left = 920 + 'px'
          element.style.top = 235 + 'px'
        }
        // remove red line
        this.drawLine = false
        this.presslong = false
      }
      if (element.id === 'lostPoint') {
        this.serve_point = false
        this.getpoint = false
      } else if (element.id === 'getPoint') {
        this.serve_point = false
        this.getpoint = true
      } else if (element.id === 'servePoint') {
        this.serve_point = true
        this.getpoint = true
      }
      if (this.presslong) {
        // console.log('prev_x : ', this.prev_x)
        // console.log('prev_y : ', this.prev_y)
        // console.log('x : ', this.x)
        // console.log('y : ', this.y)
        this.drawLine = true
      }
      event.preventDefault()
    },
    initTouch: function () {
      let getPoint = document.getElementById('getPoint')
      let lostPoint = document.getElementById('lostPoint')
      let servePoint = document.getElementById('servePoint')

      // when touchstart
      getPoint.addEventListener('touchstart', this.check_pressTime, false)
      lostPoint.addEventListener('touchstart', this.check_pressTime, false)
      // when touchmove
      getPoint.addEventListener('touchmove', this.move_with_finger, false)
      lostPoint.addEventListener('touchmove', this.move_with_finger, false)
      servePoint.addEventListener('touchmove', this.move_with_finger, false)

      // when touchend
      getPoint.addEventListener('touchend', this.move_end_pos, false)
      lostPoint.addEventListener('touchend', this.move_end_pos, false)
      servePoint.addEventListener('touchend', this.move_end_pos, false)
    }
  },
  mounted () {
    this.initTouch()
    this.changeColor()
    // forbid presslong to pop menu
    document.oncontextmenu = function (e) {
      e.preventDefault()
      return false
    }
  }
}
</script>

<style>
.dragBlock {
  width: 60px;
  height: 40px;
  border: 1px solid black;
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
</style>
