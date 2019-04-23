<template>
  <div class="list_container">
    <div>
      <div class="list-item">{{item.score}}</div>
      <div class="list-item">{{item.serve}}</div>
      <div class="list-item">{{item.skill}}</div>
      <div class="list-item">{{item.placement}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item']
}
</script>

<style>
.list-item {
  border: 1px solid black;
  width: 100px;
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
</style>
