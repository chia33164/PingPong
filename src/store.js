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
    },
    getParsedData (context) {
      return new Promise((resolve, reject) => {
        let token = 'XF35F55B50SXF35F55B20SYF36B62B22F22B21F12F22F23B32B22B23B33B32B23B32B22F20SYF35F55SXF35F54F45F55F55F52B23F33B30SXF34F45F53F31F12F22B23B30SYF34F41F12SYF32F23B33SXF34B43B33B30SXF34F45B55F54F40SYF335B55B50SYF34B43B30SXF34F45F51F11SXF35F55B53F32F22F22B23B30SYF35B54F45F52B20SYF35B53SXF35F55B53B33B30SXF34B40SGYF36B62B22B20SYF34F45F55F55F52F23B33SXF34F45F53B32B23B30SXF34B42F22B21F10SYF35B52B21F12B23B33B32B23B32F23B32B22F20SYF25F54F41F13B31F11F12B22B21F13B32F21F10SXF35B52F20SXF34B43B32B21F13F31F10SYF36B64F42B22B20SYF35B53B32B22F21F13B32B23B33F33B32F22B21F12B23B32B23B32B21F13F33B32F23B31F12B23B32F20SXF33F30SXF34B41F10SYF34B41F10SYF34F43F33B30SXF34F45B55B50SXF34F43B32B22B23B30SYF33B33SYF34F45F54B45B50SXF33B30SGXF34B41F13B32F23B31XF34B43B33B30SYF35B54F45B53B33B33B32B20SYF4B44F42F23B31SXF34F45B52F21F12F22B23B32B23F32F22F20SXF34B45B55B55F53B30SYF34F43B32B23B32F20SYF33B34F42B20SXF34B45B52F23F32B20SXF34F45F55F52F21F10SYF34F42B21F12F21F10SYF32B22F20SXF34F44F45F52B23B30SXF34F44F55F50SYF34F40SYF34B44F42B20SXF36B65F52B21F13B31F11F10SXF34F45F51F12B22B23B33B32F23B32B23F31F11F13B33YF32B23B30SGYF34B45F50SYF32B21F11F12B22F23B33B32F22F23B30SXF3XF35F50SXF34F45F55F55B55B50SYF35B55B51F10SYB25F54F41F12F22B23B32B23B30SXF44B41F10SXF35F55B54F40SYF36B60SYF34B42F20SXF34B43SXF36B60SYF35B53B31F10SYF36B65B52F21F10SXF34B41F13B30SXF34F45F54F40SGM'
        // let token = 'XF35F54F45F55F52B20SXF34B45F50SYF34F45F55F55SYF35B53F31SXF35F56B63F30SXF34F46B63F30SYF32B22B22F23B30SYF35F54F45F52F21F10SXF35F54F40SXF35F55B52F21F10SYF34B43B32B23F31F12F21F12F22F23F30SYF34F44F45F52B23B33F32B21SXF32F22B20SXF34F44F41F10SYF36B61F10SYF34B43B32B22F23B33B32B20SXF36F65B53F33B30SXF34B42B20SYF34F45F51B10SYF34F45B55F52F20SXF34F42F22SYF34F45F50SG'
        // let token = 'YF35SG'
        let pattern = /(?:[XY]|[FB][0-6]{2}|[SGM])/g
        let result = token.match(pattern)
        resolve(result)
      })
    },
    async getPlayers (context) {
      let res = await db.collection('players').get()
      let players = res.docs.map((data) => {
        return data.id
      })
      return players
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
