<template>
  <div id="databoard">
    <div id=select>
      <div id="selectName">
        <select v-model="name" class="select" @click="showPlayer=false, showGame=false, showBtn=false">
          <option disabled value=""> Name </option>
          <option v-for="(item, key, index) in players" :key="index" :value="item.id"> {{item.id}} </option>
        </select>
        <input type="button" @click="FindByName" value="click" class="btn">
      </div>
      <br>
      <div id="selectGame">
        <select v-model="game" class="select" @click="showGame=false, showBtn=false">
          <option disabled value=""> Game </option>
          <option v-for="(item, key, index) in games" :key="index"> {{item.id}} </option>
        </select>
        <input type="button" @click="FindByGame" value="click" class="btn">
      </div>
      <br>
      <div id="selectRound">
        <select v-model="round" class="select" @click="showBtn=false">
          <option disabled value=""> Round </option>
          <option v-for="(item, key, index) in rounds" :key="index"> {{item.no}} </option>
        </select>
        <input type="button" @click="DrawHotZone" value="click" class="btn">
      </div>
      <div>
        <button id="historyBtn" @click='showHistory = true' v-if="showBtn"> 回放 </button>
      </div>
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
        <image xlink:href="../assets/person1.png" x=0 y=560 width="40px" height="40px"/>
      </svg>
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
      history: []
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
        // append data to web
        this.showGame = true
      })
    },
    DrawHotZone: function () {
      this.showHotZone = true
      let rounds = this.rounds[this.round - 1].round
      rounds.forEach(element => {
        this.station = element.station === 'top'
        if (this.station) {
          if (element.getpoint === '1') {
            this.opacity[element.placement - 1] += 0.2
          } else {
            this.opacity[12 - element.placement] += 0.2
          }
        } else {
          if (element.getpoint === '1') {
            this.opacity[element.placement - 1] += 0.2
          } else {
            this.opacity[12 - element.placement] += 0.2
          }
        }
      })
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
      this.history = rounds
      this.showBtn = true
    }
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
  top: 5%;
  left: 8%;
}

</style>
