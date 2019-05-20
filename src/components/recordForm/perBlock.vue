<template>
  <svg class="block_contain" width="150" height="150">
    <g>
      <g id="part1">
        <rect x="0" y="0" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
      <g id="part2">
        <rect x="0" y="50" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
      <g id="part3">
        <rect x="0" y="100" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
    </g>
    <g>
      <g id="part4">
        <rect x="50" y="0" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
      <g id="part5">
        <rect x="50" y="50" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
      <g id="part6">
        <rect x="50" y="100" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
    </g>
    <g>
      <g id="part7">
        <rect x="100" y="0" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
      <g id="part8">
        <rect x="100" y="50" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
      <g id="part9">
        <rect x="100" y="100" width="50" height="50" :fill="color" :fill-opacity="opacity"/>
      </g>
    </g>
    <line x1='0' y1='0' x2='0' y2='150' stroke='black'/>
    <line x1='0' y1='0' x2='150' y2='0' stroke='black'/>
    <line x1='150' y1='0' x2='150' y2='150' stroke='black'/>
    <line x1='0' y1='150' x2='150' y2='150' stroke='black'/>
  </svg>
</template>

<script>
export default {
  data: function () {
    return {
      color: 'white',
      opacity: 1
    }
  }
}
</script>

<style>
</style>
