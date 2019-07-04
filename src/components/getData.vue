<template>
  <div id="databoard">
    <div id=select>
      <div id="selectName">
        <b-form-select v-model="name" :options="option1" @click="showPlayer=false, showGame=false, showBtn=false" @change="FindByName">
          <template slot="first">
            <option :value="''" disabled>選手</option>
          </template>
        </b-form-select>
      </div>
      <br>
      <div id="selectGame">
        <b-form-select v-model="game" :options="option2" @click="showGame=false, showBtn=false" @change="FindByGame">
          <template slot="first">
            <option :value="''" disabled>比賽</option>
          </template>
        </b-form-select>
      </div>
      <br>
      <div id="selectRound">
        <b-form-select v-model="round" :options="option3" @click="showBtn=false" @change="DrawHotZone(round)">
          <template slot="first">
            <option :value="''" disabled>局</option>
          </template>
        </b-form-select>
      </div>
      <div>
        <button id="historyBtn" @click='showHistory = true' v-if="showBtn"> 回放 </button>
      </div>
    </div>
    <div id="hotZone">
      <svg class="table_container" width="450" height="600">
        <g>
          <Block ref="block1" id="group1" x='0' y='0'></Block>
          <Block ref="block2" id="group2" x='150' y='0'></Block>
          <Block ref="block3" id="group3" x='300' y='0'></Block>
          <Block ref="overlap1" id="overlap1" x='0' y='0'></Block>
          <Block ref="overlap2" id="overlap2" x='150' y='0'></Block>
          <Block ref="overlap3" id="overlap3" x='300' y='0'></Block>
        </g>
        <g>
          <Block ref="block4" id="group4" x='0' y='150'></Block>
          <Block ref="block5" id="group5" x='150' y='150'></Block>
          <Block ref="block6" id="group6" x='300' y='150'></Block>
          <Block ref="overlap4" id="overlap4" x='0' y='150'></Block>
          <Block ref="overlap5" id="overlap5" x='150' y='150'></Block>
          <Block ref="overlap6" id="overlap6" x='300' y='150'></Block>
        </g>
        <g>
          <Block ref="block7" id="group7" x='0' y='300'></Block>
          <Block ref="block8" id="group8" x='150' y='300'></Block>
          <Block ref="block9" id="group9" x='300' y='300'></Block>
          <Block ref="overlap7" id="overlap7" x='0' y='300'></Block>
          <Block ref="overlap8" id="overlap8" x='150' y='300'></Block>
          <Block ref="overlap9" id="overlap9" x='300' y='300'></Block>
        </g>
        <g>
          <Block ref="block10" id="group10" x='0' y='450'></Block>
          <Block ref="block11" id="group11" x='150' y='450'></Block>
          <Block ref="block12" id="group12" x='300' y='450'></Block>
          <Block ref="overlap10" id="overlap10" x='0' y='450'></Block>
          <Block ref="overlap11" id="overlap11" x='150' y='450'></Block>
          <Block ref="overlap12" id="overlap12" x='300' y='450'></Block>
        </g>
        <image xlink:href="../assets/person.png" x=0 y=560 width="40px" height="40px"/>
      </svg>
    </div>
    <div id="info">
      <div>
        <h1> 選手訊息 </h1>
      </div>
      <div v-if="showPlayer">
        <h1> {{this.name}} </h1>
        <li> win   : {{this.win}}</li>
        <li> lose  : {{this.lose}}</li>
      </div>
      <div v-if="showGame">
        <h1> {{this.game}}</h1>
        <li> result: {{this.result}}</li>
        <li> score : {{this.score}}</li>
        <li> competitor : {{this.competitor}}</li>
        <li> date : {{this.date}}</li>
      </div>
    </div>
    <History :showList="history" v-if='showHistory' @close='showHistory = false'></History>
  </div>
</template>

<script>
import {db} from '../db.js'
import Block from './recordForm/perBlock'
import History from './recordForm/showHistory'

export default {
  components: {
    Block,
    History
  },
  data: function () {
    return {
      players: [],
      games: [],
      rounds: [],
      name: '',
      game: '',
      round: '',
      win: '',
      lose: '',
      result: '',
      score: '',
      date: '',
      competitor: '',
      opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      station: false, // bottom: false  top: true
      showPlayer: false,
      showGame: false,
      showHistory: false,
      showBtn: false,
      history: [],
      option1: [],
      option2: [],
      option3: []
    }
  },
  firestore: {
    players: db.collection('players')
  },
  methods: {
    FindByName: function () {
      this.$store.dispatch('getDataByName', this.name).then(res => {
        this.win = res.win
        this.lose = res.lose
        this.games = res.games
        this.showPlayer = true
        // set select list
        this.SetOption(2)
        // init game
        this.game = ''
        // init round
        this.round = ''
      })
    },
    FindByGame: function () {
      // clear data
      this.$store.dispatch('getDataByGame', {name: this.name, game: this.game}).then(res => {
        this.result = res.result
        this.rounds = res.rounds
        this.score = res.scores
        this.date = res.date
        this.competitor = res.competitor
        // set select list
        this.SetOption(3)
        // draw hot zone for game
        this.DrawHotZone(0)
        // append data to web
        this.showGame = true
        // init round
        this.round = ''
      })
    },
    DrawHotZone: function (no) {
      this.showHotZone = true
      // draw hotzone for game
      if (no === 0) {
        this.rounds.forEach(everyRound => {
          everyRound.round.forEach(everyHand => {
            this.station = everyHand.station === 'top'
            // accumulate placement time
            if (this.station) {
              if (everyHand.getpoint === '1') {
                this.opacity[everyHand.placement - 1] += 1
              } else {
                this.opacity[12 - everyHand.placement] += 1
              }
            } else {
              if (everyHand.getpoint === '1') {
                this.opacity[everyHand.placement - 1] += 1
              } else {
                this.opacity[12 - everyHand.placement] += 1
              }
            }
          })
        })
      } else {
        let rounds = this.rounds[no - 1].round
        rounds.forEach(element => {
          this.station = element.station === 'top'
          // accumulate placement time
          if (this.station) {
            if (element.getpoint === '1') {
              this.opacity[element.placement - 1] += 1
            } else {
              this.opacity[12 - element.placement] += 1
            }
          } else {
            if (element.getpoint === '1') {
              this.opacity[element.placement - 1] += 1
            } else {
              this.opacity[12 - element.placement] += 1
            }
          }
        })
        this.history = rounds
        this.showBtn = true
      }
      let topHalf = 0
      let bottomHalf = 0
      for (let i = 0; i < 6; i++) {
        topHalf += this.opacity[i]
        bottomHalf += this.opacity[i + 6]
      }
      for (let i = 0; i < 6; i++) {
        if (topHalf !== 0) this.opacity[i] /= topHalf
        if (bottomHalf !== 0) this.opacity[i + 6] /= bottomHalf
      }

      this.$refs.overlap1.color = 'green'
      this.$refs.overlap2.color = 'green'
      this.$refs.overlap3.color = 'green'
      this.$refs.overlap4.color = 'green'
      this.$refs.overlap5.color = 'green'
      this.$refs.overlap6.color = 'green'
      this.$refs.overlap7.color = 'red'
      this.$refs.overlap8.color = 'red'
      this.$refs.overlap9.color = 'red'
      this.$refs.overlap10.color = 'red'
      this.$refs.overlap11.color = 'red'
      this.$refs.overlap12.color = 'red'
      this.$refs.overlap1.opacity = this.opacity[0]
      this.$refs.overlap2.opacity = this.opacity[1]
      this.$refs.overlap3.opacity = this.opacity[2]
      this.$refs.overlap4.opacity = this.opacity[3]
      this.$refs.overlap5.opacity = this.opacity[4]
      this.$refs.overlap6.opacity = this.opacity[5]
      this.$refs.overlap7.opacity = this.opacity[6]
      this.$refs.overlap8.opacity = this.opacity[7]
      this.$refs.overlap9.opacity = this.opacity[8]
      this.$refs.overlap10.opacity = this.opacity[9]
      this.$refs.overlap11.opacity = this.opacity[10]
      this.$refs.overlap12.opacity = this.opacity[11]
      this.opacity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    SetOption: async function (mode) {
      // mode
      // 1 for option1
      // 2 for option2
      // 3 for option3
      switch (mode) {
        case 1:
          let players = await this.$store.dispatch('getPlayers')
          this.option1 = players.map((data) => {
            let obj = {}
            obj['value'] = data
            obj['text'] = data
            return obj
          })
          break
        case 2:
          this.option2 = this.games.map((data) => {
            let obj = {}
            obj['value'] = data.id
            obj['text'] = data.id
            return obj
          })
          break
        case 3:
          this.option3 = this.rounds.map((data) => {
            let obj = {}
            obj['value'] = data.no
            obj['text'] = data.no
            return obj
          })
          break
        default:
          break
      }
    },
    test: function () {
      console.log(123)
    }
  },
  async mounted () {
    this.SetOption(1)
  }
}
</script>
<style>
#databoard {
  display: flex;
  flex-direction: row;
}

#hotZone {
  padding: 10px;
  position: relative;
  top: 5%;
  left: 5%;
}

#select {
  padding: 10px;
  position: relative;
  width: 15%;
  height: 10%;
  top: 5%;
  left: 2%;
}

.btn {
  height: 25px;
  width: 50px;
}

.select {
  height: 25px;
  width: 80px;
}

#info {
  position: relative;
  width: 300px;
  height: 100%;
  left: 8%;
  padding: 10px;
}

</style>
