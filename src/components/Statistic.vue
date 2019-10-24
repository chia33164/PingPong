<template>
  <div id="Statistic">
    <div id="Score">
      <ve-line :data="lineData" :extend="lineExtend" :settings="lineSettings"></ve-line>
    </div>
    <div id="Skill">
      <ve-pie :data="ringData" :extend="ringExtend" :settings="ringSettings"></ve-pie>
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
      lineExtend: {
        series: {
          label: {
            normal: {
              show: true
            }
          },
          smooth: false
        }
      },
      lineSettings: {
        xAxisName: ['球數'],
        yAxisName: ['得分']
      },
      lineData: {
        columns: ['球數', '我方', '對方'],
        rows: []
      },
      ringExtend: {
        series (v) {
          v.forEach((item, idx) => {
            item.radius = [50 * idx, 50 * (idx + 1)]
          })
          return v
        },
        'series.1.labelLine.length': 80,
        'series.2.labelLine.length': 0
      },
      ringSettings: {
        level: [
          ['Serve'],
          ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
          ['Place1', 'Place2', 'Place3', 'Place4', 'Place5', 'Place6']
        ],
        label: {
          normal: {
            show: false
          }
        }
      },
      ringData: {
        columns: ['項目', '數量'],
        rows: [
          { '項目': 'Serve', '數量': 0 },
          { '項目': 'F1', '數量': 0 },
          { '項目': 'F2', '數量': 0 },
          { '項目': 'F3', '數量': 0 },
          { '項目': 'F4', '數量': 0 },
          { '項目': 'F5', '數量': 0 },
          { '項目': 'F6', '數量': 0 },
          { '項目': 'B1', '數量': 0 },
          { '項目': 'B2', '數量': 0 },
          { '項目': 'B3', '數量': 0 },
          { '項目': 'B4', '數量': 0 },
          { '項目': 'B5', '數量': 0 },
          { '項目': 'B6', '數量': 0 },
          { '項目': 'Place1', '數量': 0 },
          { '項目': 'Place2', '數量': 0 },
          { '項目': 'Place3', '數量': 0 },
          { '項目': 'Place4', '數量': 0 },
          { '項目': 'Place5', '數量': 0 },
          { '項目': 'Place6', '數量': 0 }
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
      this.setLineDate()
      this.setRingData()
    },
    setLineDate: function () {
      let myScore = 0
      let hisScore = 0
      this.oneRound.forEach((item, idx) => {
        if (item.getpoint) {
          myScore++
        } else {
          hisScore++
        }
        this.lineData.rows.push({
          '球數': String(idx + 1),
          '我方': myScore,
          '對方': hisScore
        })
      })
    },
    setRingData: function () {
      let skillF = [0, 0, 0, 0, 0, 0]
      let skillB = [0, 0, 0, 0, 0, 0]
      let place = [0, 0, 0, 0, 0, 0]
      let serve = 0
      this.oneRound.forEach(item => {
        if (item.getpoint) {
          switch (item.skill) {
            case 'F1':
              skillF[0]++
              break
            case 'F2':
              skillF[1]++
              break
            case 'F3':
              skillF[2]++
              break
            case 'F4':
              skillF[3]++
              break
            case 'F5':
              skillF[4]++
              break
            case 'F6':
              skillF[5]++
              break
            case 'B1':
              skillB[0]++
              break
            case 'B2':
              skillB[1]++
              break
            case 'B3':
              skillB[2]++
              break
            case 'B4':
              skillB[3]++
              break
            case 'B5':
              skillB[4]++
              break
            case 'B6':
              skillB[5]++
              break
            case 'S':
              serve++
              break
            default:
              break
          }
          switch (item.placement) {
            case '1':
              place[0]++
              break
            case '2':
              place[1]++
              break
            case '3':
              place[2]++
              break
            case '4':
              place[3]++
              break
            case '5':
              place[4]++
              break
            case '6':
              place[5]++
              break
            default:
              break
          }
        }
      })
      this.ringData.rows.forEach(data => {
        if (data['項目'].split('F')[1] !== undefined) {
          data['數量'] = skillF[Number(data['項目'].split('F')[1]) - 1]
        } else if (data['項目'].split('B')[1] !== undefined) {
          data['數量'] = skillB[Number(data['項目'].split('B')[1]) - 1]
        } else if (data['項目'].split('Place')[1] !== undefined) {
          data['數量'] = place[Number(data['項目'].split('Place')[1]) - 1]
        } else {
          data['數量'] = serve
        }
      })
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