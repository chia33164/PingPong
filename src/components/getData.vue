<template>
  <div id="databoard">
    <div id="selectName">
      <select v-model="name">
        <option disabled value=""> Name </option>
        <option v-for="(item, key, index) in players" :key="index" :value="item.id"> {{item.id}} </option>
      </select>
      <input type="button" @click="FindByName" value="click" id="btn1">
    </div>
    <br>
    <div id="selectGame">
      <select v-model="game">
        <option disabled value=""> Game </option>
        <option v-for="(item, key, index) in games" :key="index"> {{item.id}} </option>
      </select>
      <input type="button" @click="FindByGame" value="click" id="btn2">
    </div>
    <div id="data"></div>
  </div>
</template>

<script>
import {db} from '../db.js'

export default {
  data: function () {
    return {
      players: [],
      games: [],
      rounds: [],
      name: '',
      game: '',
      win: '',
      lose: '',
      result: '',
      score: '',
      date: '',
      competitor: ''
    }
  },
  firestore: {
    players: db.collection('players')
  },
  methods: {
    FindByName: function () {
      db.collection('players').doc(`${this.name}`).get().then((res) => {
        this.win = res.data().win
        this.lose = res.data().lose
      })
      db.collection('players').doc(`${this.name}`).collection('games').get().then((res) => {
        console.log('success')
        this.games = res.docs
      })
    },
    FindByGame: function () {
      // clear data
      document.getElementById('data').innerHTML = ''

      db.collection('players').doc(`${this.name}`).collection('games').doc(`${this.game}`).get().then((res) => {
        this.result = res.data().result
        this.rounds = res.data().rounds
        this.score = res.data().scores
        this.date = res.data().date
        this.competitor = res.data().competitor
        console.log(this.rounds)
        // append data to web
        let html = `
          <h1> ${this.name} </h1>
          <li> win   : ${this.win}</li>
          <li> lose  : ${this.lose}</li>
          <h1> ${this.game}</h1>
          <li> result: ${this.result}</li>
          <li> score : ${this.score}</li>
          <li> competitor : ${this.competitor}</li>
          <li> date : ${this.date}</li>
        `
        document.getElementById('data').innerHTML += html
      })
    }
  }
}
</script>
<style>

</style>
