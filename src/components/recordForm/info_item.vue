<template>
  <div class="info_item_container">
    <transition name="modal">
        <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    <slot name="header">
                      基本資訊
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body">
                        <div>
                            我方 : <input type="text" v-model="name1" id="name1" placeholder="姓名">
                            對方 : <input type="text" v-model="name2" id="name2" placeholder="姓名">
                        </div>
                        <div>
                            比賽 : <input type="text" v-model="game" id="game" placeholder="名稱">
                        </div>
                        <div>
                            <input type="checkbox" id="one" value="1" v-model="NumOfBoard">
                            <label for="one">1 局</label>
                            <input type="checkbox" id="two" value="2" v-model="NumOfBoard">
                            <label for="two">2 局</label>
                            <input type="checkbox" id="three" value="3" v-model="NumOfBoard">
                            <label for="three">3 局</label>
                            <input type="checkbox" id="four" value="4" v-model="NumOfBoard">
                            <label for="four">4 局</label>
                            <input type="checkbox" id="five" value="5" v-model="NumOfBoard">
                            <label for="five">5 局</label>
                            <input type="checkbox" id="six" value="6" v-model="NumOfBoard">
                            <label for="six">6 局</label>
                            <input type="checkbox" id="seven" value="7" v-model="NumOfBoard">
                            <label for="seven">7 局</label>
                        </div>
                        <div>
                            <input type="radio" id="me" value="me" v-model="serve">
                            <label for="me">首局我方發球</label>
                            <input type="radio" id="other" value="other" v-model="serve">
                            <label for="other">首局對方發球</label>
                        </div>
                    </slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        <button class="modal-default-button" @click="$emit('close')"> save </button>
                    </slot>
                </div>
            </div>
        </div>
        </div>
    </transition>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      name1: '',
      name2: '',
      game: '',
      NumOfBoard: [],
      serve: ''
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style>
.showHistory_container {
  display: flex;
  flex-direction: column
}
.list_container > div {
  display: flex;
  flex-direction: row;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 450px;
  margin: 0px auto;
  padding: 5px 5px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 5px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>