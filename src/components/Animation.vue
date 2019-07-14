<template>
  <div class="showHistory_container">
    <div>
      <svg id="history_container" width="450" height="600">
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
          <line id='test2' x1='0' y1='300' x2='450' y2='300' stroke='red'/>
          <line id='first' :x1="lastThreeXY[0]" :y1="lastThreeXY[1]" :x2="lastThreeXY[2]" :y2="lastThreeXY[3]" stroke-width="2" stroke='red' v-show="lineNum >= 1"/>
          <line id='second' :x1="lastThreeXY[2]" :y1="lastThreeXY[3]" :x2="lastThreeXY[4]" :y2="lastThreeXY[5]" stroke-width="1" stroke='red' v-show="lineNum >= 2"/>
          <line id='third' x1='0' y1='300' x2='450' y2='300' stroke='red'/>
          <image xlink:href="../assets/person.png" x=0 y=560 width="40px" height="40px"/>
          <circle v-show="start" cx="0" cy="0" r="15" fill="red" stroke="black" stroke-width="1" id="ballon">
            <animateMotion begin="0s" dur="1s" repeatCount="1" fill="freeze" id="Ball" restart="always"/>
          </circle>
      </svg>
      <svg width="450" height="40">
          <a xlink:href="#Ball" @click="startMove"><text x="0" y="30">開始動畫</text></a>
          <!--a xlink:href="#Ball" @click="stopMove" v-if="!playing"><text x="75" y="30">停止</text></a>
          <a xlink:href="#Ball" @click="stopMove" v-else><text x="75" y="30">繼續</text></a-->
          <a xlink:href="#Ball" @click="previousMove"><text x="150" y="30">上一球</text></a>
          <a xlink:href="#Ball" @click="currentMove"><text x="225" y="30">這一球</text></a>
          <a xlink:href="#Ball" @click="nextMove"><text x="300" y="30">下一球</text></a>
      </svg>
    </div>
    <div>
      <div>
        <b-form-select v-model="roundIdx" :options="option">
          <template slot="first">
            <option :value="-1" disabled>局</option>
          </template>
        </b-form-select>
      </div>
      <div>
        <b-form-select v-model="speed" :options="speedList">
          <template slot="first">
            <option :value="0" disabled>速度</option>
          </template>
        </b-form-select>
      </div>
      <div>
        <p v-if="start">第 {{this.roundIdx + 1}} 局</p>
        <p v-if="start">第 {{this.pathIdx + 1}} 球</p>
        <p v-if="start"> 比分 {{this.roundStatus[this.roundIdx][2]+this.roundStatus[this.roundIdx][3]}}:{{this.roundStatus[this.roundIdx][0]+this.roundStatus[this.roundIdx][1]}} </p>
      </div>
    </div>
    <div>
      <b-button variant="outline-primary" @click="showAnalysis" id="showAnalysis"> 顯示 </b-button>
      <p>{{ballStatus}}</p>

      <b-modal v-model="showAna" title="統計" ok-only>
        <b-form-group>
          <b-form-radio-group
            v-model="analysisMode"
            :options="analysisOptions"
            buttons
            button-variant="outline-primary"
            id="toggle-btn"
          ></b-form-radio-group>
        </b-form-group>
        <div v-if="analysisMode == 'round'">
          <h5>反手失分</h5>
          <b-progress :value="BL" :max="max1" show-value class="mb-3"></b-progress>
          <h5>正手失分</h5>
          <b-progress :value="FL" :max="max1" show-value class="mb-3"></b-progress>
          <h5>反手得分</h5>
          <b-progress :value="BW" :max="max2" show-value class="mb-3"></b-progress>
          <h5>正手得分</h5>
          <b-progress :value="FW" :max="max2" show-value class="mb-3"></b-progress>
        </div>
          <div v-else>
          <h5>反手失分</h5>
          <b-progress :value="ABL" :max="Amax1" show-value class="mb-3"></b-progress>
          <h5>正手失分</h5>
          <b-progress :value="AFL" :max="Amax1" show-value class="mb-3"></b-progress>
          <h5>反手得分</h5>
          <b-progress :value="ABW" :max="Amax2" show-value class="mb-3"></b-progress>
          <h5>正手得分</h5>
          <b-progress :value="AFW" :max="Amax2" show-value class="mb-3"></b-progress>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Block from './recordForm/perBlock'

export default {
  data: function () {
    return {
      move_x: -40,
      move_y: -40,
      xPoint: 0,
      yPoint: 0,
      idx: 0,
      startStation: false, // false:top true:bottom
      path: '',
      pathList: [],
      pathIdx: 0,
      roundList: [],
      roundIdx: -1,
      roundStatus: [], // [[lose point back hand, lose point forward hand, get point back hand, get point forward hand], [], ...]
      status: [0, 0, 0, 0],
      BallStatus: [],
      start: false,
      out: false,
      speedList: [
        {value: 0.25, text: 0.25},
        {value: 0.5, text: 0.5},
        {value: 1, text: 1},
        {value: 1.5, text: 1.5},
        {value: 2, text: 2},
        {value: 2.5, text: 2.5},
        {value: 3, text: 3}
      ],
      speed: 0,
      playing: false,
      option: [],
      skill: '',
      showAna: false,
      max1: 1,
      max2: 1,
      Amax1: 0,
      Amax2: 0,
      BL: 0,
      FL: 0,
      BW: 0,
      FW: 0,
      ABL: 0,
      AFL: 0,
      ABW: 0,
      AFW: 0,
      analysisMode: 'round',
      analysisOptions: [
        {text: '本局', value: 'round'},
        {text: '整場', value: 'game'}
      ],
      ballStatus: '',
      isGetPoint: false,
      lastThreeXY: [0, 0, 0, 0, 0, 0],
      lineNum: 0
    }
  },
  components: {
    Block
  },
  methods: {
    setData: async function () {
      let position
      let ParsedData = await this.$store.dispatch('getParsedData')

      for (let i = 0; i < ParsedData.length; i++) {
        let data = ParsedData[i]
        // X's station is on bottom
        // Y's station is on top
        switch (data) {
          case 'X':
            this.startStation = true
            this.path = ''
            break
          case 'Y':
            this.startStation = false
            this.path = ''
            break
          case 'S':
            // get last 3 ball
            let lastThree = []
            let obj = {}
            for (let j = 1; j < 4; j++) {
              if (ParsedData[i - j] === 'X' || ParsedData[i - j] === 'Y' || ParsedData[i - j] === 'S' || ParsedData[i - j] === 'G' || ParsedData[i - j] === 'M') break
              lastThree.push(ParsedData[i - j])
            }
            obj['lastThree'] = lastThree
            // getpoint or lost point
            if (this.out) {
              if (!this.startStation) {
                this.yPoint++
                this.skill === 'B' ? this.status[0]++ : this.status[1]++
                obj['status'] = '出界或掛網'
                obj['point'] = false
              } else {
                this.xPoint++
                this.skill === 'B' ? this.status[2]++ : this.status[3]++
                obj['status'] = '出界或掛網'
                obj['point'] = true
              }
            } else {
              // add last ball to path
              this.startStation = !this.startStation
              position = this.getPos(ParsedData[i - 1])
              this.path = this.path.concat(`L${position[2]} ${position[3]}`)

              if (!this.startStation) {
                this.yPoint++
                this.skill === 'B' ? this.status[0]++ : this.status[1]++
                obj['status'] = '沒接到'
                obj['point'] = false
              } else {
                this.xPoint++
                this.skill === 'B' ? this.status[2]++ : this.status[3]++
                obj['status'] = '沒接到'
                obj['point'] = true
              }
            }
            this.out = false
            this.BallStatus.push(obj)
            this.pathList.push(this.path)
            // console.log(this.pathList)
            break
          case 'G':
            // end Round
            this.status.push(this.BallStatus)
            this.roundStatus.push(this.status)
            this.roundList.push(this.pathList)
            this.pathList = []
            this.xPoint = 0
            this.yPoint = 0
            this.BallStatus = []
            this.status = [0, 0, 0, 0]
            break
          case 'M':
            // end game
            this.setOption()
            break
          default :
            position = this.getPos(data)
            this.setPath(position)
            break
        }
      }
    },
    getPos: function (data) {
      let start = data.substr(1, 1)
      let end = data.substr(2, 1)
      let startPos = this.judgePosByBlock(this.startStation, start)
      let endPos = this.judgePosByBlock(!this.startStation, end)
      let result = []
      this.skill = data.substr(0, 1)
      this.startStation = !this.startStation

      if (endPos[0] === undefined) {
        // !startStation out
        // startStation get point
        this.out = true
        return startPos
      }
      result = startPos.concat(endPos)
      return result // [startx, starty, endx, endy]
    },
    judgePosByBlock: function (mode, block) {
      // mode:true  ball moving from bottom to top
      // mode:false ball moving from top to bottom
      let x, y
      if (mode) {
        switch (block) {
          case '1':
            x = 375
            y = 525
            break
          case '2':
            x = 225
            y = 525
            break
          case '3':
            x = 75
            y = 525
            break
          case '4':
            x = 375
            y = 375
            break
          case '5':
            x = 225
            y = 375
            break
          case '6':
            x = 75
            y = 375
            break
          default:
            break
        }
      } else {
        switch (block) {
          case '1':
            x = 75
            y = 75
            break
          case '2':
            x = 225
            y = 75
            break
          case '3':
            x = 375
            y = 75
            break
          case '4':
            x = 75
            y = 225
            break
          case '5':
            x = 225
            y = 225
            break
          case '6':
            x = 375
            y = 225
            break
          default:
            break
        }
      }
      return [x, y]
    },
    setPath: function (position) {
      this.path = this.path === '' ? `M${position[0]} ${position[1]} ` : this.path.concat(`L${position[0]} ${position[1]} `)
    },
    startMove: function () {
      this.pathIdx = 0
      this.start = true
      let ball = document.getElementById('Ball')
      // let SVGElement = document.getElementById('history_container')
      let pathList = this.roundList[this.roundIdx]
      let path = pathList[this.pathIdx]
      let moveTimes = (path.split(' ').length - 1) / 2 - 1
      let duration = moveTimes * 0.5 / this.speed

      // SVGElement.setCurrentTime(0)
      ball.setAttribute('dur', `${duration}s`)
      ball.setAttribute('path', path)
      this.ballStatus = this.roundStatus[this.roundIdx][4][this.pathIdx].status
      this.isGetPoint = this.roundStatus[this.roundIdx][4][this.pathIdx].point
      this.changeBallColor()
      this.clearLine()
      this.drawLastThreeLine()
    },
    nextMove: function () {
      let ball = document.getElementById('Ball')
      let SVGElement = document.getElementById('history_container')
      let pathList = this.roundList[this.roundIdx]

      if (this.pathIdx < pathList.length - 1) {
        this.pathIdx++
        let path = pathList[this.pathIdx]
        let moveTimes = (path.split(' ').length - 1) / 2 - 1
        let duration = moveTimes * 0.5 / this.speed

        // SVGElement.setCurrentTime(0)
        console.log(SVGElement.getCurrentTime())
        ball.setAttribute('dur', `${duration}s`)
        ball.setAttribute('path', path)
        this.ballStatus = this.roundStatus[this.roundIdx][4][this.pathIdx].status
        this.isGetPoint = this.roundStatus[this.roundIdx][4][this.pathIdx].point
        this.changeBallColor()
        this.clearLine()
        this.drawLastThreeLine()
      }
    },
    previousMove: function () {
      let ball = document.getElementById('Ball')
      // let SVGElement = document.getElementById('history_container')

      if (this.pathIdx !== 0) {
        this.pathIdx--
        let pathList = this.roundList[this.roundIdx]
        let path = pathList[this.pathIdx]
        let moveTimes = (path.split(' ').length - 1) / 2 - 1
        let duration = moveTimes * 0.5 / this.speed

        // SVGElement.setCurrentTime(0)
        ball.setAttribute('dur', `${duration}s`)
        ball.setAttribute('path', path)
        this.ballStatus = this.roundStatus[this.roundIdx][4][this.pathIdx].status
        this.isGetPoint = this.roundStatus[this.roundIdx][4][this.pathIdx].point
        this.changeBallColor()
        this.clearLine()
        this.drawLastThreeLine()
      }
    },
    currentMove: function () {
      let ball = document.getElementById('Ball')
      // let SVGElement = document.getElementById('history_container')
      let pathList = this.roundList[this.roundIdx]
      let path = pathList[this.pathIdx]
      let moveTimes = (path.split(' ').length - 1) / 2 - 1
      let duration = moveTimes * 0.5 / this.speed
      // SVGElement.setCurrentTime(0)
      ball.setAttribute('dur', `${duration}s`)
      ball.setAttribute('path', path)
      this.ballStatus = this.roundStatus[this.roundIdx][4][this.pathIdx].status
      this.isGetPoint = this.roundStatus[this.roundIdx][4][this.pathIdx].point
      this.changeBallColor()
      this.clearLine()
      this.drawLastThreeLine()
    },
    stopMove: function () {
      let SVGElement = document.getElementById('history_container')
      if (!this.playing) {
        let stopTime = SVGElement.getCurrentTime()
        console.log(stopTime)
        SVGElement.pauseAnimations()
        // console.log(SVGElement.animationsPaused())
      } else {
        let stopTime = SVGElement.getCurrentTime()
        console.log(stopTime)
        // SVGElement.setCurrentTime(0.1)
        SVGElement.unpauseAnimations()
      }
      this.playing = !this.playing
    },
    setOption: function () {
      let roundNum = this.roundList.length
      for (let idx = 0; idx < roundNum; idx++) {
        this.option.push({
          value: idx,
          text: idx + 1
        })
      }
    },
    showAnalysis: function () {
      this.BL = this.roundStatus[this.roundIdx][0]
      this.FL = this.roundStatus[this.roundIdx][1]
      this.BW = this.roundStatus[this.roundIdx][2]
      this.FW = this.roundStatus[this.roundIdx][3]
      this.max1 = this.roundStatus[this.roundIdx][0] + this.roundStatus[this.roundIdx][1]
      this.max2 = this.roundStatus[this.roundIdx][2] + this.roundStatus[this.roundIdx][3]
      this.roundStatus.forEach(el => {
        this.ABL += el[0]
        this.AFL += el[1]
        this.ABW += el[2]
        this.AFW += el[3]
      })
      this.Amax1 = this.ABL + this.AFL
      this.Amax2 = this.ABW + this.AFW
      this.showAna = true
    },
    changeBallColor: function () {
      let ball = document.getElementById('ballon')
      this.isGetPoint ? ball.setAttribute('fill', 'red') : ball.setAttribute('fill', 'blue')
    },
    drawLastThreeLine: function () {
      let status = this.roundStatus[this.roundIdx][4][this.pathIdx]
      let getPoint = status.point
      let ballstatus = status.status
      let idx = 0
      let pos
      this.startStation = !getPoint
      if (ballstatus === '出界或掛網') {
        // outside ball
        status.lastThree.forEach(ball => {
          pos = this.getPos(ball)
          this.lastThreeXY[idx] = pos[0]
          this.lastThreeXY[idx + 1] = pos[1]
          idx += 2
        })
      } else {
        // do not catch
        for (let i = 0; i < status.lastThree.length; i++) {
          pos = this.getPos(status.lastThree[i])
          if (i === 0) {
            this.lastThreeXY[idx] = pos[2]
            this.lastThreeXY[idx + 1] = pos[3]
            this.lastThreeXY[idx + 2] = pos[0]
            this.lastThreeXY[idx + 3] = pos[1]
            idx += 4
          } else {
            this.lastThreeXY[idx] = pos[0]
            this.lastThreeXY[idx + 1] = pos[1]
            idx += 2
          }
          if (idx === 6) break
        }
      }
      this.lineNum = status.lastThree.length === 3 ? 2 : 1
    },
    clearLine: function () {
      this.lastThreeXY = [0, 0, 0, 0, 0, 0]
    }
  },
  mounted () {
    this.setData()
  }
}
</script>

<style>
.showHistory_container {
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: center;
}
.showHistory_container > div {
  display: flex;
  flex-direction: column;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
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
  padding: 5px 5px;
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
  margin: 5px 0;
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

#showAnalysis {
  width: 100px;
  height: 50px;
}

#toggle-btn {
  width: 200px;
  height: 35px;
}

</style>