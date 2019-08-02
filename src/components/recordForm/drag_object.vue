<template>
  <div class="container">
    <svg id="table_container" width="450" height="600">
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
      <g>

      </g>
      <line id='test1' :x1="prev_x-442" :y1="prev_y-60" :x2="x-442" :y2="y-60" stroke='red' v-show="showLine"/>
      <line id='test2' x1='0' y1='300' x2='450' y2='300' stroke-width="4" stroke='red'/>
      <image xlink:href="../../assets/person.png" x=0 y=0 width="40px" height="40px" v-show="station === 'top'"/>
      <image xlink:href="../../assets/person.png" x=0 y=560 width="40px" height="40px" v-show="station === 'bottom'"/>
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
      showLine: false,
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
      servePoint.style.left = 927 + 'px'
      servePoint.style.top = 178 + 'px'
      getPoint.style.left = 927 + 'px'
      getPoint.style.top = 236.5 + 'px'
      lostPoint.style.left = 927 + 'px'
      lostPoint.style.top = 295 + 'px'
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
      this.showLine = false
    },
    drawLine: function () {
      this.showLine = true
    },
    /*
    computeRingXY: function (currentX, currentY) {
      let dist = this.getDist(this.prev_x, this.prev_y, currentX, currentY)
      let element = document.getElementsByClassName('moving')[0]
      let radius = Number(element.getAttribute('radius'))
      console.log(dist)
      console.log(radius)
      // 用相似形計算
      return {
        RingX: currentX - (currentX - this.prev_x) * (radius / dist),
        RingY: currentY - (currentY - this.prev_y) * (radius / dist)
      }
    },
    */
    getDist: function (x1, y1, x2, y2) {
      return Math.pow((Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)), 0.5)
    },
    getNewPos: function (numOfPartX, numOfPartY) {
      let svgBox = this.getSVGPosition()
      let blockWidth = svgBox.boxWidth / 9
      let partRow = numOfPartY % 3
      let partCol = numOfPartX % 3
      let blockCol = Math.floor(numOfPartY / 3) // (0~11 / 3) => (0~3)
      let blockRow = Math.floor(numOfPartX / 3) // (0~8 / 3) => (0~2)
      let OffsetX = blockWidth * numOfPartX
      let OffsetY = blockWidth * numOfPartY
      let isValid = !(OffsetX < 0 || OffsetX > 400 || OffsetY < 0 || OffsetY > 550)

      return {
        newOffsetX: (isValid) ? (blockWidth * numOfPartX + blockWidth / 2) : null,
        newOffsetY: (isValid) ? (blockWidth * numOfPartY + blockWidth / 2) : null,
        part: (isValid) ? (partRow * 3 + partCol + 1) : null,
        block: (isValid) ? (blockCol * 3 + blockRow + 1) : null,
        isValid: isValid
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
        this.drawLine()
      }

      let element = event.target
      let touch = event.targetTouches[0]
      element.setAttribute('radius', touch.radiusX)
      element.setAttribute('center-offsetx', touch.target.clientWidth / 2)
      element.setAttribute('center-offsety', touch.target.clientHeight / 2)
      element.classList.add('moving')
    },
    move_with_finger: function (event) {
      if (this.current_drag === event.target.id || this.current_drag === '') {
        let touch = event.targetTouches[0]
        let element = event.target
        // let updatePos = this.computeRingXY(touch.pageX, touch.pageY)

        // place element where the finger is
        element.style.left = touch.pageX - touch.target.clientWidth / 2 + 'px'
        element.style.top = touch.pageY - touch.target.clientHeight / 2 + 'px'
        this.x = touch.pageX
        this.y = touch.pageY
      }
      event.preventDefault()
    },
    moveStop: function (event) {
      let element = event.target
      let currentNode = event.changedTouches[0]
      let svgBox = this.getSVGPosition()
      let divX
      let divY
      let newPos
      let centerOffsetX = Number(element.getAttribute('center-offsetx'))
      let centerOffsetY = Number(element.getAttribute('center-offsety'))

      if (element.id === this.current_drag || this.current_drag === '') {
        divX = (currentNode.pageX - svgBox.absX) / (svgBox.boxWidth / 9)
        divY = (currentNode.pageY - svgBox.absY) / (svgBox.boxHeight / 12)
        newPos = this.getNewPos(Math.floor(divX), Math.floor(divY))

        if (newPos.isValid) {
          element.style.left = newPos.newOffsetX + svgBox.absX - centerOffsetX + 'px'
          element.style.top = newPos.newOffsetY + svgBox.absY - centerOffsetY + 'px'

          this.x = newPos.newOffsetX + svgBox.absX
          this.y = newPos.newOffsetY + svgBox.absY
          this.block_part = `part${newPos.part}`
          this.placement = newPos.block > 6 ? `${13 - newPos.block}` : `${newPos.block}`
        } else {
          this.initialTouch()
        }

        this.serve_point = (element.id === 'servePoint')
        this.getpoint = (element.id === 'getPoint') || (element.id === 'servePoint')
        if (this.prev_x !== 0 && this.prev_y !== 0) this.drawLine()

        // console.log(newPos)
        element.classList.remove('moving')
        event.preventDefault()
      }
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
      getPoint.addEventListener('touchend', this.moveStop, false)
      lostPoint.addEventListener('touchend', this.moveStop, false)
      servePoint.addEventListener('touchend', this.moveStop, false)
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
    },
    getSVGPosition: function () {
      let svgBox = document.getElementById('table_container').getBoundingClientRect()
      return {
        boxHeight: svgBox.height,
        boxWidth: svgBox.width,
        absX: svgBox.x,
        absY: svgBox.y
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
#getPoint {
  position:absolute;
  left: 927px;
  top: 236.5px;
}
#lostPoint {
  position:absolute;
  left: 927px;
  top: 295px;
}
#servePoint {
  position:absolute;
  left: 927px;
  top: 178px;
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
