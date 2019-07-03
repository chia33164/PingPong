<template>
  <div id="record_container">
    <div id="list">
      <div id="title" v-if="isWhite">
        <input type="text" v-model="name1" id="name1" placeholder="我方">
        <input type="text" v-model="name2" id="name2" placeholder="對方">
        <input type="text" v-model="game" id="game" placeholder="Game">
        <input type="button" @click="saveName" value="click" id="btn">
      </div>
      <div id="title" v-else>
        <p id="Name1">{{this.name1}}</p>
        <p id="Name2">{{this.name2}}</p>
        <p id="Game">{{this.game}}</p>
      </div>
      <div>
        <input type="checkbox" id="one" value="1" v-model="NumOfBoard">
        <label for="one">1 局</label>
        <input type="checkbox" id="two" value="2" v-model="NumOfBoard">
        <label for="two">2 局</label>
        <input type="checkbox" id="three" value="3" v-model="NumOfBoard">
        <label for="three">3 局</label>
        <input type="checkbox" id="four" value="4" v-model="NumOfBoard">
        <label for="four">4 局</label>
        <input type="checkbox" id="five" value="5" v-model="NumOfBoard">
        <label for="five">5 局</label>
        <input type="checkbox" id="six" value="6" v-model="NumOfBoard">
        <label for="six">6 局</label>
        <input type="checkbox" id="seven" value="7" v-model="NumOfBoard">
        <label for="seven">7 局</label>
      </div>
      <div>
        <div class="record">比分</div>
        <div class="record">發球方</div>
        <div class="record">擊球技術</div>
        <div class="record">得分落點</div>
      </div>
      <div>
        <lists v-for="(item, index) in oneRound" :index="index" :key="index" :item="item"></lists>
      </div>
    </div>
    <drag id="table" ref="table"></drag>
    <div>
      <sym ref="symbol"></sym>
      <br>
      <div class="dragBlock">
        <div width="40px" height="40px" id="servePoint"></div>
      </div>
      <div class="dragBlock">
        <div width="40px" height="40px" id="getPoint"></div>
      </div>
      <div class="dragBlock">
        <div width="40px" height="40px" id="lostPoint"></div>
      </div>
      <div class="btn_container">
        <button id="btn1" type='button' @click='oneHand'> 更新 </button>
        <button id="btn2" type='button' @click='deletePreviousHand'> 刪除 </button>
        <button id="btn3" type='button' @click='endRound'> 完局 </button>
        <button id="btn4" type='button' @click='sendData'> 上傳 </button>
        <button id="btn5" type='button' @click='showHistory = true'> 回放 </button>
      </div>
    </div>
    <History :showList="history" v-if='showHistory' @close='showHistory = false'></History>
  </div>
</template>

<script>
import sym from './recordForm/symbol'
import drag from './recordForm/drag_object'
import lists from './recordForm/list_Item'
import History from './recordForm/showHistory'

export default {
  components: {
    sym,
    drag,
    lists,
    History
  },
  data: function () {
    return {
      serve: '',
      point: '',
      hand: '',
      part: '',
      oneRound: [],
      allRounds: [],
      history: [],
      name1: '',
      name2: '',
      game: '',
      winRound: 0,
      loseRound: 0,
      myPoint: 0,
      hisPoint: 0,
      result: '',
      score: '',
      x: 0,
      y: 0,
      isWhite: true,
      NumOfBoard: [],
      showHistory: false,
      showInfo: true
    }
  },
  methods: {
    oneHand: function () {
      if (this.$refs.table.presslong) {
        // reset presslong
        this.$refs.table.presslong = false
        this.$refs.table.drawLine = false
      }
      // change serve side
      if (this.oneRound.length === 0) {
        this.serve = this.$refs.symbol.serve
      } else if (this.myPoint >= 10 && this.hisPoint >= 10) {
        // when duce, we should change serve side every hand
        this.serve = this.serve === '0' ? '1' : '0'
      } else if (this.oneRound.length % 2 === 0) {
        this.serve = this.serve === '0' ? '1' : '0'
      }

      // get serve, point, forehand, backhand
      if (this.$refs.symbol.forehand === '1') {
        this.hand = 'F' + this.$refs.table.prev_placement
      } else if (this.$refs.symbol.backhand === '1') {
        this.hand = 'B' + this.$refs.table.prev_placement
      } else {
        this.hand = '0'
        this.$refs.table.prev_block_part = '0'
      }
      // add score
      if (this.$refs.table.getpoint) {
        this.myPoint++
      } else {
        this.hisPoint++
      }
      this.score = `${this.myPoint}:${this.hisPoint}`
      // record every round
      let perBall = {
        score: this.score,
        serve: this.$refs.table.serve_point ? '1' : this.serve,
        skill: this.$refs.table.serve_point ? 'S' : this.hand,
        part: this.$refs.table.prev_block_part,
        getpoint: this.$refs.table.getpoint ? '1' : '0',
        station: this.$refs.table.station,
        placement: this.$refs.table.placement,
        placement_part: this.$refs.table.block_part.substr(4)
      }
      this.oneRound.push(perBall)
      this.history.push(perBall)
      // change hot zone
      if (perBall.getpoint === '0') {
        let idx = 12 - parseInt(perBall.placement, 10)
        if (this.$refs.table.opacity[idx] < 1) {
          this.$refs.table.opacity[idx] += 0.2
        }
        this.$refs.table.changeHotZone(perBall.station)
      } else {
        let idx = parseInt(perBall.placement, 10) - 1
        if (this.$refs.table.opacity[idx] < 1) {
          this.$refs.table.opacity[idx] += 0.2
        }
        this.$refs.table.changeHotZone(perBall.station)
      }
      // initial drag object's position
      this.$refs.table.initialTouch()
      this.$refs.symbol.removeAllchose()
    },
    deletePreviousHand: function () {
      // init opacity
      let lastHand = this.oneRound[this.oneRound.length - 1]
      if (lastHand.getpoint === '0') {
        let idx = 12 - parseInt(lastHand.placement, 10)
        if (this.$refs.table.opacity[idx] > 0) {
          this.$refs.table.opacity[idx] -= 0.2
        }
        this.$refs.table.changeHotZone(lastHand.station)
      } else {
        let idx = parseInt(lastHand.placement, 10) - 1
        if (this.$refs.table.opacity[idx] > 0) {
          this.$refs.table.opacity[idx] -= 0.2
        }
        this.$refs.table.changeHotZone(lastHand.station)
      }
      // init score
      if (this.oneRound.length === 0) {
        this.myPoint = 0
        this.hisPoint = 0
      } else if (this.oneRound.length === 1) {
        this.oneRound.pop()
        this.myPoint = 0
        this.hisPoint = 0
      } else {
        this.oneRound.pop()
        let score = this.oneRound[this.oneRound.length - 1].score
        this.myPoint = score.split(':')[0]
        this.hisPoint = score.split(':')[1]
      }
      // resume serve side
      if (this.oneRound.length === 0) {
        this.serve = ''
      } else {
        this.serve = this.oneRound[this.oneRound.length - 1].serve
      }
      // delete history
      this.history.pop()
    },
    clearPreviousData: function () {
      // clear previous data
      this.$refs.table.initialTouch()
      this.$refs.symbol.removeAllchose()
      this.oneRound = []
      this.allRounds = []
      this.history = []
      this.isWhite = true
      this.game = ''
      this.name1 = ''
      this.name2 = ''
      this.NumOfBoard = ''
      this.winRound = 0
      this.loseRound = 0
    },
    endRound: function () {
      // check this round is win or not
      this.myPoint > this.hisPoint ? this.winRound++ : this.loseRound++
      this.allRounds.push({no: this.allRounds.length + 1, round: this.oneRound})
      // clear previous data
      this.$refs.table.initialTouch()
      this.$refs.symbol.removeAllchose()
      this.oneRound = []
      this.$refs.table.drawLine = false
      // init table color
      this.$refs.table.changeColor()
      this.myPoint = 0
      this.hisPoint = 0
    },
    sendData: function () {
      // alert
      let check = confirm('確定要送出嗎？')
      let currentDate = new Date()
      let year = currentDate.getFullYear()
      let month = currentDate.getMonth()
      let date = currentDate.getDate()
      let hour = currentDate.getHours()
      let min = currentDate.getMinutes()
      if (check === true) {
        let insertData = {
          name: this.name1,
          isWin: this.winRound > this.loseRound,
          game: this.game,
          detail: {
            result: this.winRound > this.loseRound ? 'win' : 'lose',
            scores: `${this.winRound}:${this.loseRound}`,
            date: `${year}/${month}/${date} ${hour}:${min}`,
            NumOfBoard: this.NumOfBoard[this.NumOfBoard.length - 1],
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
        this.myPoint = 0
        this.hisPoint = 0
        // reset table to green
        for (let i = 1; i <= 12; i++) {
          document.getElementById(`group${i}`).style.background = 'green'
        }
      } else {
        console.log('no send')
      }
      this.$refs.table.drawLine = false
    },
    saveName: function () {
      this.isWhite = false
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
#lostPoint {
  background-image:url("../assets/lostpoint.png");
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
}
#servePoint {
  width: 40px;
  height: 40px;
  background-image: url("../assets/serve_point.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
}
#getPoint {
  background-image:url("../assets/getpoint.png");
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
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
#btn2, #btn3, #btn4, #btn5 {
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
#name1 ,#name2 {
  margin-top: 3%;
  height: 15px;
  width: 60px;
  padding: 5px;
}

#game {
  margin-top: 3%;
  height: 15px;
  width: 200px;
  padding: 5px;
}

#Name1, #Name2 {
  margin-top: 3%;
  height: 15px;
  width: 65px;
  padding: 5px;
}
#Game {
  margin-top: 3%;
  height: 15px;
  width: 250px;
  padding: 5px;
}
#Date {
  margin-top: 3%;
  height: 15px;
  width: 120px;
  padding: 5px;
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
</style>
