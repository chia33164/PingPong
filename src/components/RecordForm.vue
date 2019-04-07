<template>
  <div id="app">
    <div id="list">
      <div id="title" v-if="isWhite">
        <input type="text" v-model="name1" id="name1" placeholder="我方">
        <input type="text" v-model="name2" id="name2" placeholder="對方">
        <input type="text" v-model="game" id="game" placeholder="Game">
        <input type="date" v-model="date" id= "date">
        <input type="button" @click="saveName" value="click" id="btn">
      </div>
      <div id="title" v-else>
        <p id="Name1">{{this.name1}}</p>
        <p id="Name2">{{this.name2}}</p>
        <p id="Game">{{this.game}}</p>
        <p id="Date">{{this.date}}</p>
      </div>
      <div>
        <div class="record">比分</div>
        <div class="record">發球方</div>
        <div class="record">擊球技術</div>
        <div class="record">得分落點</div>
      </div>
      <div>
        <lists v-for="(item, index) in list" :index="index" :key="index" :item="item"></lists>
      </div>
    </div>
    <drag id="table" ref="table"></drag>
    <div>
      <sym ref="symbol"></sym>
      <br>
      <br>
      <div class="dragBlock">
        <img src="../assets/serve_point.png" width="40" height="40" id="servePoint">
      </div>
      <div class="dragBlock">
        <img src="../assets/getpoint.png" width="40" height="40" id="getPoint">
      </div>
      <div class="dragBlock">
        <img src="../assets/lostpoint.png" width="40" height="40" id="lostPoint">
      </div>
      <br>
      <div class="btn_container">
        <button id="btn1" type='button' @click='getData'> update </button>
        <button id="btn2" type='button' @click='Del_prev'> Delete </button>
        <button id="btn3" type='button' @click='addPlayers'> finish </button>
      </div>
    </div>
  </div>
</template>

<script>
import sym from './recordForm/symbol'
import drag from './recordForm/drag_object'
import lists from './recordForm/list_Item'
import {db} from '../db'

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
      list: [],
      players: [],
      name1: '',
      name2: '',
      game: '',
      date: '',
      win: 0,
      lose: 0,
      result: '',
      score: '',
      x: 0,
      y: 0,
      isWhite: true
    }
  },
  firestore () {
    return {
      players: db.collection('players')
    }
  },
  methods: {
    getData: function () {
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
        this.win++
      } else {
        this.lose++
      }
      this.score = `${this.win}:${this.lose}`
      // record every round
      let perRound = {
        score: this.score,
        serve: this.$refs.table.serve_point ? '1' : this.serve,
        skill: this.$refs.table.serve_point ? 'S' : this.hand,
        part: this.$refs.table.block_part.substr(4),
        getpoint: this.$refs.table.getpoint ? '1' : '0',
        station: this.$refs.table.station,
        pos: this.$refs.table.table_position,
        pos_part: this.$refs.table.prev_block_part
      }
      console.log(perRound)
      this.list.push(perRound)
      // initial drag object's position
      this.$refs.table.initialTouch()
      this.$refs.symbol.removeAllchose()
    },
    Del_prev: function () {
      if (this.list.length === 0) {
        this.win = 0
        this.lose = 0
      } else if (this.list.length === 1) {
        this.list.pop()
        this.win = 0
        this.lose = 0
      } else {
        this.list.pop()
        let score = this.list[this.list.length - 1].score
        this.win = score.split(':')[0]
        this.lose = score.split(':')[1]
      }
    },
    clear_prev_data: function () {
      // clear previous data
      this.$refs.table.initialTouch()
      this.$refs.symbol.removeAllchose()
      this.list = []
      this.isWhite = true
      this.game = ''
      this.name1 = ''
      this.name2 = ''
      this.date = ''
    },
    addPlayers: function () {
      // alert
      let check = confirm('確定要送出嗎？')
      if (check === true) {
        // check whether exist the player before
        let isExist = false
        let i = 0
        for (; i < this.players.length; i++) {
          if (this.name1 === this.players[i].id) {
            isExist = true
            break
          }
        }
        // add data into firebase
        if (isExist) {
          // check win or not
          let isWin = this.win > this.lose
          if (isWin) {
            this.players[i].win++
          } else {
            this.players[i].lose++
          }
          // add
          db.collection('players').doc(`${this.name1}`)
            .update({
              win: this.players[i].win,
              lose: this.players[i].lose
            })
            .then(() => {
              db.collection('players').doc(`${this.name1}`).collection('games').doc(`${this.game}`)
                .set({
                  result: this.win > this.lose ? 'win' : 'lose',
                  scores: this.score,
                  date: this.date,
                  competitor: this.name2,
                  rounds: this.list
                })
                .then(() => {
                  this.clear_prev_data()
                })
            })
        } else {
          let isWin = this.win > this.lose
          if (isWin) {
            this.win = 1
            this.lose = 0
          } else {
            this.win = 0
            this.lose = 1
          }
          db.collection('players').doc(`${this.name1}`)
            .set({
              win: this.win,
              lose: this.lose
            })
            .then(() => {
              db.collection('players').doc(`${this.name1}`).collection('games').doc(`${this.game}`)
                .set({
                  result: this.win > this.lose ? 'win' : 'lose',
                  scores: this.score,
                  date: this.date,
                  competitor: this.name2,
                  rounds: this.list
                })
                .then(() => {
                  this.clear_prev_data()
                })
            })
        }
        // init table color
        for (i = 1; i < 13; i++) {
          document.getElementById(`group${i}`).style.backgroundColor = 'green'
        }
      } else {
        console.log('no send')
      }
      // reset table to green
      for (let i = 1; i <= 12; i++) {
        document.getElementById(`group${i}`).style.background = 'green'
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
  margin-top: 18px;
  width: 80px;
  height: 80px;
}
#btn2 {
  width: 80px;
  height: 80px;
  padding: 10px;
}
#btn3 {
  width: 80px;
  height: 80px;
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
#date {
  margin-top: 3%;
  height: 15px;
  width: 120px;
  padding: 5px;
}
#Name1, #Name2 ,#Game {
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
