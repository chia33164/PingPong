<template>
  <div class="list_container">
    <div v-if="item.stop">
      <div class="list-item list_stop">{{item.player}}</div>
      <div class="list-item list_stop">TIME</div>
      <div class="list-item list_stop">OUT</div>
      <div class="list-item list_stop"></div>
    </div>
    <div v-else>
      <div v-if="item.getpoint">
        <div class="list-item">{{item.score}}</div>
        <div class="list-item">{{item.serve}}</div>
        <div class="list-item">{{item.skill}}</div>
        <div class="list-item">{{item.placement}}</div>
      </div>
      <div v-else>
        <div class="list-item list_lostpoint" >{{item.score}}</div>
        <div class="list-item list_lostpoint" >{{item.serve}}</div>
        <div class="list-item list_lostpoint" >{{item.skill}}</div>
        <div class="list-item list_lostpoint" >{{item.placement}}</div>
      </div>
      <div>
        <b-button size="sm" variant="outline-primary" class="changeItem" @click="changeData">改</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data: function () {
    return {
    }
  },
  methods: {
    changeData: function () {
      // trigger popup change modal
      this.$emit('fix')
    }
  }
}
</script>

<style>
.list-item {
  border: 1px solid black;
  width: 90px;
  height: 25px;
  text-align: center;
}

.list_stop {
  background-color: red;
}

.list_lostpoint {
  background-color: yellow;
}

.list_container {
  display: flex;
  flex-direction: column
}
.list_container > div {
  display: flex;
  flex-direction: row;
}

.list_container > div > div{
  display: flex;
  flex-direction: row;
}

.changeItem {
  width: 25px;
  height: 25px;
  align-content: center;
}

.inputItem {
  width: 80px;
}

</style>
