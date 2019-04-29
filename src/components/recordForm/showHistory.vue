<template>
  <div class="showHistory_container">
    <transition name="modal">
        <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    <slot name="header">
                      number
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                      <svg class="history_container" width="450" height="600">
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
                        <line id='test1' :x1="prev_x" :y1="prev_y" :x2="x" :y2="y" stroke='red'/>
                        <line id='test2' x1='0' y1='300' x2='450' y2='300' stroke='red'/>
                        <image xlink:href='../../assets/lostpoint.png' :x="prev_x-20" :y="prev_y-20" height="40px" width="40px" v-if="lost"/>
                        <image xlink:href='../../assets/getpoint.png' :x="x-20" :y="y-20" height="40px" width="40px" v-if="get"/>
                      </svg>
                    </slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                    default footer
                    <button class="modal-default-button" @click="$emit('close')">
                        close
                    </button>
                    </slot>
                </div>
            </div>
        </div>
        </div>
    </transition>
  </div>
</template>

<script>
import Block from './perBlock'

export default {
  props: ['showList'],
  data: function () {
    return {
      prev_x: 0,
      prev_y: 0,
      x: 0,
      y: 0,
      lost: false,
      get: false
    }
  },
  components: {
    Block
  },
  methods: {
    getPos: function () {
      if (this.showList.length !== 0) {
        let end = this.showList[0].placement
        let endPart = this.showList[0].placement_part
        let start = this.showList[0].skill.substr(1)
        let startPart = this.showList[0].part.substr(4)
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
            this.judgePosByPart(0, startPart, 0, 300)
            break
          case '5':
            this.judgePosByPart(0, startPart, 150, 300)
            break
          case '6':
            this.judgePosByPart(0, startPart, 300, 300)
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
        if (this.showList[0].getpoint === '1') {
          this.get = true
        } else {
          this.lost = true
        }
        // console.log('prev_x: ', this.prev_x)
        // console.log('prev_y: ', this.prev_y)
        // console.log('x: ', this.x)
        // console.log('y: ', this.y)
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
    }
  },
  mounted () {
    this.getPos()
  }
}
</script>

<style>
.showHistory_container {
  display: flex;
  flex-direction: column
}
.list_container > div {
  display: flex;
  flex-direction: row;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 450px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>