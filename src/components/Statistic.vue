<template>
    <div id="Statistic">
        <div id="Score">
            <h1>Score Part</h1>
        </div>
        <div id="Skill">
            <h1>Skill Part</h1>
        </div>
    </div>
</template>

<script>
export default {
  name: 'statistic',
  data () {
    return {
      serve: '',
      name1: '',
      name2: '',
      game: '',
      station: '',
      oneRound: '',
      allRounds: '',
      history: '',
      roundScore: '',
      currentScore: '',
      NumOfBoard: '',
      inputData: '',
      stopTimes: ''
    }
  },
  methods: {
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
    }
  },
  mounted () {
    let prevStatus = JSON.parse(localStorage.getItem('status'))
    if (!prevStatus === null) {
      this.load(prevStatus)
    } else {
      alert('Nothing')
    }
  }
}
</script>

<style scoped>
</style>