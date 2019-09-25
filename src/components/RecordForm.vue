<template>
  <div id="record_container">
    <div class="leftPart">
      <div class="symbol_container">
        <b-button id="skill1" variant="outline-primary" @click='hand="正手"'> 正手 </b-button>
        <b-button id="skill2" variant="outline-primary" @click='hand="反手"'> 反手 </b-button>
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
      <br>
      <br>
      <div class="btn_container">
        <b-button id="btn1" variant="outline-primary" @click='oneHand'> 更新 </b-button>
        <b-button id="btn2" variant="outline-primary" @click='deletePreviousHand'> 刪除 </b-button>
        <b-button id="btn3" variant="outline-primary" @click='endRound'> 完局 </b-button>
        <!-- <b-button id="btn5" variant="outline-primary" @click='save'> 緩存 </b-button> -->
        <b-button id="btn6" variant="outline-primary" @click='showModal'> 暫停 </b-button>
        <!-- <b-button id="btn5" variant="outline-primary" @click='showHistory()'> 回放 </b-button> -->
      </div>
    </div>
    <drag id="table" ref="table"></drag>
    <div id="list">
      <div id="title">
        <div id="Name1">{{this.name1}}</div>
        <div id="Name2">{{this.name2}}</div>
        <div id="Game">{{this.game}}</div>
        <b-button size="sm" variant="outline-primary" id='infoBox' @click="changeInfo">資訊</b-button>
      </div>
      <div>
        <div class="record">比分</div>
        <div class="record">發球方</div>
        <div class="record">擊球技術</div>
        <div class="record">得分落點</div>
      </div>
      <div>
        <lists v-for="(item, index) in oneRound" :index="index" :key="index" :item="item" @fix="showChangeModal(index)"></lists>
      </div>
    </div>
    <History ref="history"></History>
    <InputModal @getInfo="getModalInfo"></InputModal>
    <FixModal ref="changeData" :data="changeData" @newData="changeListData"></FixModal>

    <b-modal ref="my-modal" hide-footer title="暫停">
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
import History from './recordForm/History'
import InputModal from './recordForm/input_modal'
import FixModal from './recordForm/change_modal'

export default {
  components: {
    drag,
    lists,
    History,
    InputModal,
    FixModal
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
      history: [],
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
      if (this.inputData === null || this.inputData[0] === '' || this.inputData[1] === '' || this.inputData[2] === '' || this.inputData[3] === null) {
        alert('請先填寫資訊')
        this.$bvModal.show('modal-1')
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
        placement: this.$refs.table.placement,
        placement_part: this.$refs.table.block_part.substr(4)
      }

      this.oneRound.push(perBall)
      this.history.push(perBall)

      // change hot zone
      let idx = (perBall.getpoint) ? (parseInt(perBall.placement, 10) - 1) : (12 - parseInt(perBall.placement, 10))
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

      // delete history
      this.history.pop()
    },
    clearPreviousData: function () {
      // clear previous data
      this.$refs.table.initialTouch()
      this.initInfo()
      this.oneRound = []
      this.allRounds = []
      this.history = []
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

      // reset table to green
      for (let i = 1; i <= 12; i++) {
        document.getElementById(`group${i}`).style.background = 'green'
      }

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
      this.$bvModal.show('modal-1')
    },
    showHistory: function () {
      this.$refs.history.showList = this.history
      this.$bvModal.show('modal-2')
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
        history: this.history,
        roundScore: this.roundScore,
        currentScore: this.currentScore,
        NumOfBoard: this.NumOfBoard,
        inputData: this.inputData,
        stopTimes: this.stopTimes
      }
      localStorage.setItem('status', JSON.stringify(status))
    },
    load: function (prevStatus) {
      localStorage.setItem('status', null)
      this.serve = prevStatus.serve
      this.name1 = prevStatus.name1
      this.name2 = prevStatus.name2
      this.game = prevStatus.game
      this.station = prevStatus.station
      this.oneRound = prevStatus.oneRound
      this.allRounds = prevStatus.allRounds
      this.history = prevStatus.history
      this.roundScore = prevStatus.roundScore
      this.currentScore = prevStatus.currentScore
      this.NumOfBoard = prevStatus.NumOfBoard
      this.inputData = prevStatus.inputData
      this.stopTimes = prevStatus.stopTimes

      // change hot zone
      this.oneRound.forEach(data => {
        let idx = (data.getpoint) ? (parseInt(data.placement, 10) - 1) : (12 - parseInt(data.placement, 10))
        this.$refs.table.opacity[idx] += (this.$refs.table.opacity[idx] < 1) ? 0.2 : 0
        this.$refs.table.changeHotZone(data.station)
      })
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
      this.$refs['my-modal'].show()
    },
    hideModal: function () {
      this.$refs['my-modal'].hide()
    },
    showChangeModal: function (index) {
      this.changeData = this.oneRound[index]
      this.changeData['index'] = index
      this.$bvModal.show('modal-3')
    },
    changeListData: function (newData) {
      this.oneRound[newData.index].skill = newData.skill
      this.oneRound[newData.index].placement = newData.placement
      this.oneRound[newData.index].placement_part = newData.placement_part
      this.oneRound[newData.index].part = newData.part
      this.$bvModal.hide('modal-3')
    }
  },
  mounted () {
    let prevStatus = JSON.parse(localStorage.getItem('status'))

    if (prevStatus === null) {
      this.$bvModal.show('modal-1')
    } else {
      if (confirm('要恢復先前狀態嗎？')) {
        this.load(prevStatus)
      } else {
        localStorage.setItem('status', null)
        this.$bvModal.show('modal-1')
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
#btn1 {
  /* margin-top: 4px; */
  width: 60px;
  height: 60px;
}
#btn2, #btn3, #btn4, #btn5, #btn6, #skill1, #skill2 {
  width: 60px;
  height: 60px;
  padding: 10px;
} 
.btn_container {
  display: flex;
  flex-direction: column;
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
  height: 150px;
  width: 100px;
}
#box {
  height: 150px;
  width: 100px; 
}

#infoBox {
  height: 50px;
  width: 60px;
}

#leftPart {
  text-align: center;
}

</style>
