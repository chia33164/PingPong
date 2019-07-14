<template>
  <div class="container">
    <svg class="table_container" width="450" height="600">
      <g>
        <Block ref="block1" id="group1" x='0' y='0'></Block>
        <Block ref="block2" id="group2" x='150' y='0'></Block>
        <Block ref="block3" id="group3" x='300' y='0'></Block>
        <Block ref="overlap1" id="overlap1" x='0' y='0'></Block>
        <Block ref="overlap2" id="overlap2" x='150' y='0'></Block>
        <Block ref="overlap3" id="overlap3" x='300' y='0'></Block>
      </g>
      <g>
        <Block ref="block4" id="group4" x='0' y='150'></Block>
        <Block ref="block5" id="group5" x='150' y='150'></Block>
        <Block ref="block6" id="group6" x='300' y='150'></Block>
        <Block ref="overlap4" id="overlap4" x='0' y='150'></Block>
        <Block ref="overlap5" id="overlap5" x='150' y='150'></Block>
        <Block ref="overlap6" id="overlap6" x='300' y='150'></Block>
      </g>
      <g>
        <Block ref="block7" id="group7" x='0' y='300'></Block>
        <Block ref="block8" id="group8" x='150' y='300'></Block>
        <Block ref="block9" id="group9" x='300' y='300'></Block>
        <Block ref="overlap7" id="overlap7" x='0' y='300'></Block>
        <Block ref="overlap8" id="overlap8" x='150' y='300'></Block>
        <Block ref="overlap9" id="overlap9" x='300' y='300'></Block>
      </g>
      <g>
        <Block ref="block10" id="group10" x='0' y='450'></Block>
        <Block ref="block11" id="group11" x='150' y='450'></Block>
        <Block ref="block12" id="group12" x='300' y='450'></Block>
        <Block ref="overlap10" id="overlap10" x='0' y='450'></Block>
        <Block ref="overlap11" id="overlap11" x='150' y='450'></Block>
        <Block ref="overlap12" id="overlap12" x='300' y='450'></Block>
      </g>
      <line id='test1' :x1="prev_x-430" :y1="prev_y-45" :x2="x-430" :y2="y-45" stroke='red' v-if="drawLine"/>
      <line id='test2' x1='0' y1='300' x2='450' y2='300' stroke='red'/>
      <image xlink:href="../../assets/person.png" x=0 y=0 width="40px" height="40px" v-if="station === 'top'"/>
      <image xlink:href="../../assets/person.png" x=0 y=560 width="40px" height="40px" v-if="station === 'bottom'"/>
    </svg>
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
      drawLine: false,
      opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      current_drag: ''
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
      servePoint.style.left = 930 + 'px'
      servePoint.style.top = 180 + 'px'
      getPoint.style.left = 930 + 'px'
      getPoint.style.top = 223 + 'px'
      lostPoint.style.left = 930 + 'px'
      lostPoint.style.top = 265 + 'px'
      this.serve_point = false
      this.getpoint = false
      this.current_drag = ''
      this.placement = ''
      this.prev_placement = ''
      this.block_part = '0'
      this.prev_block_part = '0'
      this.clearLine()
    },
    clearLine: function () {
      this.prev_x = 0
      this.prev_y = 0
      this.drawLine = false
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
      if (this.station === 'top') {
        this.station = 'bottom'
      } else if (this.station === 'bottom') {
        this.station = 'top'
      }
      this.$refs.block1.color = 'white'
      this.$refs.block2.color = 'white'
      this.$refs.block3.color = 'white'
      this.$refs.block4.color = 'white'
      this.$refs.block5.color = 'white'
      this.$refs.block6.color = 'white'
      this.$refs.block7.color = 'white'
      this.$refs.block8.color = 'white'
      this.$refs.block9.color = 'white'
      this.$refs.block10.color = 'white'
      this.$refs.block11.color = 'white'
      this.$refs.block12.color = 'white'
      // init hot zone
      this.opacity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      this.$refs.overlap1.opacity = 0
      this.$refs.overlap2.opacity = 0
      this.$refs.overlap3.opacity = 0
      this.$refs.overlap4.opacity = 0
      this.$refs.overlap5.opacity = 0
      this.$refs.overlap6.opacity = 0
      this.$refs.overlap7.opacity = 0
      this.$refs.overlap8.opacity = 0
      this.$refs.overlap9.opacity = 0
      this.$refs.overlap10.opacity = 0
      this.$refs.overlap11.opacity = 0
      this.$refs.overlap12.opacity = 0
    },
    start_mov: function (event) {
      if (this.current_drag === '') {
        this.current_drag = event.target.id
      } else {
        // record prev x and prev y
        this.prev_x = this.x
        this.prev_y = this.y
        this.prev_placement = this.placement
        this.prev_block_part = this.block_part
      }
    },
    move_with_finger: function (event) {
      if (this.current_drag === event.target.id || this.current_drag === '') {
        let touch = event.targetTouches[0]
        let element = event.target
        // place element where the finger is
        element.style.left = touch.pageX - 25 + 'px'
        element.style.top = touch.pageY - 25 + 'px'
        this.x = touch.pageX - 25
        this.y = touch.pageY - 25
      }
      event.preventDefault()
    },
    move_end_pos: function (event) {
      let element = event.target
      if (element.id === this.current_drag || this.current_drag === '') {
        if (this.x >= 430 && this.x <= 580) {
          if (this.y >= 45 && this.y <= 195) {
            // group1
            this.placement = '1'
            this.judgeBlockpart(430, 45, element)
          } else if (this.y >= 195 && this.y <= 345) {
            // group4
            this.placement = '4'
            this.judgeBlockpart(430, 195, element)
          } else if (this.y >= 345 && this.y <= 495) {
            // group7
            this.placement = '6'
            this.judgeBlockpart(430, 345, element)
          } else if (this.y >= 495 && this.y <= 645) {
            // group10
            this.placement = '3'
            this.judgeBlockpart(430, 495, element)
          } else {
            // go back init position
            this.placement = ''
            if (element.id === 'lostPoint') {
              element.style.left = 930 + 'px'
              element.style.top = 265 + 'px'
            } else if (element.id === 'getPoint') {
              element.style.left = 930 + 'px'
              element.style.top = 223 + 'px'
            } else if (element.id === 'servePoint') {
              element.style.left = 930 + 'px'
              element.style.top = 180 + 'px'
            }
            // remove red line
            this.clearLine()
            this.current_drag = ''
          }
        } else if (this.x >= 580 && this.x <= 730) {
          if (this.y >= 45 && this.y <= 195) {
            // group2
            this.placement = '2'
            this.judgeBlockpart(580, 45, element)
          } else if (this.y >= 195 && this.y <= 345) {
            // group5
            this.placement = '5'
            this.judgeBlockpart(580, 195, element)
          } else if (this.y >= 345 && this.y <= 495) {
            // group8
            this.placement = '5'
            this.judgeBlockpart(580, 345, element)
          } else if (this.y >= 495 && this.y <= 645) {
            // group11
            this.placement = '2'
            this.judgeBlockpart(580, 495, element)
          } else {
            // go back init position
            this.placement = ''
            if (element.id === 'lostPoint') {
              element.style.left = 930 + 'px'
              element.style.top = 265 + 'px'
            } else if (element.id === 'getPoint') {
              element.style.left = 930 + 'px'
              element.style.top = 223 + 'px'
            } else if (element.id === 'servePoint') {
              element.style.left = 930 + 'px'
              element.style.top = 180 + 'px'
            }
            // remove red line
            this.clearLine()
            this.current_drag = ''
          }
        } else if (this.x >= 730 && this.x <= 880) {
          if (this.y >= 45 && this.y <= 195) {
            // group3
            this.placement = '3'
            this.judgeBlockpart(730, 45, element)
          } else if (this.y >= 195 && this.y <= 345) {
            // group6
            this.placement = '6'
            this.judgeBlockpart(730, 195, element)
          } else if (this.y >= 345 && this.y <= 495) {
            // group9
            this.placement = '4'
            this.judgeBlockpart(730, 345, element)
          } else if (this.y >= 495 && this.y <= 645) {
            // group12
            this.placement = '1'
            this.judgeBlockpart(730, 495, element)
          } else {
            // go back init position
            this.placement = ''
            if (element.id === 'lostPoint') {
              element.style.left = 930 + 'px'
              element.style.top = 265 + 'px'
            } else if (element.id === 'getPoint') {
              element.style.left = 930 + 'px'
              element.style.top = 223 + 'px'
            } else if (element.id === 'servePoint') {
              element.style.left = 930 + 'px'
              element.style.top = 180 + 'px'
            }
            // remove red line
            this.clearLine()
            this.current_drag = ''
          }
        } else {
          // go back init position
          this.placement = ''
          if (element.id === 'lostPoint') {
            element.style.left = 930 + 'px'
            element.style.top = 265 + 'px'
          } else if (element.id === 'getPoint') {
            element.style.left = 930 + 'px'
            element.style.top = 223 + 'px'
          } else if (element.id === 'servePoint') {
            element.style.left = 930 + 'px'
            element.style.top = 180 + 'px'
          }
          // remove red line
          this.clearLine()
          this.current_drag = ''
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
        if (this.prev_x !== 0 && this.prev_y !== 0) this.drawLine = true
      }
      event.preventDefault()
    },
    initTouch: function () {
      let getPoint = document.getElementById('getPoint')
      let lostPoint = document.getElementById('lostPoint')
      let servePoint = document.getElementById('servePoint')

      // when touchstart
      getPoint.addEventListener('touchstart', this.start_mov, false)
      lostPoint.addEventListener('touchstart', this.start_mov, false)
      servePoint.addEventListener('touchstart', this.start_mov, false)
      // when touchmove
      getPoint.addEventListener('touchmove', this.move_with_finger, false)
      lostPoint.addEventListener('touchmove', this.move_with_finger, false)
      servePoint.addEventListener('touchmove', this.move_with_finger, false)

      // when touchend
      getPoint.addEventListener('touchend', this.move_end_pos, false)
      lostPoint.addEventListener('touchend', this.move_end_pos, false)
      servePoint.addEventListener('touchend', this.move_end_pos, false)
    },
    initHotZone: function () {
      this.$refs.overlap1.color = 'red'
      this.$refs.overlap2.color = 'red'
      this.$refs.overlap3.color = 'red'
      this.$refs.overlap4.color = 'red'
      this.$refs.overlap5.color = 'red'
      this.$refs.overlap6.color = 'red'
      this.$refs.overlap7.color = 'red'
      this.$refs.overlap8.color = 'red'
      this.$refs.overlap9.color = 'red'
      this.$refs.overlap10.color = 'red'
      this.$refs.overlap11.color = 'red'
      this.$refs.overlap12.color = 'red'
      this.$refs.overlap1.opacity = 0
      this.$refs.overlap2.opacity = 0
      this.$refs.overlap3.opacity = 0
      this.$refs.overlap4.opacity = 0
      this.$refs.overlap5.opacity = 0
      this.$refs.overlap6.opacity = 0
      this.$refs.overlap7.opacity = 0
      this.$refs.overlap8.opacity = 0
      this.$refs.overlap9.opacity = 0
      this.$refs.overlap10.opacity = 0
      this.$refs.overlap11.opacity = 0
      this.$refs.overlap12.opacity = 0
    },
    changeHotZone: function (station) {
      this.station = station
      if (station === 'top') {
        // swap overlap's color according to player's station
        this.$refs.overlap1.color = 'red'
        this.$refs.overlap2.color = 'red'
        this.$refs.overlap3.color = 'red'
        this.$refs.overlap4.color = 'red'
        this.$refs.overlap5.color = 'red'
        this.$refs.overlap6.color = 'red'
        this.$refs.overlap7.color = 'green'
        this.$refs.overlap8.color = 'green'
        this.$refs.overlap9.color = 'green'
        this.$refs.overlap10.color = 'green'
        this.$refs.overlap11.color = 'green'
        this.$refs.overlap12.color = 'green'

        // swap overlap's opacity according to player's station
        this.$refs.overlap1.opacity = this.opacity[11]
        this.$refs.overlap2.opacity = this.opacity[10]
        this.$refs.overlap3.opacity = this.opacity[9]
        this.$refs.overlap4.opacity = this.opacity[8]
        this.$refs.overlap5.opacity = this.opacity[7]
        this.$refs.overlap6.opacity = this.opacity[6]
        this.$refs.overlap7.opacity = this.opacity[5]
        this.$refs.overlap8.opacity = this.opacity[4]
        this.$refs.overlap9.opacity = this.opacity[3]
        this.$refs.overlap10.opacity = this.opacity[2]
        this.$refs.overlap11.opacity = this.opacity[1]
        this.$refs.overlap12.opacity = this.opacity[0]
      } else if (station === 'bottom') {
        // swap overlap's color according to player's station
        this.$refs.overlap1.color = 'green'
        this.$refs.overlap2.color = 'green'
        this.$refs.overlap3.color = 'green'
        this.$refs.overlap4.color = 'green'
        this.$refs.overlap5.color = 'green'
        this.$refs.overlap6.color = 'green'
        this.$refs.overlap7.color = 'red'
        this.$refs.overlap8.color = 'red'
        this.$refs.overlap9.color = 'red'
        this.$refs.overlap10.color = 'red'
        this.$refs.overlap11.color = 'red'
        this.$refs.overlap12.color = 'red'

        // swap overlap's opacity according to player's station
        this.$refs.overlap1.opacity = this.opacity[0]
        this.$refs.overlap2.opacity = this.opacity[1]
        this.$refs.overlap3.opacity = this.opacity[2]
        this.$refs.overlap4.opacity = this.opacity[3]
        this.$refs.overlap5.opacity = this.opacity[4]
        this.$refs.overlap6.opacity = this.opacity[5]
        this.$refs.overlap7.opacity = this.opacity[6]
        this.$refs.overlap8.opacity = this.opacity[7]
        this.$refs.overlap9.opacity = this.opacity[8]
        this.$refs.overlap10.opacity = this.opacity[9]
        this.$refs.overlap11.opacity = this.opacity[10]
        this.$refs.overlap12.opacity = this.opacity[11]
      }
    }
  },
  mounted () {
    this.initTouch()
    this.changeColor()
    this.initHotZone()
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
}
#getPoint {
  position:absolute;
  left: 930px;
  top: 223px;
}
#lostPoint {
  position:absolute;
  left: 930px;
  top: 265px;
}
#servePoint {
  position:absolute;
  left: 930px;
  top: 180px;
}
.overlap {
  z-index: 2;
  background-color: "red";
}
#topPerson, #bottomPerson {
  background-image: url('../../assets/person.png');
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50% 50%
}

</style>
