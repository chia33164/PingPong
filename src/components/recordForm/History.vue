<template>
  <div id="history_modal">
    <b-modal
    id="modal-2"
    ref="modal"
    title="回放"
    >
      <v-touch v-on:swipeleft="swipeleft" v-on:swiperight="swiperight">
        <svg class="history_container" width="450" height="600">
          <defs>
            <marker id='arrow-head' orient="auto" markerWidth='50' markerHeight='100' refX='10' refY='5'>
                <!-- triangle pointing (+x) -->
                <path d='M0,0 V10 L10,5 Z' fill="red" />
            </marker>
          </defs>
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

          <line id='test1' :x1="prev_x" :y1="prev_y" :x2="ringX" :y2="ringY" stroke='red' marker-end="url(#arrow-head)"/>
          <line id='test2' x1='0' y1='300' x2='450' y2='300' stroke='red'/>

          <g id="nodeTemp" class="layerNodeGroup">
            <circle class="layerNode source" fill="white" :cx="x" :cy="y" r="20" stroke="grey" stroke-width="2"></circle>

            <foreignObject width="40" height="40" :x="x-20" :y="y-20">
                <div class="nodeText" xmlns="http://www.w3.org/1999/xhtml">失分</div>
            </foreignObject>
          </g>
        </svg>
      </v-touch>
      <template slot="modal-header">
        <b-button size="sm" variant="success" @click="getPos(0)"> 開始 </b-button>
        <b> 回放 </b>
      </template>
      <template slot="modal-footer">
        <b>第 {{idx + 1}} 球</b>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Block from './perBlock'

export default {
  data: function () {
    return {
      prev_x: 0,
      prev_y: 0,
      x: -50,
      y: -50,
      ringX: 0,
      ringY: 0,
      idx: 0,
      showList: []
    }
  },
  components: {
    Block
  },
  methods: {
    getPos: function (idx) {
      this.idx = idx
      let node = document.getElementById('nodeTemp')
      if (this.showList.length !== 0) {
        let end = this.showList[idx].placement
        let endPart = this.showList[idx].placement_part
        let start = this.showList[idx].skill.substr(1)
        let startPart = this.showList[idx].part.substr(4)
        if (this.showList[idx].getpoint) {
          switch (start) {
            case '1':
              this.judgePosByPart(0, startPart, 300, 450)
              break
            case '2':
              this.judgePosByPart(0, startPart, 150, 450)
              break
            case '3':
              this.judgePosByPart(0, startPart, 0, 450)
              break
            case '4':
              this.judgePosByPart(0, startPart, 300, 300)
              break
            case '5':
              this.judgePosByPart(0, startPart, 150, 300)
              break
            case '6':
              this.judgePosByPart(0, startPart, 0, 300)
              break
            default:
              break
          }
          switch (end) {
            case '1':
              this.judgePosByPart(1, endPart, 0, 0)
              break
            case '2':
              this.judgePosByPart(1, endPart, 150, 0)
              break
            case '3':
              this.judgePosByPart(1, endPart, 300, 0)
              break
            case '4':
              this.judgePosByPart(1, endPart, 0, 150)
              break
            case '5':
              this.judgePosByPart(1, endPart, 150, 150)
              break
            case '6':
              this.judgePosByPart(1, endPart, 300, 150)
              break
            default:
              break
          }
          if (this.showList[idx].skill === 'S') {
            node.children[0].setAttribute('stroke', 'orange')
            node.children[1].children[0].textContent = '得分'
          } else {
            node.children[0].setAttribute('stroke', 'red')
            node.children[1].children[0].textContent = '得分'
          }
        } else {
          switch (start) {
            case '1':
              this.judgePosByPart(0, startPart, 0, 0)
              break
            case '2':
              this.judgePosByPart(0, startPart, 150, 0)
              break
            case '3':
              this.judgePosByPart(0, startPart, 300, 0)
              break
            case '4':
              this.judgePosByPart(0, startPart, 0, 150)
              break
            case '5':
              this.judgePosByPart(0, startPart, 150, 150)
              break
            case '6':
              this.judgePosByPart(0, startPart, 300, 150)
              break
            default:
              break
          }
          switch (end) {
            case '1':
              this.judgePosByPart(1, endPart, 300, 450)
              break
            case '2':
              this.judgePosByPart(1, endPart, 150, 450)
              break
            case '3':
              this.judgePosByPart(1, endPart, 0, 450)
              break
            case '4':
              this.judgePosByPart(1, endPart, 300, 300)
              break
            case '5':
              this.judgePosByPart(1, endPart, 150, 300)
              break
            case '6':
              this.judgePosByPart(1, endPart, 0, 300)
              break
            default:
              break
          }
          node.children[0].setAttribute('stroke', 'blue')
          node.children[1].children[0].textContent = '失分'
        }
        this.getRingXY()
      }
    },
    judgePosByPart: function (mode, part, x, y) {
      if (mode === 0) {
        switch (part) {
          case '1':
            this.prev_x = x + 25
            this.prev_y = y + 25
            break
          case '2':
            this.prev_x = x + 25
            this.prev_y = y + 75
            break
          case '3':
            this.prev_x = x + 25
            this.prev_y = y + 125
            break
          case '4':
            this.prev_x = x + 75
            this.prev_y = y + 25
            break
          case '5':
            this.prev_x = x + 75
            this.prev_y = y + 75
            break
          case '6':
            this.prev_x = x + 75
            this.prev_y = y + 125
            break
          case '7':
            this.prev_x = x + 125
            this.prev_y = y + 25
            break
          case '8':
            this.prev_x = x + 125
            this.prev_y = y + 75
            break
          case '9':
            this.prev_x = x + 125
            this.prev_y = y + 125
            break
          default:
            break
        }
      } else if (mode === 1) {
        switch (part) {
          case '1':
            this.x = x + 25
            this.y = y + 25
            break
          case '2':
            this.x = x + 25
            this.y = y + 75
            break
          case '3':
            this.x = x + 25
            this.y = y + 125
            break
          case '4':
            this.x = x + 75
            this.y = y + 25
            break
          case '5':
            this.x = x + 75
            this.y = y + 75
            break
          case '6':
            this.x = x + 75
            this.y = y + 125
            break
          case '7':
            this.x = x + 125
            this.y = y + 25
            break
          case '8':
            this.x = x + 125
            this.y = y + 75
            break
          case '9':
            this.x = x + 125
            this.y = y + 125
            break
          default:
            break
        }
      }
    },
    getRingXY: function () {
      let vectorX = this.prev_x - this.x
      let vectorY = this.prev_y - this.y
      let length = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2))
      let radius = document.getElementById('nodeTemp').children[0].r.baseVal.value
      // 相似形
      this.ringX = this.x + vectorX * (radius / length)
      this.ringY = this.y + vectorY * (radius / length)
    },
    swipeleft: function () {
      let leftIdx = this.idx <= 0 ? 0 : this.idx - 1
      this.getPos(leftIdx)
    },
    swiperight: function () {
      let rightIdx = this.idx >= (this.showList.length - 1) ? (this.showList.length - 1) : this.idx + 1
      this.getPos(rightIdx)
    }
  }
}
</script>

<style>
.nodeText {
  width: 100%;
  height: 100%;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>