<template>
    <div id="Statistic">
        <div id="Score">
            <ve-line :data="chartData" :extend="extend" :settings="chartSettings"></ve-line>
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
      stopTimes: '',
      prevStatus: null,
      extend: {
        series: {
          label: {
            normal: {
              show: true
            }
          },
          smooth: false
        }
      },
      chartSettings: {
        xAxisName: ['球數'],
        yAxisName: ['得分']
      },
      chartData: {
        columns: ['球數', '我方', '對方'],
        rows: [
          {'球數': '1', '我方': 1, '對方': 0},
          {'球數': '2', '我方': 2, '對方': 0},
          {'球數': '3', '我方': 2, '對方': 1},
          {'球數': '4', '我方': 2, '對方': 2},
          {'球數': '5', '我方': 3, '對方': 2},
          {'球數': '6', '我方': 3, '對方': 3},
          {'球數': '7', '我方': 4, '對方': 3},
          {'球數': '8', '我方': 5, '對方': 3},
          {'球數': '9', '我方': 6, '對方': 3},
          {'球數': '10', '我方': 7, '對方': 3},
          {'球數': '11', '我方': 7, '對方': 4},
          {'球數': '12', '我方': 7, '對方': 5}
        ]
      }
    }
  },
  methods: {
    load: function (prevStatus) {
      // localStorage.setItem('status', null)
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
  watch: {
    prevStatus: function (newStatus) {
      this.load(newStatus)
    }
  },
  mounted () {
    this.prevStatus = JSON.parse(localStorage.getItem('status'))
  }
}
</script>

<style scoped>
</style>