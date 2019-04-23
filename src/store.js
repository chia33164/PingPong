import Vue from 'vue'
import Vuex from 'vuex'
import {db} from './db'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    players: []
  },
  actions: {
    insertData (context, data) {
      return new Promise((resolve, reject) => {
        db.collection('players').doc(`${data.name}`).get().then(res => {
          // check whether the player exists or not
          if (res.exists) {
            let win = res.data().win
            let lose = res.data().lose
            data.isWin ? win++ : lose++
            // update win:lose
            return db.collection('players').doc(`${data.name}`).update({win: win, lose: lose})
          } else {
            let win = 0
            let lose = 0
            data.isWin ? win++ : lose++
            // update win:lose
            return db.collection('players').doc(`${data.name}`).set({win: win, lose: lose})
          }
        }).then(() => {
          // insert game's detail into firebase datbase
          return db.collection('players').doc(`${data.name}`).collection('games').doc(`${data.game}`).set(data.detail)
        }).then(() => {
          resolve()
        })
      })
    },
    getDataByName (context, name) {
      return new Promise((resolve, reject) => {
        let result
        db.collection('players').doc(`${name}`).get().then((res) => {
          result = {
            win: res.data().win,
            lose: res.data().lose
          }
          return db.collection('players').doc(`${name}`).collection('games').get()
        }).then(res => {
          // console.log(res.docs[0])
          result['games'] = res.docs
          resolve(result)
        })
      })
    },
    getDataByGame (context, data) {
      return new Promise((resolve, reject) => {
        db.collection('players').doc(`${data.name}`).collection('games').doc(`${data.game}`).get().then(res => {
          resolve(res.data())
        })
      })
    },
    getPlayerBalls (context, name) {
      return new Promise((resolve, reject) => {
        db.collection('players').doc(`${name}`).collection('games').get().then(res => {
          let promiseGames = []
          // push pending object into promiseGames for get games' information
          res.docs.forEach(el => {
            promiseGames.push(db.collection('players').doc(`${name}`).collection('games').doc(`${el.id}`).get())
          })
          return Promise.all(promiseGames)
        }).then(res => {
          let Balls = []
          res.forEach(round1 => {
            // get attribute "rounds"
            round1.data().rounds.forEach(round2 => {
              // get attribute "round"
              round2.round.forEach(perBall => {
                // get every balls
                Balls.push(perBall)
              })
            })
          })
          console.log(Balls)
        })
      })
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
