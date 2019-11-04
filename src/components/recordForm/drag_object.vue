<template>
  <div class="container">
    <svg id="table_container" width="450" height="600">
      <defs>
        <marker id='arrow-head' orient="auto" markerWidth='50' markerHeight='100' refX='10' refY='5'>
            <!-- triangle pointing (+x) -->
            <path d='M0,0 V10 L10,5 Z' fill="red" />
        </marker>
      </defs>
      <g>
        <Block ref="overlap1" x='0' y='0' :mode='1'></Block>
        <Block ref="overlap2" x='150' y='0' :mode='1'></Block>
        <Block ref="overlap3" x='300' y='0' :mode='1'></Block>
      </g>
      <g>
        <Block ref="overlap4" x='0' y='150' :mode='1'></Block>
        <Block ref="overlap5" x='150' y='150' :mode='1'></Block>
        <Block ref="overlap6" x='300' y='150' :mode='1'></Block>
      </g>
      <g>
        <Block ref="overlap7" x='0' y='300' :mode='1'></Block>
        <Block ref="overlap8" x='150' y='300' :mode='1'></Block>
        <Block ref="overlap9" x='300' y='300' :mode='1'></Block>
      </g>
      <g>
        <Block ref="overlap10" x='0' y='450' :mode='1'></Block>
        <Block ref="overlap11" x='150' y='450' :mode='1'></Block>
        <Block ref="overlap12" x='300' y='450' :mode='1'></Block>
      </g>
      <g>
      </g>
      <line id='test1' :x1="prev_x-absX" :y1="prev_y-absY" :x2="x-absX" :y2="y-absY" stroke='red' marker-end="url(#arrow-head)" v-show="showLine"/>
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
      current_drag: '',
      absX: 0,
      absY: 0
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
      servePoint.style.left = 30 + 'px'
      servePoint.style.top = 178 + 'px'
      getPoint.style.left = 30 + 'px'
      getPoint.style.top = 236.5 + 'px'
      lostPoint.style.left = 30 + 'px'
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
    computeRingXY: function (currentX, currentY) {
      let dist = this.getDist(this.prev_x, this.prev_y, currentX, currentY)
      let element = document.getElementsByClassName('moving')[0]
      let radius = Number(element.getAttribute('radius'))
      // 用相似形計算
      return {
        RingX: currentX - (currentX - this.prev_x) * (radius / dist),
        RingY: currentY - (currentY - this.prev_y) * (radius / dist)
      }
    },
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
      this.station = (this.station === 'top') ? 'bottom' : 'top'

      // init hot zone
      for (let item in this.$refs) {
        this.$refs[item].opacity = 0
      }

      this.opacity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    start_mov: function (event) {
      if (this.current_drag === '') {
        this.current_drag = event.target.id
      } else {
        // record prev x and prev y
        let currentNode = event.changedTouches[0]
        let svgBox = this.getSVGPosition()
        let divX = (currentNode.pageX - svgBox.absX) / (svgBox.boxWidth / 9)
        let divY = (currentNode.pageY - svgBox.absY) / (svgBox.boxHeight / 12)
        let FixPos = this.getNewPos(Math.floor(divX), Math.floor(divY))

        this.prev_x = FixPos.newOffsetX + svgBox.absX
        this.prev_y = FixPos.newOffsetY + svgBox.absY
        this.prev_placement = this.placement
        this.prev_block_part = this.block_part
        this.drawLine()
      }

      let element = event.target
      let touch = event.targetTouches[0]
      element.setAttribute('radius', touch.target.offsetWidth / 2)
      element.setAttribute('center-offsetx', touch.target.offsetWidth / 2)
      element.setAttribute('center-offsety', touch.target.offsetHeight / 2)
      element.classList.add('moving')
    },
    move_with_finger: function (event) {
      if (this.current_drag === event.target.id || this.current_drag === '') {
        let touch = event.targetTouches[0]
        let element = event.target
        let updatePos = this.computeRingXY(touch.pageX, touch.pageY)

        // place element where the finger is
        element.style.left = touch.pageX - touch.target.offsetWidth / 2 + 'px'
        element.style.top = touch.pageY - touch.target.offsetHeight / 2 + 'px'
        this.x = updatePos.RingX
        this.y = updatePos.RingY
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
      let updatePos
      let centerOffsetX = Number(element.getAttribute('center-offsetx'))
      let centerOffsetY = Number(element.getAttribute('center-offsety'))

      if (element.id === this.current_drag || this.current_drag === '') {
        divX = (currentNode.pageX - svgBox.absX) / (svgBox.boxWidth / 9)
        divY = (currentNode.pageY - svgBox.absY) / (svgBox.boxHeight / 12)
        newPos = this.getNewPos(Math.floor(divX), Math.floor(divY))

        if (newPos.isValid) {
          element.style.left = newPos.newOffsetX + svgBox.absX - centerOffsetX + 'px'
          element.style.top = newPos.newOffsetY + svgBox.absY - centerOffsetY + 'px'

          updatePos = this.computeRingXY(newPos.newOffsetX + svgBox.absX, newPos.newOffsetY + svgBox.absY)
          this.x = updatePos.RingX
          this.y = updatePos.RingY
          this.block_part = `part${newPos.part}`
          this.placement = newPos.block > 6 ? `${13 - newPos.block}` : `${newPos.block}`
        } else {
          this.initialTouch()
        }

        this.serve_point = (element.id === 'servePoint')
        this.getpoint = (element.id === 'getPoint') || (element.id === 'servePoint')

        if (this.prev_x !== 0 && this.prev_y !== 0) {
          this.drawLine()
        } else {
          // lose point and placement = '0'
          this.prev_placement = this.placement
        }
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

      let pos = this.getSVGPosition()
      this.absX = pos.absX
      this.absY = pos.absY
    },
    initHotZone: function () {
      for (let item in this.$refs) {
        this.$refs[item].color = 'red'
        this.$refs[item].opacity = 0
      }
    },
    changeHotZone: function (station) {
      this.station = station
      for (let item in this.$refs) {
        let idx = Object.keys(this.$refs).indexOf(item)
        if (station === 'top') {
          // swap overlap's color according to player's station
          this.$refs[item].color = (idx <= 5) ? 'red' : 'green'
          // swap overlap's opacity according to player's station
          this.$refs[item].opacity = this.opacity[11 - idx]
        } else if (station === 'bottom') {
          this.$refs[item].color = (idx <= 5) ? 'green' : 'red'
          this.$refs[item].opacity = this.opacity[idx]
        }
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
  left: 30px;
  top: 236.5px;
}
#lostPoint {
  position:absolute;
  left: 30px;
  top: 295px;
}
#servePoint {
  position:absolute;
  left: 30px;
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
