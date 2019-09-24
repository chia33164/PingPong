<template>
  <div id="change_modal">
    <b-modal
    id="modal-3"
    ref="modal"
    title="修改"
    >
    <svg id="change_container" width="450" height="600">
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
        <line id='test2' x1='0' y1='300' x2='450' y2='300' stroke-width="4" stroke='red'/>
        <image xlink:href="../../assets/person.png" x=0 y=0 width="40px" height="40px" v-show="station === 'top'"/>
        <image xlink:href="../../assets/person.png" x=0 y=560 width="40px" height="40px" v-show="station === 'bottom'"/>

        <g id="nodeTemp" class="layerNodeGroup">
          <circle class="layerNode source" fill="white" :cx="x" :cy="y" r="20" stroke="grey" stroke-width="2"></circle>

          <foreignObject width="40" height="40" :x="x-20" :y="y-20">
            <div class="nodeText" xmlns="http://www.w3.org/1999/xhtml">失分</div>
          </foreignObject>
        </g>
    </svg>
      <template slot="modal-header">
        <button @click="showData"> 開始 </button>
        <b> 修改 </b>
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
  props: ['data'],
  data: function () {
    return {
      prev_x: 0,
      prev_y: 0,
      x: -50,
      y: -50,
      ringX: 0,
      ringY: 0,
      idx: 0,
      showList: [],
      station: null
    }
  },
  components: {
    Block
  },
  methods: {
    getPos2: function (station, getPoint, skill, skillPart, placement, placementPart) {
      let from = Number(skill.substr(1))
      let fromPart = Number(skillPart.substr(4))
      let to = Number(placement)
      let toPart = Number(placementPart)
      let svgBox = this.getSVGPosition()
      let node = document.getElementById('nodeTemp')

      if (station === 'top') {
        if (getPoint) {
          this.prev_x = ((((from - 1) % 3) * 3) + Math.floor((fromPart - 1) % 3)) * (svgBox.boxWidth / 3 / 3) + 25
          this.prev_y = (Math.floor((from - 1) / 3) * 3 + Math.floor((fromPart - 1) / 3)) * (svgBox.boxHeight / 4 / 3) + 25
          this.x = (((((13 - to) - 1) % 3) * 3) + Math.floor((toPart - 1) % 3)) * (svgBox.boxWidth / 3 / 3) + 25
          this.y = (Math.floor(((13 - to) - 1) / 3) * 3 + Math.floor((toPart - 1) / 3)) * (svgBox.boxHeight / 4 / 3) + 25
          this.getRingXY()
          if (skill === 'S') {
            node.children[0].setAttribute('stroke', 'orange')
            node.children[1].children[0].textContent = '得分'
          } else {
            node.children[0].setAttribute('stroke', 'red')
            node.children[1].children[0].textContent = '得分'
          }
        } else {
          this.prev_x = (((((13 - from) - 1) % 3) * 3) + Math.floor((fromPart - 1) % 3)) * (svgBox.boxWidth / 3 / 3) + 25
          this.prev_y = (Math.floor(((13 - from) - 1) / 3) * 3 + Math.floor((fromPart - 1) / 3)) * (svgBox.boxHeight / 4 / 3) + 25
          this.x = ((((to - 1) % 3) * 3) + Math.floor((toPart - 1) % 3)) * (svgBox.boxWidth / 3 / 3) + 25
          this.y = (Math.floor((to - 1) / 3) * 3 + Math.floor((toPart - 1) / 3)) * (svgBox.boxHeight / 4 / 3) + 25
          this.getRingXY()
          node.children[0].setAttribute('stroke', 'blue')
          node.children[1].children[0].textContent = '失分'
        }
      } else if (station === 'bottom') {
        if (getPoint) {
          this.prev_x = (((((13 - from) - 1) % 3) * 3) + Math.floor((fromPart - 1) % 3)) * (svgBox.boxWidth / 3 / 3) + 25
          this.prev_y = (Math.floor(((13 - from) - 1) / 3) * 3 + Math.floor((fromPart - 1) / 3)) * (svgBox.boxHeight / 4 / 3) + 25
          this.x = ((((to - 1) % 3) * 3) + Math.floor((toPart - 1) % 3)) * (svgBox.boxWidth / 3 / 3) + 25
          this.y = (Math.floor((to - 1) / 3) * 3 + Math.floor((toPart - 1) / 3)) * (svgBox.boxHeight / 4 / 3) + 25
          this.getRingXY()
          if (skill === 'S') {
            node.children[0].setAttribute('stroke', 'orange')
            node.children[1].children[0].textContent = '得分'
          } else {
            node.children[0].setAttribute('stroke', 'red')
            node.children[1].children[0].textContent = '得分'
          }
        } else {
          this.prev_x = ((((from - 1) % 3) * 3) + Math.floor((fromPart - 1) % 3)) * (svgBox.boxWidth / 3 / 3) + 25
          this.prev_y = (Math.floor((from - 1) / 3) * 3 + Math.floor((fromPart - 1) / 3)) * (svgBox.boxHeight / 4 / 3) + 25
          this.x = (((((13 - to) - 1) % 3) * 3) + Math.floor((toPart - 1) % 3)) * (svgBox.boxWidth / 3 / 3) + 25
          this.y = (Math.floor(((13 - to) - 1) / 3) * 3 + Math.floor((toPart - 1) / 3)) * (svgBox.boxHeight / 4 / 3) + 25
          this.getRingXY()
          node.children[0].setAttribute('stroke', 'blue')
          node.children[1].children[0].textContent = '失分'
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
    getSVGPosition: function () {
      let svgBox = document.getElementById('change_container').getBoundingClientRect()
      return {
        boxHeight: svgBox.height,
        boxWidth: svgBox.width,
        absX: svgBox.x,
        absY: svgBox.y
      }
    },
    showData: function () {
    //   console.log(this.data)
      this.station = this.data.station
      this.idx = this.data.index
      this.getPos2(this.data.station, this.data.getpoint, this.data.skill, this.data.part, this.data.placement, this.data.placement_part)
    }
  },
  mounted () {
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