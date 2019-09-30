<template>
  <div class="pac-man">
    <canvas id="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Constant from './Constant'
import Utils from './Utils'

const WIDTH = 960
const HEIGHT = 640


@Component
export default class PacMan extends Vue {
  $canvas: any
  $context: any
  mounted() {
    this.$canvas = Utils.getCanvasElementById("canvas")
    this.$canvas.width = Constant.CANVAS_WIDTH
    this.$canvas.height = Constant.CANVAS_HEIGHT
    this.$context = Utils.getCanvasRenderingContext2D(this.$canvas)
  }
}
</script>

<style scoped lang="scss">
.pac-man {
  position: relative;
}
</style>
