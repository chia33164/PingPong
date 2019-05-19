<template>
  <div class="list_container">
    <div>
      <div v-if="!change">
        <div class="list-item">{{item.score}}</div>
        <div class="list-item">{{item.serve}}</div>
        <div class="list-item">{{item.skill}}</div>
        <div class="list-item">{{item.placement}}</div>
      </div>
      <div v-else>
        <div class="list-item">{{item.score}}</div>
        <div class="list-item">
          <input type="text" v-model="item.serve" class="inputItem"/>
        </div>
        <div class="list-item">
          <input type="text" v-model="item.skill" class="inputItem"/>
        </div>
        <div class="list-item">{{item.placement}}</div>
      </div>
      <div>
        <button class="changeItem" @click="change = !change">改</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data: function () {
    return {
      change: false
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
}

.inputItem {
  width: 80px;
}

</style>
