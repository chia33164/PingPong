<template>
  <div class="block_contain">
    <div>
      <div id="part1"></div>
      <div id="part2"></div>
      <div id="part3"></div>
    </div>
    <div>
      <div id="part4"></div>
      <div id="part5"></div>
      <div id="part6"></div>
    </div>
    <div>
      <div id="part7"></div>
      <div id="part8"></div>
      <div id="part9"></div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style>
.block_contain {
  display: flex;
  flex-direction: row;
}
.block_contain > div > div {
  width: 50px;
  height: 50px;
  text-align: center;
  text-align-last: center;
}

</style>
