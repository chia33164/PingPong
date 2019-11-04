<template>
  <div id="record_container">
    <div class="leftPart">
      <div class="symbol_container">
        <button class="operateBtn" id="skill1" @click='hand="正手"'> 正手 </button>
        <button class="operateBtn" id="skill2" @click='hand="反手"'> 反手 </button>
      </div>
      <div class="toolList" >
        <div class="toolNode serve" id="servePoint"> 發球得分 </div>
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
    <drag id="table" ref="table"></drag>
    <div id="list">
      <div id="title">
        <div id="Name1">{{this.name1}}</div>
        <div id="Name2">{{this.name2}}</div>
        <div id="Game">{{this.game}}</div>
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
      <b-button class="mt-3" variant="outline-danger" block @click="callStop(1)" v-if="stopBtn[0]">{{name1}}</b-button>
      <b-button class="mt-3" variant="outline-danger" block @click="callStop(1)" v-else disabled>{{name1}}</b-button>
      <b-button class="mt-2" variant="outline-danger" block @click="callStop(2)" v-if="stopBtn[1]">{{name2}}</b-button>
      <b-button class="mt-2" variant="outline-danger" block @click="callStop(2)" v-else disabled>{{name2}}</b-button>
    </b-modal>
  </div>
</template>

<script>
import drag from './recordForm/drag_object'
import lists from './recordForm/list_Item'
import InputModal from './recordForm/input_modal'
import FixModal from './recordForm/change_modal'
import Review from './recordForm/review'

export default {
  components: {
    drag,
    lists,
    InputModal,
    FixModal,
    Review
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
      changeData: null
    }
  },
  methods: {
    oneHand: function () {
      document.getElementById('skill1').classList.remove('clickedBtn')
      document.getElementById('skill2').classList.remove('clickedBtn')
      if (this.inputData === null || this.inputData[0] === '' || this.inputData[1] === '' || this.inputData[2] === '' || this.inputData[3] === null) {
        alert('請先填寫資訊')
        this.$bvModal.show('infoModal')
        this.skill = ''
        this.$refs.table.initialTouch()
        return
      }

      if (this.hand === '') {
        alert('請選擇正反手！！')
        this.$refs.table.initialTouch()
        return
      }

      // get serve, point, forehand, backhand
      this.skill = (this.hand === '正手') ? 'F' + this.$refs.table.prev_placement : 'B' + this.$refs.table.prev_placement

      // add score
      this.$refs.table.getpoint ? this.currentScore[0]++ : this.currentScore[1]++

      // change serve side
      if (this.oneRound.length === 0) {
      } else if (this.currentScore[0] >= 10 && this.currentScore[1] >= 10) {
        // when duce, we should change serve side every hand
        this.serve = !this.serve
      } else if ((this.oneRound.length - this.stopTimes) % 2 === 0) {
        this.serve = !this.serve
      }

      // record every round
      let perBall = {
        score: `${this.currentScore[0]}:${this.currentScore[1]}`,
        serve: this.serve ? '1' : '0',
        skill: this.$refs.table.serve_point ? 'S' : this.skill,
        part: this.$refs.table.prev_block_part,
        getpoint: this.$refs.table.getpoint,
        station: this.$refs.table.station,
        placement: (this.$refs.table.prev_x !== 0 && this.$refs.table.prev_y !== 0) ? this.$refs.table.placement : '0',
        placement_part: this.$refs.table.block_part.substr(4)
      }

      this.oneRound.push(perBall)

      // change hot zone
      let idx = (perBall.placement === '0') ? (12 - Number(this.$refs.table.prev_placement)) : (perBall.getpoint) ? (parseInt(perBall.placement, 10) - 1) : (12 - parseInt(perBall.placement, 10))
      this.$refs.table.opacity[idx] += (this.$refs.table.opacity[idx] < 1) ? 0.2 : 0
      this.$refs.table.changeHotZone(perBall.station)

      // initial drag object's position
      this.$refs.table.initialTouch()
      this.hand = ''

      // save to localStorage
      this.save()
    },
    deletePreviousHand: function () {
      let lastHand = this.oneRound[this.oneRound.length - 1]
      let idx

      if (lastHand.stop) {
        this.oneRound.pop()
        this.stopTimes--
      } else {
        idx = lastHand.getpoint ? (parseInt(lastHand.placement, 10) - 1) : (12 - parseInt(lastHand.placement, 10))

        // resume previous opacity
        this.$refs.table.opacity[idx] -= (this.$refs.table.opacity[idx] > 0) ? 0.2 : 0
        this.$refs.table.changeHotZone(lastHand.station)

        // init score
        if (this.oneRound.length === 0) {
          this.currentScore = [0, 0]
        } else if (this.oneRound.length === 1) {
          this.oneRound.pop()
          this.currentScore = [0, 0]
        } else {
          this.oneRound.pop()
          let score = this.oneRound[this.oneRound.length - 1].score
          let iter = 0

          // skip timeout
          while (score === undefined) {
            iter++
            score = this.oneRound[this.oneRound.length - 1 - iter].score
            // stop and turn serve side
            if ((this.oneRound.length - this.stopTimes) % 2 === 0) this.serve = !this.serve
          }

          let myPoint = score.split(':')[0]
          let hisPoint = score.split(':')[1]
          this.currentScore = [myPoint, hisPoint]
        }

        // resume serve side
        let previousServe = this.oneRound[this.oneRound.length - 1].serve
        this.serve = (this.oneRound.length === 0) ? (this.inputData[4] === 'true') : (previousServe === undefined) ? this.serve : (previousServe === '1')
      }
    },
    clearPreviousData: function () {
      // clear previous data
      this.$refs.table.initialTouch()
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
      this.$refs.table.initialTouch()
      this.$refs.table.clearLine()
      this.oneRound = []

      // init table color
      this.$refs.table.changeColor()
      this.station = this.$refs.table.station

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
      this.$refs.table.changeColor()

      // init score
      this.currentScore = [0, 0]

      this.$refs.table.clearLine()
    },
    getModalInfo: function (data) {
      this.inputData = data
      this.game = data[0]
      this.name1 = data[1]
      this.name2 = data[2]
      this.station = data[3]
      this.serve = (data[4] === 'true')
      this.NumOfBoard = data[5]
      this.$refs.table.changeHotZone(this.station)
      // save to localStorage
      this.save()
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

      // change hot zone
      this.oneRound.forEach(data => {
        let idx = (data.placement === '0') ? (12 - Number(data.skill.split('F')[1] === undefined ? data.skill.split('B')[1] : data.skill.split('F')[1])) : (data.getpoint) ? (parseInt(data.placement, 10) - 1) : (12 - parseInt(data.placement, 10))
        this.$refs.table.opacity[idx] += (this.$refs.table.opacity[idx] < 1) ? 0.2 : 0
        this.$refs.table.changeHotZone(data.station)
      })
      this.$refs.table.station = this.station
    },
    callStop: function (no) {
      let stop = {
        stop: true,
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
    }
  },
  mounted () {
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
      document.getElementById(id).addEventListener('pointerdown', function () {
        document.getElementById(id).classList.add('clickedBtn')
      }, false)
      document.getElementById(id).addEventListener('pointerup', function () {
        document.getElementById(id).classList.remove('clickedBtn')
      }, false)
    })

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
        this.$refs.table.changeColor()
        // init score
        this.currentScore = [0, 0]
        this.$refs.table.clearLine()
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

#Name1, #Name2 {
  height: 50px;
  width: 65px;
  text-align: center;
}
#Game {
  height: 50px;
  width: 200px;
  text-align: center;
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

.clickedBtn {
  background-color: rgb(108, 110, 254);
  color: white;
}

</style>
