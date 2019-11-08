<template>
  <div id="record_container">
    <div class="leftPart">
      <div class="symbol_container">
        <button class="operateBtn" id="skill1" @click='hand="正手"'> 正手 </button>
        <button class="operateBtn" id="skill2" @click='hand="反手"'> 反手 </button>
      </div>
      <div class="toolList" >
        <!-- <div class="toolNode serve" id="servePoint"> 發球得分 </div> -->
        <div class="toolNode getPoint" id="getPoint"> 得分 </div>
        <div class="toolNode lostPoint" id="lostPoint"> 失分 </div>
      </div>
      <br>
      <br>
      <br>
      <br>
      <div class="btn_container">
        <button class="operateBtn" id="updateBtn" @click='oneHand'> 更新 </button>
        <button class="operateBtn" id="deleteBtn" @click='deletePreviousHand'> 刪除 </button>
        <button class="operateBtn" id="stopBtn" @click='showModal'> 暫停 </button>
        <button class="operateBtn" id="endBtn" @click='endRound'> 完局 </button>
        <button class="operateBtn" id="replayBtn" @click='showReview'> 回放 </button>
      </div>
    </div>
    <div class="table_container">
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
        <line :x1="prev_x-absX" :y1="prev_y-absY" :x2="x-absX" :y2="y-absY" stroke='red' marker-end="url(#arrow-head)" v-show="showLine"/>
        <line x1='0' y1='300' x2='450' y2='300' stroke-width="4" stroke='red'/>
        <image xlink:href="../assets/person.png" x=0 y=0 width="40px" height="40px" v-show="station === 'top'"/>
        <image xlink:href="../assets/person.png" x=0 y=560 width="40px" height="40px" v-show="station === 'bottom'"/>
      </svg>
    </div>
    <div id="list">
      <div id="title">
        <button class="operateBtn" id='infoBox' @click="changeInfo">資訊</button>
      </div>
      <div>
        <div class="record">比分</div>
        <div class="record">發球方</div>
        <div class="record">擊球技術</div>
        <div class="record">落點</div>
      </div>
      <div>
        <lists v-for="(item, index) in oneRound" :index="index" :key="index" :item="item" @fix="showChangeModal(index)"></lists>
      </div>
    </div>
    <InputModal ref="info" @getInfo="getModalInfo"></InputModal>
    <FixModal ref="changeData" :data="changeData" @newData="changeListData"></FixModal>
    <Review ref="review" :data="allRounds"></Review>

    <b-modal ref="stopModal" hide-footer title="暫停">
      <div class="d-block text-center">
        <h3>誰要求暫停？</h3>
      </div>
      <div class="stopBtns">
        <button class="stopBtn" @click="callStop(1)" v-if="stopBtn[0]">{{name1}}</button>
        <button class="stopBtn" @click="callStop(2)" v-if="stopBtn[1]">{{name2}}</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Block from './recordForm/perBlock.vue'
import lists from './recordForm/list_Item'
import InputModal from './recordForm/input_modal'
import FixModal from './recordForm/change_modal'
import Review from './recordForm/review'

export default {
  components: {
    lists,
    InputModal,
    FixModal,
    Review,
    Block
  },
  data: function () {
    return {
      serve: null,
      name1: '',
      name2: '',
      game: '',
      station: '',
      oneRound: [],
      allRounds: [],
      roundScore: [0, 0], // win , lose
      currentScore: [0, 0], // my point , the other side point
      hand: '',
      NumOfBoard: '',
      inputData: null,
      skill: '',
      stopTimes: 0,
      stopBtn: [true, true],
      changeData: null,
      placement: '',
      prev_placement: '',
      block_part: '0',
      prev_block_part: '0',
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
      absY: 0,
      numOfRounds: ''
    }
  },
  methods: {
    oneHand: function () {
      document.getElementById('skill1').classList.remove('clickedBtn')
      document.getElementById('skill2').classList.remove('clickedBtn')
      if (this.inputData === null || this.inputData[0] === '' || this.inputData[1] === '' || this.inputData[2] === '' || this.inputData[3] === null) {
        alert('請先填寫資訊')
        this.$bvModal.show('infoModal')
        this.resetTouch()
        return
      }

      if (this.hand === '') {
        alert('請選擇正反手！！')
        this.resetTouch()
        return
      }

      // get serve, point, forehand, backhand
      this.skill = (this.hand === '正手') ? 'F' + this.prev_placement : 'B' + this.prev_placement

      // add score
      this.getpoint ? this.currentScore[0]++ : this.currentScore[1]++

      // change serve side
      if (this.oneRound.length === 0) {
      } else if (this.currentScore[0] >= 10 && this.currentScore[1] >= 10) {
        // when duce, we should change serve side every hand
        this.serve = !this.serve
      } else if ((this.oneRound.length - this.stopTimes) % 2 === 0) {
        this.serve = !this.serve
      }

      // change hot zone
      let idx = (!(this.prev_x !== 0 && this.prev_y !== 0)) ? (12 - Number(this.prev_placement)) : (this.getpoint) ? (parseInt(this.placement, 10) - 1) : (12 - parseInt(this.placement, 10))
      this.opacity[idx] += (this.opacity[idx] < 1) ? 0.2 : 0
      this.changeHotZone(this.station)

      // record every round
      let perBall = {
        currentScore: String(this.currentScore),
        serve: this.serve ? '1' : '0',
        skill: this.serve_point ? 'S' : this.skill,
        part: this.prev_block_part,
        getpoint: this.getpoint,
        station: this.station,
        placement: (this.prev_x !== 0 && this.prev_y !== 0) ? this.placement : '0',
        placement_part: this.block_part.substr(4),
        opacity: String(this.opacity)
      }

      this.oneRound.push(perBall)

      // initial drag object's position
      this.resetTouch()
      this.hand = ''

      // save to localStorage
      this.save()
    },
    deletePreviousHand: function () {
      if (this.oneRound.length === 0) return
      let lastHand = this.oneRound[this.oneRound.length - 1]
      this.oneRound.pop()

      if (lastHand.stop) {
        this.stopTimes--
        this.stopBtn[lastHand.no - 1] = true
      } else {
        if (this.oneRound.length === 0) {
          this.serve = (this.inputData[4] === 'true')
          this.currentScore = [0, 0]
          this.opacity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          this.changeHotZone(this.inputData[3])
        } else {
          let lastHand = this.oneRound[this.oneRound.length - 1]
          // TODO : double time stop will trig issue
          if (lastHand.stop) {
            lastHand = this.oneRound[this.oneRound.length - 2]
          }
          this.serve = lastHand.stop ? this.serve : lastHand.serve
          this.currentScore = JSON.parse('[' + lastHand.currentScore + ']')
          this.opacity = JSON.parse('[' + lastHand.opacity + ']')
          this.changeHotZone(lastHand.station)
        }
      }
    },
    clearPreviousData: function () {
      // clear previous data
      this.resetTouch()
      this.initInfo()
      this.oneRound = []
      this.allRounds = []
      this.NumOfBoard = ''
      this.roundScore = [0, 0]
      this.stopTimes = 0
    },
    endRound: function () {
      // check this round is win or not
      this.currentScore[0] > this.currentScore[1] ? this.roundScore[0]++ : this.roundScore[1]++
      this.allRounds.push({no: this.allRounds.length + 1, round: this.oneRound})

      // clear previous data
      this.resetTouch()
      this.clearLine()
      this.oneRound = []

      // init table color
      this.changeColor()
      this.station = this.station

      // init score
      this.currentScore = [0, 0]

      if (this.isFinished()) {
        let winer = this.roundScore[0] > Number(this.NumOfBoard) / 2 ? this.name1 : this.name2
        let check = confirm(`${winer} 獲勝\n 要上傳資料嗎？`)
        if (check) {
          this.sendData()
        } else {
          alert('no send')
        }
      }

      this.save()
    },
    isFinished: function () {
      let NumOfBoard = Number(this.NumOfBoard)
      return this.roundScore.find(function (item, idx, array) {
        return item > NumOfBoard / 2
      })
    },
    sendData: function () {
      // alert
      let currentDate = new Date()
      let year = currentDate.getFullYear()
      let month = currentDate.getMonth()
      let date = currentDate.getDate()
      let hour = currentDate.getHours()
      let min = currentDate.getMinutes()
      let insertData = {
        name: this.name1,
        isWin: this.roundScore[0] > this.roundScore[1],
        game: this.game,
        detail: {
          result: this.roundScore[0] > this.roundScore[1] ? 'win' : 'lose',
          scores: `${this.roundScore[0]}:${this.roundScore[1]}`,
          date: `${year}/${month}/${date} ${hour}:${min}`,
          NumOfBoard: this.NumOfBoard,
          competitor: this.name2,
          rounds: this.allRounds
        }
      }

      // insert game's data
      this.$store.dispatch('insertData', insertData).then(() => {
        this.clearPreviousData()
        alert('upload success!')
      })

      // init table color
      this.changeColor()

      // init score
      this.currentScore = [0, 0]

      this.clearLine()
    },
    getModalInfo: function (data) {
      this.inputData = data
      this.game = data[0]
      this.name1 = data[1]
      this.name2 = data[2]
      this.station = data[3]
      this.serve = (data[4] === 'true')
      this.NumOfBoard = data[5]
      this.numOfRounds = data[6]
      this.changeHotZone(this.station)
      // save to localStorage
      this.save()
    },
    changeInfo: function () {
      this.$bvModal.show('infoModal')
    },
    showReview: function () {
      this.$refs.review.isOpen = true
    },
    save: function () {
      let status = {
        serve: this.serve,
        name1: this.name1,
        name2: this.name2,
        game: this.game,
        numOfRounds: this.numOfRounds,
        station: this.station,
        oneRound: this.oneRound,
        allRounds: this.allRounds,
        roundScore: this.roundScore,
        currentScore: this.currentScore,
        NumOfBoard: this.NumOfBoard,
        inputData: this.inputData,
        stopTimes: this.stopTimes
      }
      localStorage.setItem('status', JSON.stringify(status))
    },
    load: function (prevStatus) {
      // localStorage.setItem('status', null)
      this.serve = prevStatus.serve
      this.name1 = prevStatus.name1
      this.name2 = prevStatus.name2
      this.game = prevStatus.game
      this.numOfRounds = prevStatus.numOfRounds
      this.station = prevStatus.station
      this.oneRound = prevStatus.oneRound
      this.allRounds = prevStatus.allRounds
      this.roundScore = prevStatus.roundScore
      this.currentScore = prevStatus.currentScore
      this.NumOfBoard = prevStatus.NumOfBoard
      this.inputData = prevStatus.inputData
      this.stopTimes = prevStatus.stopTimes
      this.$refs.info.name1 = prevStatus.name1
      this.$refs.info.name2 = prevStatus.name2
      this.$refs.info.game = prevStatus.game
      this.$refs.info.selected = this.station
      this.$refs.info.numOfBoards = prevStatus.NumOfBoard
      this.$refs.info.serve = prevStatus.serve
      this.$refs.info.numOfRounds = prevStatus.numOfRounds

      // change hot zone
      this.oneRound.forEach(data => {
        let idx = (data.placement === '0') ? (12 - Number(data.skill.split('F')[1] === undefined ? data.skill.split('B')[1] : data.skill.split('F')[1])) : (data.getpoint) ? (parseInt(data.placement, 10) - 1) : (12 - parseInt(data.placement, 10))
        this.opacity[idx] += (this.opacity[idx] < 1) ? 0.2 : 0
        this.changeHotZone(data.station)
      })
      this.station = this.station
    },
    callStop: function (no) {
      let stop = {
        stop: true,
        no: no,
        player: no === 1 ? this.name1 : this.name2
      }
      this.stopTimes++
      this.oneRound.push(stop)
      this.hideModal()
      this.stopBtn[no - 1] = false
    },
    showModal: function () {
      this.$refs['stopModal'].show()
    },
    hideModal: function () {
      this.$refs['stopModal'].hide()
    },
    showChangeModal: function (index) {
      this.changeData = this.oneRound[index]
      this.changeData['index'] = index
      this.$bvModal.show('fixModal')
    },
    changeListData: function (newData) {
      this.oneRound[newData.index].skill = newData.skill
      this.oneRound[newData.index].placement = newData.placement
      this.oneRound[newData.index].placement_part = newData.placement_part
      this.oneRound[newData.index].part = newData.part
      this.$bvModal.hide('fixModal')
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
          this.resetTouch()
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
    resetTouch: function () {
      let getPoint = document.getElementById('getPoint')
      let lostPoint = document.getElementById('lostPoint')
      // let servePoint = document.getElementById('servePoint')
      // servePoint.style.left = 30 + 'px'
      // servePoint.style.top = 178 + 'px'
      getPoint.style.left = 30 + 'px'
      getPoint.style.top = 206.5 + 'px'
      lostPoint.style.left = 30 + 'px'
      lostPoint.style.top = 265 + 'px'
      this.serve_point = false
      this.getpoint = false
      this.current_drag = ''
      this.placement = ''
      this.prev_placement = ''
      this.block_part = '0'
      this.prev_block_part = '0'
      this.skill = ''
      this.clearLine()
    },
    initInfo: function () {
      this.inputData = null
      this.game = ''
      this.name1 = ''
      this.name2 = ''
      this.station = ''
      this.serve = null
      this.NumOfBoard = ''
    },
    initTouch: function () {
      let getPoint = document.getElementById('getPoint')
      let lostPoint = document.getElementById('lostPoint')
      // let servePoint = document.getElementById('servePoint')

      // when touchstart
      getPoint.addEventListener('touchstart', this.start_mov, false)
      lostPoint.addEventListener('touchstart', this.start_mov, false)
      // servePoint.addEventListener('touchstart', this.start_mov, false)
      // when touchmove
      getPoint.addEventListener('touchmove', this.move_with_finger, false)
      lostPoint.addEventListener('touchmove', this.move_with_finger, false)
      // servePoint.addEventListener('touchmove', this.move_with_finger, false)

      // when touchend
      getPoint.addEventListener('touchend', this.moveStop, false)
      lostPoint.addEventListener('touchend', this.moveStop, false)
      // servePoint.addEventListener('touchend', this.moveStop, false)

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
    initButtons: function () {
      // set buttons' clicked view
      let elements = [document.getElementById('skill1'), document.getElementById('skill2')]
      let toggle = (e) => {
        if (e.target.id === 'skill1') {
          elements[0].classList.add('clickedBtn')
          elements[1].classList.remove('clickedBtn')
        } else {
          elements[1].classList.add('clickedBtn')
          elements[0].classList.remove('clickedBtn')
        }
      }
      elements.forEach(ele => {
        ele.addEventListener('click', toggle, false)
      })

      document.getElementById('infoBox').addEventListener('pointerdown', function () {
        document.getElementById('infoBox').classList.add('clickedBtn')
      }, false)

      document.getElementById('infoBox').addEventListener('pointerup', function () {
        document.getElementById('infoBox').classList.remove('clickedBtn')
      }, false)

      let btnsId = ['updateBtn', 'deleteBtn', 'stopBtn', 'endBtn', 'replayBtn']
      btnsId.forEach(id => {
        let element = document.getElementById(id)
        element.addEventListener('pointerdown', function () {
          element.classList.add('clickedBtn')
        }, false)
        element.addEventListener('pointerup', function () {
          element.classList.remove('clickedBtn')
        }, false)
      })
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
    this.initButtons()
    // forbid presslong to pop menu
    document.oncontextmenu = function (e) {
      e.preventDefault()
      return false
    }

    let prevStatus = JSON.parse(localStorage.getItem('status'))

    if (prevStatus === null) {
      this.$bvModal.show('infoModal')
    } else {
      if (confirm('要恢復先前狀態嗎？')) {
        this.load(prevStatus)
      } else {
        localStorage.setItem('status', null)
        // init data
        this.clearPreviousData()
        // init table color
        this.changeColor()
        // init score
        this.currentScore = [0, 0]
        this.clearLine()
        this.$bvModal.show('infoModal')
      }
    }
  }
}
</script>

<style>
#record_container {
  display: flex;
  flex-direction: row;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.table_container {
  margin-top: 10px;
}

.stopBtns {
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.toolNode {
  width: 4.5em;
  height: 4.5em;
  border-radius: 100%;
  border: 2px solid;
  font-size: .75em;
  margin: .25em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-weight: bold;
  outline: 0px solid lightseagreen;
  outline-offset: 0em;
  transition: box-shadow ease-in-out .25s;
}

.toolNode.serve {
  border-color: orange;
  display: inline-grid;
}

.toolNode.getPoint {
  border-color: red;
  display: inline-grid;
}

.toolNode.lostPoint {
  border-color: blue;
  display: inline-grid;
}

#list {
  display: flex;
  flex-direction: column;
  width: auto;
  padding: 10px;
}
.record {
  float: left;
  border: 1px solid black;
  width: 90px;
  height: 35px;
}
#table {
  padding: 10px;
}

.btn_container {
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  margin-left: 30px;
}
#title {
  display: flex;
  flex-direction: row
}

#btn {
  border-top: 10px;
  margin-top: 3%;
  height: 30px;
}
#title2 {
  margin-left: 335px;
  position: fixed;
}
.symbol_container {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 10px;
  margin-left: 30px;
  height: 150px;
  width: 100px;
}
#box {
  height: 150px;
  width: 100px; 
}

#leftPart {
  text-align: center;
}

.operateBtn {
  padding: 7px;
  margin-top: 5px;
  background-color: white;
  color: rgb(108, 110, 254);
  font-size: 1.1rem;
  border: 1px solid rgb(108, 110, 254);
  border-radius: 10px;
  width: 60px;
  height: 50px;
}

.stopBtn {
  padding: 7px;
  margin: 5px;
  background-color: white;
  color: red;
  font-size: 1.1rem;
  border: 1px solid red;
  border-radius: 10px;
  width: 45%;
  height: 50px;
}

.clickedBtn {
  background-color: rgb(108, 110, 254);
  color: white;
}

#getPoint {
  position:absolute;
  left: 30px;
  top: 206.5px;
}
#lostPoint {
  position:absolute;
  left: 30px;
  top: 265px;
}
/* #servePoint {
  position:absolute;
  left: 30px;
  top: 178px;
} */
.overlap {
  z-index: 2;
  background-color: "red";
}
#topPerson, #bottomPerson {
  background-image: url('../assets/person.png');
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50% 50%
}

</style>
