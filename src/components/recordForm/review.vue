<template>
  <div id="history">
    <transition name="modal">
      <div id="review" v-if="isOpen">
        <div class="overlay" @click.self="isOpen=false">
          <div class="add">
            <main>
              <div>第 {{this.idx + 1}} 場</div>
              <svg class="review_container" width="450" height="600">
                <g>
                  <Block ref="overlap1" x='0' y='0'></Block>
                  <Block ref="overlap2" x='150' y='0'></Block>
                  <Block ref="overlap3" x='300' y='0'></Block>
                </g>
                <g>
                  <Block ref="overlap4" x='0' y='150'></Block>
                  <Block ref="overlap5" x='150' y='150'></Block>
                  <Block ref="overlap6" x='300' y='150'></Block>
                </g>
                <g>
                  <Block ref="overlap7" x='0' y='300'></Block>
                  <Block ref="overlap8" x='150' y='300'></Block>
                  <Block ref="overlap9" x='300' y='300'></Block>
                </g>
                <g>
                  <Block ref="overlap10" x='0' y='450'></Block>
                  <Block ref="overlap11" x='150' y='450'></Block>
                  <Block ref="overlap12" x='300' y='450'></Block>
                </g>
                <line x1='0' y1='300' x2='450' y2='300' stroke-width="4" stroke='red'/>
                <image xlink:href="../../assets/person.png" x=0 y=0 width="40px" height="40px" v-show="station"/>
                <image xlink:href="../../assets/person.png" x=0 y=560 width="40px" height="40px" v-show="!station"/>
              </svg>
            </main>
            <footer>
              <button class="reviewBtn" @click="start" v-if="!isStart"> start </button>
              <button class="reviewBtn" @click="prevRound" v-if="isStart"> previous </button>
              <button class="reviewBtn" @click="nextRound" v-if="isStart"> next </button>
            </footer>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Block from './perBlock'

export default {
  props: ['data'],
  name: 'history',
  components: {
    Block
  },
  data () {
    return {
      isOpen: false,
      isStart: false,
      station: null,
      opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      idx: 0
    }
  },
  methods: {
    start: function () {
      this.isStart = true
      this.DrawHotZone(0)
    },
    prevRound: function () {
      if (this.idx > 0) {
        this.idx--
        this.DrawHotZone(this.idx)
      }
    },
    nextRound: function () {
      if (this.data.length - 1 > this.idx) {
        this.idx++
        this.DrawHotZone(this.idx)
      }
    },
    DrawHotZone: function (no) {
      // draw hotzone for game
      this.station = this.data[no].round[0].station === 'top'
      this.opacity = JSON.parse('[' + this.data[no].round[this.data[no].round.length - 1].opacity + ']')

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

      for (let item in this.$refs) {
        let idx = Object.keys(this.$refs).indexOf(item)
        if (this.station) {
          // swap overlap's color according to player's station
          this.$refs[item].color = (idx <= 5) ? 'red' : 'green'
        } else {
          // swap overlap's color according to player's station
          this.$refs[item].color = (idx <= 5) ? 'green' : 'red'
        }
        // swap overlap's opacity according to player's station
        this.$refs[item].opacity = this.opacity[idx]
      }

      this.opacity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }
}
</script>

<style>

.add {
  height: 95%;
  width: 50%;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
}

.fadeIn-enter {
    opacity: 0;
}

.fadeIn-leave-active {
    opacity: 0;
    transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
    transform: scale(1.1);
}

.reviewBtn {
  padding: 7px;
  margin-top: 10px;
  background-color: white;
  color: #6ab7fe;
  font-size: 1.1rem;
  border: 1px solid #6ab7fe;
  border-radius: 10px;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #00000094;
    z-index: 999;
    transition: opacity 0.2s ease;
}

.hide {
  opacity: 0;
}



</style>
