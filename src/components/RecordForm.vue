<template>
  <div id="app">
    <div id="list">
      <div id="title" v-if="isWhite">
        <input type="text" v-model="name1" id="name1" placeholder="我方">
        <input type="text" v-model="name2" id="name2" placeholder="對方">
        <input type="text" v-model="game" id="game" placeholder="Game">
        <input type="text" v-model="NumOfBoard" id="NumOfBoard" placeholder="總局數">
        <input type="button" @click="saveName" value="click" id="btn">
      </div>
      <div id="title" v-else>
        <p id="Name1">{{this.name1}}</p>
        <p id="Name2">{{this.name2}}</p>
        <p id="Game">{{this.game}}</p>
        <p id="NumOfBoard">{{this.NumOfBoard}}</p>
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
      <br>
      <div class="btn_container">
        <button id="btn1" type='button' @click='oneHand'> update </button>
        <button id="btn2" type='button' @click='deletePreviousHand'> Delete </button>
        <button id="btn3" type='button' @click='endRound'> finish </button>
        <button id="btn4" type='button' @click='sendData'> store </button>
      </div>
    </div>
  </div>
</template>

<script>
import sym from './recordForm/symbol'
import drag from './recordForm/drag_object'
import lists from './recordForm/list_Item'

export default {
  components: {
    sym,
    drag,
    lists
  },
  data: function () {
    return {
      serve: '',
      point: '',
      hand: '',
      part: '',
      oneRound: [],
      allRounds: [],
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
      NumOfBoard: ''
    }
  },
  methods: {
    oneHand: function () {
      if (this.$refs.table.presslong) {
        // reset presslong
        this.$refs.table.presslong = false
        this.$refs.table.drawLine = false
      }
      // get serve, point, forehand, backhand
      this.serve = this.$refs.symbol.serve
      if (this.$refs.symbol.forehand === '1') {
        this.hand = 'F' + this.$refs.table.prev_table_position
      } else if (this.$refs.symbol.backhand === '1') {
        this.hand = 'B' + this.$refs.table.prev_table_position
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
        part: this.$refs.table.block_part.substr(4),
        getpoint: this.$refs.table.getpoint ? '1' : '0',
        station: this.$refs.table.station,
        pos: this.$refs.table.table_position,
        pos_part: this.$refs.table.prev_block_part
      }
      // console.log(perBall)
      this.oneRound.push(perBall)
      // initial drag object's position
      this.$refs.table.initialTouch()
      this.$refs.symbol.removeAllchose()
    },
    deletePreviousHand: function () {
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
    },
    clearPreviousData: function () {
      // clear previous data
      this.$refs.table.initialTouch()
      this.$refs.symbol.removeAllchose()
      this.oneRound = []
      this.allRounds = []
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
      this.allRounds.push({round: this.oneRound})
      // clear previous data
      this.$refs.table.initialTouch()
      this.$refs.symbol.removeAllchose()
      this.oneRound = []
      // init table color
      this.$refs.table.changeColor()
      this.myPoint = 0
      this.hisPoint = 0
    },
    sendData: function () {
      // alert
      let check = confirm('確定要送出嗎？')
      if (check === true) {
        let insertData = {
          name: this.name1,
          isWin: this.winRound > this.loseRound,
          game: this.game,
          detail: {
            result: this.winRound > this.loseRound ? 'win' : 'lose',
            scores: `${this.winRound}:${this.loseRound}`,
            date: new Date(),
            NumOfBoard: this.NumOfBoard,
            competitor: this.name2,
            rounds: this.allRounds
          }
        }
        // insert game's data
        this.$store.dispatch('insertData', insertData).then(() => {
          this.clearPreviousData()
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
    },
    saveName: function () {
      this.isWhite = false
    }
  }
}
</script>

<style>
#app {
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
  width: 100px;
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
#btn2, #btn3, #btn4 {
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
#name1 ,#name2 ,#game {
  margin-top: 3%;
  height: 15px;
  width: 60px;
  padding: 5px;
}

#Name1, #Name2 ,#Game, #NumOfBoard {
  margin-top: 3%;
  height: 15px;
  width: 60px;
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
